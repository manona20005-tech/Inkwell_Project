
import { db } from "./db/index.js";
import { users, posts, comments, likes } from "./db/schema.js";
import bcrypt from "bcrypt";

const seed = async () => {
  try {
    const passwordHash = await bcrypt.hash("12345678", 10);

    const insertedUsers = await db.insert(users).values([
      { username: "menna", email: "menna@example.com", password_hash: passwordHash },
      { username: "ahmed", email: "ahmed@example.com", password_hash: passwordHash },
      { username: "sara", email: "sara@example.com", password_hash: passwordHash },
      { username: "omar", email: "omar@example.com", password_hash: passwordHash },
      { username: "nour", email: "nour@example.com", password_hash: passwordHash },
      { username: "mariam", email: "mariam@example.com", password_hash: passwordHash },
    ]).returning();

    const insertedPosts = await db.insert(posts).values([
      { user_id: insertedUsers[0].id, content: "This is my first post!" },
      { user_id: insertedUsers[1].id, content: "Welcome to my blog!" },
      { user_id: insertedUsers[2].id, content: "Today is a beautiful day!" },
      { user_id: insertedUsers[3].id, content: "Learning Node.js and Express is fun." },
      { user_id: insertedUsers[4].id, content: "Working on my new project." },
      { user_id: insertedUsers[5].id, content: "Never stop learning!" },
      { user_id: insertedUsers[0].id, content: "Enjoying my weekend." },
      { user_id: insertedUsers[1].id, content: "Just finished a new book." },
      { user_id: insertedUsers[2].id, content: "Coffee makes everything better." },
      { user_id: insertedUsers[3].id, content: "Building something amazing!" },
      { user_id: insertedUsers[4].id, content: "Small steps every day." },
      { user_id: insertedUsers[5].id, content: "Hello everyone!" },
    ]).returning();

    await db.insert(comments).values([
      { user_id: insertedUsers[1].id, post_id: insertedPosts[0].id, content: "Nice post!" },
      { user_id: insertedUsers[2].id, post_id: insertedPosts[0].id, content: "I like this!" },
      { user_id: insertedUsers[3].id, post_id: insertedPosts[0].id, content: "Great work!" },
      { user_id: insertedUsers[0].id, post_id: insertedPosts[1].id, content: "Great blog!" },
      { user_id: insertedUsers[2].id, post_id: insertedPosts[1].id, content: "Welcome!" },
      { user_id: insertedUsers[4].id, post_id: insertedPosts[2].id, content: "Beautiful!" },
      { user_id: insertedUsers[5].id, post_id: insertedPosts[2].id, content: "I agree!" },
      { user_id: insertedUsers[0].id, post_id: insertedPosts[3].id, content: "Keep going!" },
      { user_id: insertedUsers[1].id, post_id: insertedPosts[3].id, content: "Very useful." },
      { user_id: insertedUsers[3].id, post_id: insertedPosts[4].id, content: "Good luck!" },
      { user_id: insertedUsers[5].id, post_id: insertedPosts[4].id, content: "Looks great!" },
      { user_id: insertedUsers[2].id, post_id: insertedPosts[5].id, content: "Exactly!" },
      { user_id: insertedUsers[4].id, post_id: insertedPosts[5].id, content: "Keep learning!" },
      { user_id: insertedUsers[1].id, post_id: insertedPosts[6].id, content: "Enjoy!" },
      { user_id: insertedUsers[3].id, post_id: insertedPosts[7].id, content: "Which book?" },
      { user_id: insertedUsers[0].id, post_id: insertedPosts[8].id, content: "Absolutely!" },
      { user_id: insertedUsers[5].id, post_id: insertedPosts[9].id, content: "Can't wait to see it!" },
      { user_id: insertedUsers[2].id, post_id: insertedPosts[10].id, content: "That's true!" },
    ]);

    await db.insert(likes).values([
      { user_id: insertedUsers[1].id, post_id: insertedPosts[0].id },
      { user_id: insertedUsers[2].id, post_id: insertedPosts[0].id },
      { user_id: insertedUsers[3].id, post_id: insertedPosts[0].id },
      { user_id: insertedUsers[4].id, post_id: insertedPosts[0].id },
      { user_id: insertedUsers[0].id, post_id: insertedPosts[1].id },
      { user_id: insertedUsers[2].id, post_id: insertedPosts[1].id },
      { user_id: insertedUsers[3].id, post_id: insertedPosts[1].id },
      { user_id: insertedUsers[0].id, post_id: insertedPosts[2].id },
      { user_id: insertedUsers[4].id, post_id: insertedPosts[2].id },
      { user_id: insertedUsers[5].id, post_id: insertedPosts[2].id },
      { user_id: insertedUsers[1].id, post_id: insertedPosts[3].id },
      { user_id: insertedUsers[2].id, post_id: insertedPosts[3].id },
      { user_id: insertedUsers[5].id, post_id: insertedPosts[4].id },
      { user_id: insertedUsers[0].id, post_id: insertedPosts[4].id },
      { user_id: insertedUsers[3].id, post_id: insertedPosts[5].id },
      { user_id: insertedUsers[4].id, post_id: insertedPosts[5].id },
      { user_id: insertedUsers[1].id, post_id: insertedPosts[6].id },
      { user_id: insertedUsers[5].id, post_id: insertedPosts[7].id },
      { user_id: insertedUsers[0].id, post_id: insertedPosts[8].id },
      { user_id: insertedUsers[2].id, post_id: insertedPosts[9].id },
    ]);

    console.log("Seed data inserted successfully");
  } catch (error) {
    console.log(error);
  }
};

seed();
