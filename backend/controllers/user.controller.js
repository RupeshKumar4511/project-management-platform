import { eq } from 'drizzle-orm';
import { db } from '../config/db.js'
import { tokens, users } from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken, options } from './auth.controller.js';
export const updateUser = async (req, res) => {
    const { newUserName } = req.body;
    try {
        const [user] = await db.select({  username: users.username}).from(users).where(eq(users.username, newUserName));
        if (user) {
            return res.status(409).send({ message: "User already exists." })
        }
        const updatedUser = {id:req.user.id,username:newUserName,email:req.user.email,role:req.user.role} ;

        let accessToken;
        let refreshToken;
        await db.transaction(async (tx) => {
            await tx.update(users).set({ username: newUserName }).where(eq(users.username, req.user.username))    

            accessToken = generateAccessToken(updatedUser);
            refreshToken = generateRefreshToken(updatedUser);

            const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

            await tx.update(tokens).set({ refreshToken: refreshToken, expiredAt: expiresAt }).where(eq(tokens.userId, req.user.id))
        })


        res.cookie("accessToken", accessToken, options)
        res.cookie("refreshToken", refreshToken, options)

        return res.status(200).send({ success: true, message: "Username updated Successfully" })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}