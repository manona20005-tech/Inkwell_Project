
import { eq,and } from "drizzle-orm";
import { db } from "../db/index.js";
import { comments, likes, posts, users } from "../db/schema.js";

export async function getAllPosts(userId){
    const data = await db.select({
      id: posts.id,
      content: posts.content,
      image: posts.image,
      created_at: posts.created_at,
      username: users.username,
    }).from(posts).innerJoin(users, eq(posts.user_id ,users.id))
      const result = [];
   for (const post of data) {
const likeCount = await db.select().from(likes).where(eq(likes.post_id,post.id))  
const commentCount = await db.select().from(comments).where(eq(comments.post_id, post.id));
const liked = await db.select().from(likes).where(and
(eq(likes.post_id, post.id),
eq(likes.user_id, userId)
)
  );

result.push({
...post,
 like_count: likeCount.length,
  comment_count: commentCount.length,
  liked_by_me: liked.length > 0,

});
   }
return result;
}

export async function getPostsById(id, userId){
   const data = await db.select({
 id: posts.id,
content: posts.content,
image: posts.image,
created_at: posts.created_at,
username: users.username,
}).from(posts).innerJoin(users, eq(posts.user_id ,users.id))
.where(eq(posts.id, id))

if(data.length === 0){
return null;
}
const post = data[0];
const likeCount = await db.select().from(likes).where(eq(likes.post_id, post.id))  
const commentCount = await db.select().from(comments).where(eq(comments.post_id, post.id));
const liked = await db.select().from(likes).where(and(
eq(likes.post_id, post.id),
eq(likes.user_id, userId)
));
const postComments = await db.select({
      id: comments.id,
      content: comments.content,
      created_at: comments.created_at,
      username: users.username,
    }).from(comments).innerJoin(users, eq(comments.user_id, users.id))
    .where(eq(comments.post_id, id));
return{
post:{
...post,
 like_count: likeCount.length,
  comment_count: commentCount.length,
  liked_by_me: liked.length > 0,
},
comments: postComments
}
}
export async function getPostById(id){
    const data = await db.select().from(posts).where(eq(posts.id, id));
    return data[0];
}

export async function createPost(user_id,content,image){
    const data = await db.insert(posts).values({user_id,content,image}).returning()
    return data;
}
export async function deletePost(id) {
  const data = await db.delete(posts).where(eq(posts.id, id)).returning();
  return data;
}
export async function addLike(user_id, post_id) {
  const data = await db.insert(likes).values({user_id,post_id}).returning();
  return data;
}
export async function removeLike(user_id, post_id) {
  const data = await db.delete(likes).where(
    and(eq(likes.user_id, user_id),eq(likes.post_id, post_id))).returning();
  return data;
}

export async function getLikeCount(post_id) {
    const data = await db.select().from(likes).where(eq(likes.post_id, post_id));
    return data.length;
}
export  async function getLikeByUser(user_id, post_id){
 const data = await db.select().from(likes).where(and(eq(likes.post_id, post_id),
   eq(likes.user_id, user_id))
);
   return data;
}
