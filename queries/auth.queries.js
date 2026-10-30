import { eq, and, gt } from "drizzle-orm"
import { db } from "../db/index.js"
import { sessions, users } from "../db/schema.js"
export const getUserBySession = async(sessionId)=>{
const data = await db.select({
user_id: users.id,
username: users.username,
email: users.email
}).from(sessions)
.innerJoin(users,eq(sessions.user_id,users.id))
.where(and(
eq(sessions.session_id,sessionId),
gt(sessions.expires_at,new Date())
))

return data[0]
}
