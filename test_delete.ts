import { db } from './src/db/index.ts';
import { users, portfolio, projects, postReactions, postComments, communityFeed, excuses, sharedLinks, upcomingDeadlines, notes, assignments, announcements, achievements, groupMembers, chatMessages, studyGroups } from './src/db/schema.ts';
import { eq } from 'drizzle-orm';

async function testDelete() {
  const id = 1; // trying to delete user 1 (jeremyabiera72@gmail.com)
  try {
    // Groups
    await db.delete(chatMessages).where(eq(chatMessages.userId, id));
    await db.delete(groupMembers).where(eq(groupMembers.userId, id));
    
    const createdGroups = await db.select().from(studyGroups).where(eq(studyGroups.createdBy, id));
    for (const g of createdGroups) {
      await db.delete(chatMessages).where(eq(chatMessages.groupId, g.id));
      await db.delete(groupMembers).where(eq(groupMembers.groupId, g.id));
      await db.delete(studyGroups).where(eq(studyGroups.id, g.id));
    }

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
    console.log("Success");
  } catch (e) {
    console.error("Failed:", e);
  }
}
testDelete();
