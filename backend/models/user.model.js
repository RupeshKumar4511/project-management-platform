import { uniqueIndex,check, pgEnum ,integer, timestamp} from 'drizzle-orm/pg-core'
import { uuid, varchar,text } from 'drizzle-orm/pg-core'
import {pgTable} from 'drizzle-orm/pg-core'

import {sql} from 'drizzle-orm'
import { index } from 'drizzle-orm/gel-core'


export const roleEnum = pgEnum('role',["admin","member","guest"])
export const providerEnum = pgEnum('provider',["github","google"])

export const users =  pgTable("users",{
    id:uuid('id').primaryKey().defaultRandom(),
    username:varchar('username',{length:32}).notNull().unique(),
    email:varchar('email',{length:255}).notNull().unique(),
    password:text('password').notNull(),
    role:roleEnum('role').default('member').notNull(),
    createdAt:timestamp("created_at").notNull().defaultNow(),
    updatedAt:timestamp('updated_at').notNull().defaultNow()
},(users)=>[
    uniqueIndex('unique_user').on(users.username,users.email),
    check('email_regex',sql`${users.email}~'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'`)
])

export const oauthAccount = pgTable("oauth_account",{
    id:uuid('id').primaryKey().defaultRandom(),
    userId:uuid('user_id').notNull().references(()=>users.id,{onDelete:'cascade'}),
    provider:providerEnum('provider').notNull(),
    providerAccountId : varchar("provider_account_id",{length:255}).notNull().unique(),
    createdAt:timestamp("created_at").notNull().defaultNow()

})

export const tokens = pgTable("tokens",{
    id:uuid("id").primaryKey().defaultRandom(),
    userId:uuid("user_id").notNull().references(()=>users.id,{onDelete:'cascade'}),
    refreshToken:varchar("refresh_token").notNull(),
    createdAt:timestamp("created_at").defaultNow().notNull(),
    expiredAt:timestamp("expired_at").notNull()
},(tokens)=>[
    index('user_Id_index').on(tokens.userId)
])
