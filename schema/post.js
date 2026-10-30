
import { createInsertSchema } from "drizzle-orm/zod";
import { posts, comments } from "../db/schema.js"
export const postSchema = createInsertSchema(posts, {
  content: (schema) => schema.min(1),}).omit({ id: true, user_id: true, created_at: true })
.required({ content: true })
export const insertCommentSchema = createInsertSchema(comments, {
  content: (schema) => schema.min(1),}).omit({ id: true, user_id: true, post_id: true, created_at: true })
.required({ content: true })
