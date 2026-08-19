import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requireAuth, requireAdmin, AuthRequest } from './src/middleware/auth.ts';
import { adminAuth } from './src/lib/firebase-admin.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { db } from './src/db/index.ts';
import { users, notes, announcements, assignments, communityFeed, upcomingDeadlines, portfolio, projects, sharedLinks, postComments, postReactions, excuses, achievements, groupMembers, chatMessages, studyGroups, appointments, funds, lostAndFound } from './src/db/schema.ts';
import { eq, and } from 'drizzle-orm';

export const app = express();

export async function setupApp() {
  const PORT = parseInt(process.env.PORT || '3000');

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Health check

  // --- Announcements (Admin & Student) ---
  app.get('/api/announcements', requireAuth, async (req: AuthRequest, res) => {
    try {
      const area = req.query.area as string;
      const all = await db.query.announcements.findMany({
        where: area ? (announcements, { eq }) => eq(announcements.area, area) : undefined,
        with: {
          author: true
        },
        orderBy: (announcements, { desc }) => [desc(announcements.createdAt)]
      });
      res.json(all);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/announcements', requireAdmin, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));

      const { title, content, imageUrl, area } = req.body;
      const newAnnouncements = await db.insert(announcements).values({
        title,
        content,
        imageUrl,
        area,
        authorId: user.id
      }).returning();
      res.json(newAnnouncements[0]);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/admin/announcements/:id', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }
      await db.delete(announcements).where(eq(announcements.id, id));
      res.json({ success: true });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- Lost and Found ---
  app.get('/api/lost-and-found', requireAuth, async (req: AuthRequest, res) => {
    try {
      const area = req.query.area as string;
      const all = await db.query.lostAndFound.findMany({
        where: area ? (lf, { eq, and }) => and(eq(lf.area, area), eq(lf.status, 'approved')) : (lf, { eq }) => eq(lf.status, 'approved'),
        with: {
          reportedBy: true
        },
        orderBy: (lf, { desc }) => [desc(lf.createdAt)]
      });
      res.json(all);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/lost-and-found', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));

      const { title, description, imageUrl, area, type } = req.body;
      const isAdmin = user.role === 'admin';

      const newItem = await db.insert(lostAndFound).values({
        title,
        description,
        imageUrl,
        area,
        type: type || 'lost',
        status: isAdmin ? 'approved' : 'pending',
        reportedById: user.id
      }).returning();
      res.json(newItem[0]);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/lost-and-found', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const all = await db.query.lostAndFound.findMany({
        with: {
          reportedBy: true
        },
        orderBy: (lf, { desc }) => [desc(lf.createdAt)]
      });
      res.json(all);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/admin/lost-and-found/:id/status', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }
      const { status } = req.body;
      const updated = await db.update(lostAndFound)
        .set({ status })
        .where(eq(lostAndFound.id, id))
        .returning();
      res.json(updated[0]);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });


  // Admin Routes
  app.get('/api/admin/stats', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const allUsers = await db.select().from(users);
      const allDeadlines = await db.select().from(upcomingDeadlines);
      const allNotes = await db.select().from(notes);
      const allExcuses = await db.select().from(excuses);

      res.json({
        students: allUsers.length,
        deadlines: allDeadlines.length,
        notes: allNotes.length,
        excuses: allExcuses.filter(e => e.status === 'pending').length
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/admin/students', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const allUsers = await db.query.users.findMany({
        with: {
          portfolio: true
        }
      });
      res.json(allUsers.filter(u => u.role !== 'admin'));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.put('/api/admin/students/:id', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      const { fullName, area, status } = req.body;
      const updated = await db.update(users)
        .set({
          ...(fullName !== undefined && { fullName }),
          ...(area !== undefined && { area }),
          ...(status !== undefined && { status }),
        })
        .where(eq(users.id, id))
        .returning();
      res.json(updated[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.get('/api/admin/deadlines', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const allDeadlines = await db.query.upcomingDeadlines.findMany({
        with: { uploader: true },
        orderBy: (d, { asc }) => [asc(d.eventDate)]
      });
      res.json(allDeadlines);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/admin/deadlines', requireAdmin, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      const { name, eventDate, description, location } = req.body;
      const newDeadlines = await db.insert(upcomingDeadlines).values({
        name,
        eventDate: new Date(eventDate),
        description: description || 'No description',
        location: location || 'TBA',
        uploaderId: user.id
      }).returning();
      res.json(newDeadlines[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.delete('/api/admin/deadlines/:id', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }
      await db.delete(upcomingDeadlines).where(eq(upcomingDeadlines.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/admin/excuses', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const allExcuses = await db.query.excuses.findMany({
        with: { user: true },
        orderBy: (e, { desc }) => [desc(e.createdAt)]
      });
      res.json(allExcuses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.patch('/api/admin/excuses/:id/status', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }
      const { status } = req.body;
      await db.update(excuses).set({ status }).where(eq(excuses.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Area Passwords Management API
  let areaPasswords: Record<string, string> = {
    BSIS: process.env.BSIS_PASSWORD || 'DepartmentOfInformationSystem',
    BSCS: process.env.BSCS_PASSWORD || 'DepartmentOfTheHeadComputerScience'
  };

  app.get('/api/admin/passwords', requireAdmin, async (req: AuthRequest, res) => {
    res.json(areaPasswords);
  });

  // Allow admin to update passwords (updates memory - Firestore is the real source of truth)
  app.post('/api/admin/passwords', requireAdmin, async (req: AuthRequest, res) => {
    const { BSIS, BSCS } = req.body;
    if (BSIS) areaPasswords.BSIS = BSIS;
    if (BSCS) areaPasswords.BSCS = BSCS;
    res.json({ message: 'Area passwords updated successfully', passwords: areaPasswords });
  });

  // Allow frontend to sync passwords from Firestore into server memory (no auth needed - just a sync)
  app.post('/api/passwords/sync', async (req, res) => {
    const { BSIS, BSCS } = req.body;
    if (BSIS) areaPasswords.BSIS = BSIS;
    if (BSCS) areaPasswords.BSCS = BSCS;
    res.json({ synced: true });
  });

  app.post('/api/passwords/verify', async (req, res) => {
    const { area, password } = req.body;
    if (!area || !password) return res.status(400).json({ valid: false, error: 'Missing area or password' });
    const currentPass = areaPasswords[area as 'BSIS' | 'BSCS'];
    const valid = !!(currentPass && currentPass === password);
    res.json({ valid });
  });



  async function deleteUserCascade(id: number) {
    // 1. Portfolio & Projects
    const userPortfolios = await db.select().from(portfolio).where(eq(portfolio.userId, id));
    for (const p of userPortfolios) {
      await db.delete(projects).where(eq(projects.portfolioId, p.id));
    }
    await db.delete(portfolio).where(eq(portfolio.userId, id));

    // 2. Community Feed (Posts, Comments, Reactions)
    await db.delete(postReactions).where(eq(postReactions.userId, id));
    await db.delete(postComments).where(eq(postComments.authorId, id));

    const userPosts = await db.select().from(communityFeed).where(eq(communityFeed.authorId, id));
    for (const p of userPosts) {
      await db.delete(postReactions).where(eq(postReactions.postId, p.id));
      await db.delete(postComments).where(eq(postComments.postId, p.id));
    }
    await db.delete(communityFeed).where(eq(communityFeed.authorId, id));

    // Groups
    await db.delete(chatMessages).where(eq(chatMessages.userId, id));
    await db.delete(groupMembers).where(eq(groupMembers.userId, id));

    const createdGroups = await db.select().from(studyGroups).where(eq(studyGroups.createdBy, id));
    for (const g of createdGroups) {
      await db.delete(chatMessages).where(eq(chatMessages.groupId, g.id));
      await db.delete(groupMembers).where(eq(groupMembers.groupId, g.id));
      await db.delete(studyGroups).where(eq(studyGroups.id, g.id));
    }

    // 3. Other Entities
    await db.delete(achievements).where(eq(achievements.userId, id));
    await db.delete(excuses).where(eq(excuses.userId, id));
    await db.delete(sharedLinks).where(eq(sharedLinks.uploaderId, id));
    await db.delete(upcomingDeadlines).where(eq(upcomingDeadlines.uploaderId, id));
    await db.delete(notes).where(eq(notes.uploaderId, id));
    await db.delete(assignments).where(eq(assignments.userId, id));
    await db.delete(announcements).where(eq(announcements.authorId, id));

    // 4. Finally delete the user
    await db.delete(users).where(eq(users.id, id));
  }

  app.delete('/api/users/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      // Only admin can delete other users
      const reqUserObj = await db.select().from(users).where(eq(users.uid, req.user.uid)).then(res => res[0]);
      if (!reqUserObj) return res.status(401).json({ error: 'Unauthorized' });
      const isAdmin = reqUserObj.role === 'admin';
      if (!isAdmin) return res.status(403).json({ error: 'Forbidden' });

      const id = parseInt(req.params.id);

      await deleteUserCascade(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.patch('/api/users/:id/status', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { status } = req.body;
      await db.update(users).set({ status }).where(eq(users.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Delete my account route
  app.delete('/api/users/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [userObj] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!userObj) return res.status(404).json({ error: 'User not found' });

      await deleteUserCascade(userObj.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting own account:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // User sync route
  app.post('/api/users/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const user = await getOrCreateUser(req.user.uid, req.user.email || '', req.user.name, req.user.picture);
      res.json({ user });
    } catch (error: any) {
      console.error('Error syncing user:', error);
      res.status(500).json({ error: 'Failed to sync user' });
    }
  });

  // Example API route protected by auth

  app.put('/api/users/area', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { area } = req.body;
      const [user] = await db.update(users).set({ area }).where(eq(users.uid, req.user.uid)).returning();
      res.json({ user });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Notes routes
  app.get('/api/notes', requireAuth, async (req: AuthRequest, res) => {
    try {
      const allNotes = await db.query.notes.findMany({
        with: {
          uploader: {
            columns: {
              fullName: true,
              email: true
            }
          },
          subject: true,
        },
        orderBy: (notes, { desc }) => [desc(notes.createdAt)]
      });
      res.json(allNotes);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/notes/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });

      const [note] = await db.select().from(notes).where(eq(notes.id, parseInt(req.params.id)));
      if (note && note.uploaderId === user.id) {
        await db.delete(notes).where(eq(notes.id, parseInt(req.params.id)));
        res.json({ success: true });
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/notes', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });

      const { title, description, fileUrl, subjectId } = req.body;
      const newNotes = await db.insert(notes).values({
        title,
        description,
        fileUrl,
        subjectId,
        uploaderId: user.id
      }).returning();
      const newNote = newNotes[0];

      // Update XP for uploading notes
      await db.update(users).set({ xp: (user.xp || 0) + 50 }).where(eq(users.id, user.id));

      res.json(newNote);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Execute code via Judge0 API
  app.post('/api/execute', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { language, code } = req.body;
      const judge0LangMap: Record<string, number> = {
        javascript: 93, // Node.js 18.15.0
        python: 92,     // Python 3.11.2
        cpp: 54,        // C++ (GCC 9.2.0)
        c: 50,          // C (GCC 9.2.0)
        java: 91,       // Java (JDK 17.0.6)
      };

      const languageId = judge0LangMap[language];
      if (!languageId) {
        return res.status(400).json({ error: 'Unsupported language' });
      }

      const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language_id: languageId,
          source_code: code
        })
      });

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Dashboard Stats
  app.get('/api/dashboard', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      const area = req.query.area as string;

      // Get count of notes
      const userNotes = await db.query.notes.findMany({
        where: (notes, { eq }) => eq(notes.uploaderId, user.id)
      });

      // Getting assignments
      const userAssignments = await db.query.assignments.findMany({
        where: (assignments, { eq }) => eq(assignments.userId, user.id),
        with: {
          subject: true
        }
      });

      // Getting announcements
      const userAnnouncements = await db.query.announcements.findMany({
        where: area ? (announcements, { eq }) => eq(announcements.area, area) : undefined,
        with: {
          author: true
        },
        orderBy: (announcements, { desc }) => [desc(announcements.createdAt)]
      });

      res.json({
        xp: user.xp,
        notesCount: userNotes.length,
        assignments: userAssignments,
        announcements: userAnnouncements
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/dashboard/announcements', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });

      const { content, imageUrl, area } = req.body;
      const newAnnouncements = await db.insert(announcements).values({
        content,
        imageUrl,
        area,
        authorId: user.id
      }).returning();
      const newAnnouncement = newAnnouncements[0];

      res.json(newAnnouncement);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Assignments
  app.get('/api/assignments', requireAuth, async (req: AuthRequest, res) => {
    try {
      const area = req.query.area as string;
      const allAssignments = await db.query.assignments.findMany({
        where: area ? (assignments, { eq }) => eq(assignments.area, area) : undefined,
        with: {
          user: {
            columns: {
              fullName: true,
              email: true
            }
          },
          subject: true,
        },
        orderBy: (assignments, { desc }) => [desc(assignments.dueDate)]
      });
      res.json(allAssignments);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/assignments', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });

      const { title, description, dueDate, priority, imageUrl, linkUrl, area } = req.body;
      const newAssignments = await db.insert(assignments).values({
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        imageUrl,
        linkUrl,
        area,
        userId: user.id
      }).returning();
      const newAssignment = newAssignments[0];

      res.json(newAssignment);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/assignments/:id/status', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      const [assignment] = await db.select().from(assignments).where(eq(assignments.id, parseInt(req.params.id)));

      if (assignment && assignment.userId === user.id) {
        const [updated] = await db.update(assignments)
          .set({ status: req.body.status })
          .where(eq(assignments.id, parseInt(req.params.id)))
          .returning();
        res.json(updated);
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/assignments/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      const [assignment] = await db.select().from(assignments).where(eq(assignments.id, parseInt(req.params.id)));
      if (assignment && assignment.userId === user.id) {
        await db.delete(assignments).where(eq(assignments.id, parseInt(req.params.id)));
        res.json({ success: true });
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Community Feed
  app.get('/api/feed', requireAuth, async (req: AuthRequest, res) => {
    try {
      const area = req.query.area as string;
      const allFeed = await db.query.communityFeed.findMany({
        where: area ? (feed, { eq }) => eq(feed.area, area) : undefined,
        with: {
          author: {
            columns: {
              fullName: true,
              email: true,
              avatarUrl: true
            }
          },
          comments: {
            with: {
              author: {
                columns: {
                  fullName: true,
                  email: true,
                  avatarUrl: true
                }
              }
            }
          },
          reactions: true
        },
        orderBy: (feed, { desc }) => [desc(feed.createdAt)]
      });
      res.json(allFeed);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/feed', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });

      const { content, imageUrl, area } = req.body;
      const newPosts = await db.insert(communityFeed).values({
        content,
        imageUrl,
        area,
        authorId: user.id
      }).returning();
      const newPost = newPosts[0];

      const feedPost = await db.query.communityFeed.findFirst({
        where: (feed, { eq }) => eq(feed.id, newPost.id),
        with: {
          author: {
            columns: { fullName: true, email: true, avatarUrl: true }
          }
        }
      });
      res.json(feedPost);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/feed/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      const [post] = await db.select().from(communityFeed).where(eq(communityFeed.id, parseInt(req.params.id)));
      if (post && post.authorId === user.id) {
        await db.delete(postComments).where(eq(postComments.postId, parseInt(req.params.id)));
        await db.delete(postReactions).where(eq(postReactions.postId, parseInt(req.params.id)));
        await db.delete(communityFeed).where(eq(communityFeed.id, parseInt(req.params.id)));
        res.json({ success: true });
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/feed/:id/comments', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      const { content } = req.body;
      const postId = parseInt(req.params.id);

      const newComments = await db.insert(postComments).values({
        postId,
        content,
        authorId: user.id
      }).returning();

      const populatedComment = await db.query.postComments.findFirst({
        where: (c, { eq }) => eq(c.id, newComments[0].id),
        with: {
          author: { columns: { fullName: true, email: true, avatarUrl: true } }
        }
      });

      res.json(populatedComment);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/feed/:id/reactions', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      const postId = parseInt(req.params.id);




      const existing = await db.select().from(postReactions).where(and(eq(postReactions.postId, postId), eq(postReactions.userId, user.id)));

      if (existing.length > 0) {
        await db.delete(postReactions).where(and(eq(postReactions.postId, postId), eq(postReactions.userId, user.id)));
        res.json({ action: 'removed', userId: user.id });
      } else {
        const newReaction = await db.insert(postReactions).values({
          postId,
          userId: user.id
        }).returning();
        res.json({ action: 'added', reaction: newReaction[0] });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Excuses Routes
  app.get('/api/excuses', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });

      const allExcuses = await db.query.excuses.findMany({
        where: (excuse, { eq }) => eq(excuse.userId, user.id),
        orderBy: (excuse, { desc }) => [desc(excuse.createdAt)]
      });

      res.json(allExcuses);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/excuses', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });

      const newExcuse = await db.insert(excuses).values({
        userId: user.id,
        name: req.body.name,
        course: req.body.course,
        reason: req.body.reason,
        details: req.body.details,
        parentName: req.body.parentName,
        studentName: req.body.studentName,
        parentSignature: req.body.parentSignature,
        studentSignature: req.body.studentSignature,
        proofUrl: req.body.proofUrl,
      }).returning();

      res.json(newExcuse[0]);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/excuses/:id/status', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      const [excuse] = await db.select().from(excuses).where(eq(excuses.id, parseInt(req.params.id)));

      if (excuse && excuse.userId === user.id) {
        const [updated] = await db.update(excuses)
          .set({ status: req.body.status })
          .where(eq(excuses.id, parseInt(req.params.id)))
          .returning();
        res.json(updated);
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/excuses/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      const [excuse] = await db.select().from(excuses).where(eq(excuses.id, parseInt(req.params.id)));

      if (excuse && excuse.userId === user.id) {
        await db.delete(excuses).where(eq(excuses.id, parseInt(req.params.id)));
        res.json({ success: true });
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Upcoming Deadlines (Community)
  app.get('/api/community-deadlines', requireAuth, async (req: AuthRequest, res) => {
    try {
      const deadlines = await db.query.upcomingDeadlines.findMany({
        with: {
          uploader: {
            columns: {
              fullName: true,
              email: true
            }
          }
        },
        orderBy: (d, { desc }) => [desc(d.eventDate)]
      });
      res.json(deadlines);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/community-deadlines', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });

      const { name, eventDate, location, description } = req.body;
      const newDeadlines = await db.insert(upcomingDeadlines).values({
        name,
        eventDate: new Date(eventDate),
        location,
        description,
        uploaderId: user.id
      }).returning();
      const newDeadline = newDeadlines[0];

      const populatedDeadline = await db.query.upcomingDeadlines.findFirst({
        where: (d, { eq }) => eq(d.id, newDeadline.id),
        with: {
          uploader: {
            columns: { fullName: true, email: true }
          }
        }
      });
      res.json(populatedDeadline);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/community-deadlines/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      const [deadline] = await db.select().from(upcomingDeadlines).where(eq(upcomingDeadlines.id, parseInt(req.params.id)));
      if (deadline && deadline.uploaderId === user.id) {
        await db.delete(upcomingDeadlines).where(eq(upcomingDeadlines.id, parseInt(req.params.id)));
        res.json({ success: true });
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Portfolio Routes

  // Shared Links
  app.get('/api/links', requireAuth, async (req: AuthRequest, res) => {
    try {
      const allLinks = await db.query.sharedLinks.findMany({
        with: {
          uploader: {
            columns: {
              fullName: true,
              email: true,
              avatarUrl: true
            }
          }
        },
        orderBy: (link, { desc }) => [desc(link.createdAt)]
      });
      res.json(allLinks);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/links', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });

      const { title, url, description } = req.body;
      const newLinks = await db.insert(sharedLinks).values({
        title,
        url,
        description,
        uploaderId: user.id
      }).returning();
      const newLink = newLinks[0];

      const populatedLink = await db.query.sharedLinks.findFirst({
        where: (l, { eq }) => eq(l.id, newLink.id),
        with: {
          uploader: {
            columns: { fullName: true, email: true, avatarUrl: true }
          }
        }
      });
      res.json(populatedLink);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/links/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      const [link] = await db.select().from(sharedLinks).where(eq(sharedLinks.id, parseInt(req.params.id)));
      if (link && link.uploaderId === user.id) {
        await db.delete(sharedLinks).where(eq(sharedLinks.id, parseInt(req.params.id)));
        res.json({ success: true });
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/portfolio', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });

      let [userPortfolio] = await db.select().from(portfolio).where(eq(portfolio.userId, user.id));

      if (!userPortfolio) {
        const portfolios = await db.insert(portfolio).values({
          userId: user.id,
          bio: 'CS Student',
          skills: '[]'
        }).returning();
        userPortfolio = portfolios[0];
      }

      const userProjects = await db.select().from(projects).where(eq(projects.portfolioId, userPortfolio.id));

      res.json({ ...userPortfolio, projects: userProjects });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/portfolio', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      let [userPortfolio] = await db.select().from(portfolio).where(eq(portfolio.userId, user.id));

      if (!userPortfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      const { bio, facebookUrl, githubUrl, skills, phoneNumber, address, studentIdStr, emergencyContact, secondaryEmergencyContact, parentName, fullName } = req.body;
      const updatedPortfolios = await db.update(portfolio)
        .set({
          bio,
          facebookUrl,
          githubUrl,
          skills: Array.isArray(skills) ? JSON.stringify(skills) : skills,
          phoneNumber,
          address,
          studentIdStr,
          emergencyContact,
          secondaryEmergencyContact,
          parentName
        })
        .where(eq(portfolio.id, userPortfolio.id))
        .returning();

      if (fullName) {
        await db.update(users).set({ fullName }).where(eq(users.id, user.id));
      }

      res.json({ ...updatedPortfolios[0], fullName });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/portfolio/projects', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      const [userPortfolio] = await db.select().from(portfolio).where(eq(portfolio.userId, user.id));

      if (!userPortfolio) return res.status(404).json({ error: 'Portfolio not found' });

      const { title, description, url } = req.body;
      const newProjects = await db.insert(projects).values({
        portfolioId: userPortfolio.id,
        title,
        description,
        url
      }).returning();
      const newProject = newProjects[0];

      res.json(newProject);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/portfolio/projects/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) return res.status(400).json({ error: 'Invalid project ID' });

      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });
      const [userPortfolio] = await db.select().from(portfolio).where(eq(portfolio.userId, user.id));

      if (!userPortfolio) return res.status(404).json({ error: 'Portfolio not found' });

      const [existingProject] = await db.select().from(projects).where(and(eq(projects.id, projectId), eq(projects.portfolioId, userPortfolio.id)));
      if (!existingProject) return res.status(404).json({ error: 'Project not found or unauthorized' });

      await db.delete(projects).where(eq(projects.id, projectId));
      res.json({ message: 'Project deleted successfully' });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });



  // Appointments
  app.get('/api/appointments', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });

      const isAdmin = user.role === 'admin';
      let queryOptions: any = {
        with: {
          user: {
            columns: { fullName: true, email: true, avatarUrl: true }
          }
        },
        orderBy: (appointment: any, { desc }: any) => [desc(appointment.createdAt)]
      };

      if (!isAdmin) {
        queryOptions.where = eq(appointments.userId, user.id);
      }

      const allAppointments = await db.query.appointments.findMany(queryOptions);
      res.json(allAppointments);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/appointments', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });

      const { eventDate, time, location, reason } = req.body;
      const newAppointments = await db.insert(appointments).values({
        userId: user.id,
        eventDate: new Date(eventDate),
        time,
        location,
        reason,
        status: 'pending'
      }).returning();

      res.json(newAppointments[0]);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/appointments/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });

      const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
      if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

      const isAdmin = user.role === 'admin';
      if (appointment.userId !== user.id && !isAdmin) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const { status } = req.body;
      const [updatedAppointment] = await db.update(appointments)
        .set({ status })
        .where(eq(appointments.id, id))
        .returning();
      res.json(updatedAppointment);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/appointments/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });

      const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
      if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

      const isAdmin = user.role === 'admin';
      if (appointment.userId === user.id || isAdmin) {
        await db.delete(appointments).where(eq(appointments.id, id));
        res.json({ success: true });
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Funds
  app.get('/api/funds', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const allFunds = await db.query.funds.findMany({
        with: {
          author: {
            columns: { fullName: true, email: true, avatarUrl: true }
          }
        },
        orderBy: (fund, { desc }) => [desc(fund.createdAt)]
      });
      res.json(allFunds);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/funds', requireAdmin, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!user) return res.status(404).json({ error: 'User not found' });

      const { title, amount, type, description } = req.body;
      const newFunds = await db.insert(funds).values({
        title,
        amount,
        type,
        description,
        authorId: user.id
      }).returning();

      res.json(newFunds[0]);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/funds/:id', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      await db.delete(funds).where(eq(funds.id, id));
      res.json({ success: true });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });


  // Students API
  app.get('/api/students', requireAuth, async (req: AuthRequest, res) => {
    try {
      const area = req.query.area as string;
      const allUsers = await db.query.users.findMany({
        with: {
          portfolio: {
            with: {
              projects: true
            }
          },
          notes: true,
          sharedLinks: true
        }
      });

      const studentsOnly = allUsers.filter(u => u.role !== 'admin');

      // Ensure portfolios exist for all student records
      for (const student of studentsOnly) {
        if (!student.portfolio) {
          try {
            const [created] = await db.insert(portfolio).values({
              userId: student.id,
              bio: 'Student at CS Student Hub',
              skills: '[]'
            }).returning();
            student.portfolio = { ...created, projects: [] };
          } catch (e) {
            console.error('Error creating default portfolio for student:', e);
          }
        }
      }

      // Filter by area if specified and not 'ALL'
      if (area && area !== 'ALL' && area !== 'all') {
        const filtered = studentsOnly.filter(u => !u.area || u.area.toUpperCase() === area.toUpperCase());
        return res.json(filtered.length > 0 ? filtered : studentsOnly);
      }

      res.json(studentsOnly);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY) {
  setupApp().then((app) => {
    const PORT = parseInt(process.env.PORT || '3000');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}
