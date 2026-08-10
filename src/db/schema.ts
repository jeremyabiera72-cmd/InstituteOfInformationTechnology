import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  role: text('role').default('student'), // 'student' or 'admin'
  xp: integer('xp').default(0),
  status: text('status').default('active'),
  area: text('area'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  notes: many(notes),
  sharedLinks: many(sharedLinks),
  portfolio: one(portfolio, {
    fields: [users.id],
    references: [portfolio.userId]
  }),
}));

export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  fileUrl: text('file_url').notNull(),
  subjectId: integer('subject_id').references(() => subjects.id),
  uploaderId: integer('uploader_id').references(() => users.id).notNull(),
  downloads: integer('downloads').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notesRelations = relations(notes, ({ one }) => ({
  uploader: one(users, {
    fields: [notes.uploaderId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [notes.subjectId],
    references: [subjects.id],
  }),
}));

export const assignments = pgTable('assignments', {
  area: text('area'), // assignments
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  subjectId: integer('subject_id').references(() => subjects.id),
  dueDate: timestamp('due_date').notNull(),
  status: text('status').default('pending'), // 'pending', 'completed'
  priority: text('priority').default('medium'), // 'low', 'medium', 'high'
  imageUrl: text('image_url'),
  linkUrl: text('link_url'),
  userId: integer('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const assignmentsRelations = relations(assignments, ({ one }) => ({
  user: one(users, {
    fields: [assignments.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [assignments.subjectId],
    references: [subjects.id],
  }),
}));

export const studyGroups = pgTable('study_groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  subjectId: integer('subject_id').references(() => subjects.id),
  createdBy: integer('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const groupMembers = pgTable('group_members', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id').references(() => studyGroups.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  joinedAt: timestamp('joined_at').defaultNow(),
});

export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id').references(() => studyGroups.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: text('title'),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  authorId: integer('author_id').references(() => users.id).notNull(),
  area: text('area'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const announcementsRelations = relations(announcements, ({ one }) => ({
  author: one(users, {
    fields: [announcements.authorId],
    references: [users.id],
  }),
}));

export const portfolio = pgTable('portfolio', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  bio: text('bio'),
  facebookUrl: text('facebook_url'),
  phoneNumber: text('phone_number'),
  address: text('address'),
  studentIdStr: text('student_id_str'), // using string for student ID
  emergencyContact: text('emergency_contact'),
  secondaryEmergencyContact: text('secondary_emergency_contact'),
  parentName: text('parent_name'),
  githubUrl: text('github_url'),
  skills: text('skills'), // stored as JSON or comma separated
  createdAt: timestamp('created_at').defaultNow(),
});

export const communityFeed = pgTable('community_feed', {
  area: text('area'), // communityFeed
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  authorId: integer('author_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const postComments = pgTable('post_comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => communityFeed.id).notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const postReactions = pgTable('post_reactions', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => communityFeed.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
});

export const communityFeedRelations = relations(communityFeed, ({ one, many }) => ({
  author: one(users, {
    fields: [communityFeed.authorId],
    references: [users.id],
  }),
  comments: many(postComments),
  reactions: many(postReactions)
}));

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  author: one(users, {
    fields: [postComments.authorId],
    references: [users.id],
  }),
  post: one(communityFeed, {
    fields: [postComments.postId],
    references: [communityFeed.id],
  })
}));

export const excuses = pgTable('excuses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  course: text('course').notNull(),
  reason: text('reason').notNull(),
  details: text('details').notNull(),
  parentName: text('parent_name').notNull(),
  studentName: text('student_name').notNull(),
  parentSignature: text('parent_signature').notNull(),
  studentSignature: text('student_signature').notNull(),
  proofUrl: text('proof_url'),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const excusesRelations = relations(excuses, ({ one }) => ({
  user: one(users, {
    fields: [excuses.userId],
    references: [users.id],
  })
}));

export const postReactionsRelations = relations(postReactions, ({ one }) => ({
  post: one(communityFeed, {
    fields: [postReactions.postId],
    references: [communityFeed.id],
  }),
  user: one(users, {
    fields: [postReactions.userId],
    references: [users.id],
  })
}));

export const upcomingDeadlines = pgTable('upcoming_deadlines', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  eventDate: timestamp('event_date').notNull(),
  location: text('location').notNull(),
  description: text('description').notNull(),
  uploaderId: integer('uploader_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const upcomingDeadlinesRelations = relations(upcomingDeadlines, ({ one }) => ({
  uploader: one(users, {
    fields: [upcomingDeadlines.uploaderId],
    references: [users.id],
  }),
}));

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  portfolioId: integer('portfolio_id').references(() => portfolio.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  url: text('url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const portfolioRelations = relations(portfolio, ({ many, one }) => ({
  user: one(users, {
    fields: [portfolio.userId],
    references: [users.id]
  }),
  projects: many(projects)
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  portfolio: one(portfolio, {
    fields: [projects.portfolioId],
    references: [portfolio.id]
  })
}));

export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  iconUrl: text('icon_url'),
  createdAt: timestamp('created_at').defaultNow(),
});


export const sharedLinks = pgTable('shared_links', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  description: text('description'),
  uploaderId: integer('uploader_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const sharedLinksRelations = relations(sharedLinks, ({ one }) => ({
  uploader: one(users, {
    fields: [sharedLinks.uploaderId],
    references: [users.id],
  }),
}));


export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  eventDate: timestamp('event_date').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  reason: text('reason').notNull(),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
}));

export const funds = pgTable('funds', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  amount: integer('amount').notNull(),
  type: text('type').default('expense').notNull(), // 'income' or 'expense'
  description: text('description'),
  authorId: integer('author_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const fundsRelations = relations(funds, ({ one }) => ({
  author: one(users, {
    fields: [funds.authorId],
    references: [users.id],
  }),
}));


export const lostAndFound = pgTable('lost_and_found', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status').default('pending'), // 'pending', 'approved', 'resolved'
  imageUrl: text('image_url'),
  reportedById: integer('reported_by_id').references(() => users.id).notNull(),
  area: text('area'),
  type: text('type').default('lost'), // 'lost' or 'found'
  createdAt: timestamp('created_at').defaultNow(),
});

export const lostAndFoundRelations = relations(lostAndFound, ({ one }) => ({
  reportedBy: one(users, {
    fields: [lostAndFound.reportedById],
    references: [users.id],
  }),
}));
