import { getUserBySession } from "../queries/auth.queries.js"
export const checkAuth = async(req,res,next)=>{
try{
const sessionId = req.cookies.blog_session
if(!sessionId){
return res.status(401).json({
error: "Unauthorized",
})
}
const user = await getUserBySession(sessionId)
if(!user){
return res.status(401).json({
error: "Unauthorized",
})
}
req.current_user = user
next()
}catch{
return res.status(500).json({
error: "Internal server error",
})
}
}
