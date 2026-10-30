import express from "express"
import { validateBody } from "../middleware/validateBody.js";
import { loginSchema, registerSchema } from "../schema/auth.schema.js";
import {db }from "../db/index.js"
import { eq } from "drizzle-orm";
import { sessions, users } from "../db/schema.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { checkAuth } from "../middleware/checkAuth.js";
export const authRouter =express.Router();


authRouter.post("/register",validateBody(registerSchema),async(req,res)=>{ 
try{
const data = await db.select().from(users).where(eq(users.email,req.body.email))
if(data.length>0){
return res.status(422).json({
"errors":{
"email": { "errors": ["email already in use"] },
 "password": { "errors": ["password must contain..."] }
  } 
})
}
const passwordHash = await bcrypt.hash(req.body.password,10)

await db.insert(users).values({
username: req.body.username,
email: req.body.email,
password_hash: passwordHash
})
 return res.status(201).json({
message: "register successful, you can now login"});
}catch{
 res.status(500).json({
    error: "Internal server error"});
}

});

authRouter.post("/login",validateBody(loginSchema),async(req,res)=>{
try{
const data = await db.select().from(users).where(eq(users.email,req.body.email))
if(data.length==0){
return res.status(422).json({
"error": "invalid email or password" 
})
}
  const existingUser = data[0];
const passwordMatch= await bcrypt.compare(
    req.body.password,
    existingUser.password_hash,
  );
if (!passwordMatch) {
    return res.status(422).json(
 {error: "invalid email or password" }
    );
}
const session={ user_id: existingUser.id,};
const session_id = crypto.randomBytes(16).toString("hex");
const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

await db.insert(sessions).values({session_id, ...session,expires_at});
res.cookie("blog_session", session_id, {
  httpOnly: true,
  sameSite: "lax",
maxAge: 7 * 24 * 60 * 60 * 1000,
  expires: expires_at,
});
return res.status(200).json({   
  message: "login successful",
  data: {
user:{
id: existingUser.id,
email: existingUser.email,
username: existingUser.username
  }
}
    });
}catch{
 res.status(500).json({
error: "Internal server error"});
}
})

authRouter.post("/logout",async(req,res)=>{
 try{
const sessionId = req.cookies.blog_session
if(sessionId){
await db.delete(sessions).where(eq(sessions.session_id,sessionId))
}

res.clearCookie("blog_session");

 return res.status(200).json({
      message: "logout successful",
    });
}catch{
 res.status(500).json({
error: "Internal server error"});
}
})

authRouter.get("/me",checkAuth,async(req,res)=>{
try {
const data = await db.select().from(users)
.where(eq(users.id, req.current_user.user_id));
if (data.length === 0) {
 return res.status(401).json({
error: "Unauthorized",
 });
}
return res.status(200).json({
 data: {
user: {
 id: data[0].id,
email: data[0].email,
username: data[0].username,
},
 },
});
}catch {
return res.status(500).json({
 error: "Internal server error",
    });
}
});




