const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetImport = "import { users, notes, announcements, assignments, communityFeed, upcomingDeadlines, portfolio, projects, sharedLinks, postComments, postReactions, excuses } from './src/db/schema.ts';";
const replaceImport = "import { users, notes, announcements, assignments, communityFeed, upcomingDeadlines, portfolio, projects, sharedLinks, postComments, postReactions, excuses, achievements, groupMembers, chatMessages, studyGroups } from './src/db/schema.ts';";

code = code.replace(targetImport, replaceImport);

const targetDelete = `  async function deleteUserCascade(id: number) {
    // 1. Portfolio & Projects
    const userPortfolios = await db.select().from(portfolio).where(eq(portfolio.userId, id));
    for (const p of userPortfolios) {
      await db.delete(projects).where(eq(projects.portfolioId, p.id));
    }
    await db.delete(portfolio).where(eq(portfolio.userId, id));
    
    // 2. Community Feed (Posts, Comments, Reactions)
    // Delete user's own reactions and comments
    await db.delete(postReactions).where(eq(postReactions.userId, id));
    await db.delete(postComments).where(eq(postComments.authorId, id));
    
    // Delete reactions and comments on user's posts
    const userPosts = await db.select().from(communityFeed).where(eq(communityFeed.authorId, id));
    for (const p of userPosts) {
      await db.delete(postReactions).where(eq(postReactions.postId, p.id));
      await db.delete(postComments).where(eq(postComments.postId, p.id));
    }
    await db.delete(communityFeed).where(eq(communityFeed.authorId, id));
    
    // 3. Other Entities
    await db.delete(excuses).where(eq(excuses.userId, id));
    await db.delete(sharedLinks).where(eq(sharedLinks.uploaderId, id));
    await db.delete(upcomingDeadlines).where(eq(upcomingDeadlines.uploaderId, id));
    await db.delete(notes).where(eq(notes.uploaderId, id));
    await db.delete(assignments).where(eq(assignments.userId, id));
    await db.delete(announcements).where(eq(announcements.authorId, id));
    
    // 4. Finally delete the user
    await db.delete(users).where(eq(users.id, id));
  }`;

const replaceDelete = `  async function deleteUserCascade(id: number) {
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
  }`;

code = code.replace(targetDelete, replaceDelete);
fs.writeFileSync('server.ts', code);
