import { and, eq } from 'drizzle-orm'
import { db } from '../config/db.js';
import bcrypt from 'bcrypt'
import generator from 'generate-password'
import { oauthAccount, users } from '../models/user.model.js'


export const getUserWithOauthId = async ({ provider, email }) => {

    const [user] = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        providerAccountId: oauthAccount.providerAccountId,
        provider: oauthAccount.provider,

    }).from(users)
        .where(eq(users.email, email))
        .leftJoin(oauthAccount,
            and(
                eq(oauthAccount.provider, provider),
                eq(oauthAccount.userId, users.id)
            ))

    if (!user) return null;

    return user;
}


export const linkUserWithOauth = async ({ userId, provider, providerAccountId }) => {
    await db.insert(oauthAccount).values({
        userId,
        provider,
        providerAccountId
    })
}


export const createUserWithOauth = async ({ name, email, provider, providerAccountId }) => {
    const user = await db.transaction(async (trx) => {
        const password = generator.generate({
            length: 8,
            numbers: true,
            symbols: '@$!%*?&',
            uppercase: true,
            lowercase: true,
            strict: true
        });

        const hashedPassword = await bcrypt.hash(password, 10)
        const [newUser] = await trx.insert(users).values({ username:name, email, password: hashedPassword, role: 'member' }).
            $returningId;

        await trx.insert(oauthAccount).values({
            provider,
            providerAccountId,
            userId: newUser.id
        }).onConflictDoNothing()

        return newUser;

    })

    return {
        username: name,
        email,
        id: user.id,
        role: 'member'
    }
}

