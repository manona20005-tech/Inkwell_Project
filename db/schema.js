import {pgTable ,primaryKey,timestamp,serial, text, integer, varchar} from "drizzle-orm/pg-core"
import {defineRelations } from "drizzle-orm";
export const users = pgTable("users",{
  id: serial("id").primaryKey(),
  username :varchar("username",{length:225}).notNull(),
  email:varchar("email",{length :225}).unique().notNull(),
  password_hash : text("password_hash").notNull(),
  created_at : timestamp("created_at").defaultNow().notNull()
})


export const sessions= pgTable("sessions",{
  id: serial("id").primaryKey(),
 session_id :varchar("session_id",{length :225}).unique().notNull(),
 user_id :integer("user_id").notNull().references(()=>users.id,{onDelete :"cascade"}),
 expires_at : timestamp("expires_at").notNull(),
  created_at : timestamp("created_at").defaultNow().notNull()
})


export const posts= pgTable("posts",{
  id: serial("id").primaryKey(),
 user_id :integer("user_id").notNull().references(()=>users.id,{onDelete :"cascade"}),
content : text("content").notNull(),
image : text("image"),
  created_at : timestamp("created_at").defaultNow().notNull()
})


export const comments= pgTable("comments",{
  id: serial("id").primaryKey(),
user_id :integer("user_id").notNull().references(()=>users.id,{onDelete :"cascade"}),
 post_id  :integer("post_id").notNull().references(()=>posts.id,{onDelete :"cascade"}),
content : text("content").notNull(),
  created_at : timestamp("created_at").defaultNow().notNull()
})

export const likes= pgTable("likes",{
user_id :integer("user_id").notNull().references(()=>users.id,{onDelete :"cascade"}),
 post_id  :integer("post_id").notNull().references(()=>posts.id,{onDelete :"cascade"}),
  created_at : timestamp("created_at").defaultNow().notNull()
},
(table)=>[primaryKey({columns :[table.user_id,table.post_id]})]
);




export const relations =defineRelations({users, sessions,posts,comments,likes},
(r)=>({
  users :{
    sessions :r.many.sessions({
      from : r.users.id,
      to : r.sessions.user_id
    }),
    comments: r.many.comments({
      from: r.users.id,
      to : r.comments.user_id
    }),
     likes: r.many.likes({
      from: r.users.id,
      to : r.likes.user_id
    }),
      posts: r.many.posts({
      from: r.users.id,
      to : r.posts.user_id
    }),

  },
  likes:{
   users:r.one.users({
    from : r.likes.user_id,
    to : r.users.id
  }),
   posts:r.one.posts({
    from : r.likes.post_id,
    to : r.posts.id
})
},

posts:{
users:r.one.users({
  from:r.posts.user_id,
  to:r.users.id
}),

likes: r.many.likes({
  from: r.posts.id,
  to: r.likes.post_id
}),

comments :r.many.comments({
  from : r.posts.id,
  to :r.comments.post_id
})
},

sessions:{
users :r.one.users({
    from : r.sessions.user_id,
    to:r.users.id
})
},

comments :{
  users :r.one.users({
    from :r.comments.user_id,
    to:r.users.id
  }),

  posts :r.one.posts({
    from :r.comments.post_id,
    to: r.posts.id
  })
}
}))





