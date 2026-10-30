import express from "express"
import { getAllPosts, createPost, getPostsById, getPostById, getLikeByUser, addLike, removeLike, getLikeCount } from "../queries/post.queries.js"
import { createComment } from "../queries/comment.query.js"
import { checkAuth } from "../middleware/checkAuth.js"
import { upload } from "../middleware/upload.js"
import { postSchema, insertCommentSchema } from "../schema/post.js"
import { validateBody } from "../middleware/validateBody.js"
export const postRouter = express.Router()

postRouter.get("/",checkAuth,async(req,res)=>{
try{
const Allposts = await getAllPosts(req.current_user.user_id)
return res.status(200).json({
data: Allposts
})
}catch{
return res.status(500).json({
error: "Internal server error"
})
}
})
postRouter.post("/",checkAuth,upload.single("image"),validateBody(postSchema),async(req,res)=>{
try{
const image = req.file ? req.file.filename : null
const data = await createPost(req.current_user.user_id,req.body.content,image)
return res.status(201).json({
message: "post created successfully",
data: data
})
}catch{
return res.status(500).json({
error: "Internal server error"
})
}
})

postRouter.get("/:id",checkAuth,async(req,res)=>{
try{
const data = await getPostsById(Number(req.params.id),req.current_user.user_id)
if(!data){
return res.status(404).json({
error: "post not found"
})
}
return res.status(200).json({
data: data
})
}catch{
return res.status(500).json({
error: "Internal server error"
})
}
})

postRouter.post("/:id/like",checkAuth,async(req,res)=>{
try{
const postId = Number(req.params.id)
const userId = req.current_user.user_id
const post = await getPostById(postId)
if(!post){
return res.status(404).json({
error: "post not found"
})
}
const Likes = await getLikeByUser(userId,postId)
if(Likes.length > 0){
await removeLike(userId,postId)
}else{
await addLike(userId,postId)
}
const like_count = await getLikeCount(postId)
return res.status(200).json({
data: {
liked: Likes.length === 0,
like_count: like_count
}
})
}catch{
return res.status(500).json({
error: "Internal server error"
})
}
})

postRouter.post("/:id/comments",validateBody(insertCommentSchema),checkAuth,async(req,res)=>{
try{
const postId = Number(req.params.id)
const userId = req.current_user.user_id
const content = req.body.content
const post = await getPostById(postId)
if(!post){
return res.status(404).json({
error: "post not found"
})
}
const comment = await createComment(userId,postId,content)
return res.status(201).json({
message: "comment created successfully",
data: comment
})
}catch{
return res.status(500).json({
error: "Internal server error"
})
}
})
