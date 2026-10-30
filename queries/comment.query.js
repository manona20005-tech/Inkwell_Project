
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { comments, users } from "../db/schema.js";
export async function getPostComments(post_id) {
const data = await db.select({
 id: comments.id,
 content: comments.content,
 created_at: comments.created_at,
username: users.username,
}).from(comments).innerJoin(users, eq(comments.user_id, users.id))
.where(eq(comments.post_id, post_id));
return data;
}
export async function createComment(user_id, post_id, content) {
const data = await db.insert(comments).values({
user_id,
post_id,
content}).returning();
const result = await db.select({
 id: comments.id,
content: comments.content,
created_at: comments.created_at,
username: users.username
}).from(comments).innerJoin(users, eq(comments.user_id, users.id))
.where(eq(comments.id, data[0].id));
    return result[0];
}
