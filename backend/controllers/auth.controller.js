import { db } from '../config/db.js';
import { users, tokens } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { eq, or } from 'drizzle-orm';
import { config } from 'dotenv'
import sendOtp from '../services/mail.js'
config()

// generate accessToken and refresh Tokens
export const generateAccessToken = (user) => {
    return jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email
    }, process.env.JWT_SECRET, {
        expiresIn: '15m'
    })

}

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
}

export const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

//  signup controller 
export const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const [user] = await db.select().from(users).where(or(eq(users.username, username), eq(users.email,email)))
        
        if (user) {
            return res.status(409).send({ message: "User already exists." })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        
        await db.insert(users).values({ username:username, email:email, password:hashedPassword })
        
        return res.status(201).send({ success: true, message: "SignUp Successfully" })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: "Internal server error" })
    }

}

// login controller
export const login = async (req, res) => {
    const { username:identifier, password } = req.body;
    const errorMsg = { success: false, message: "Username or Password is Wrong" };

    try {
        const [user] = await db.select().from(users).where(or(eq(users.username, identifier), eq(users.email, identifier)))

        if (!user) {
            return res.status(404).send(errorMsg)
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            return res.status(401).send(errorMsg)
        }

        const [dbToken] = await db.select().from(tokens).where(eq(tokens.userId, user.id))

        if(dbToken){
            await db.delete(tokens).where(eq(tokens.userId,user.id))
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

        await db.insert(tokens).values({ userId: user.id, refreshToken:refreshToken, expiredAt: expiresAt })


        res.cookie("accessToken", accessToken, options)
        res.cookie("refreshToken",refreshToken, options)

        return res.status(200).send({ success: true,username:user.username, email:user.email, message: "Login Successfully" })

    } catch (error) {
        return res.status(500).send({ success: false, message: "internal server error" })
    }



}


// generate New refreshToken
export const generateNewRefreshToken = async (req, res) => {
    const token = req.cookies?.refreshToken;
    
    if (!token) {
        return res.status(401).send({ message: "Unauthorized Request" })
    }

    try {

        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        const [dbToken] = await db.select().from(tokens).where(eq(tokens.userId, decodedData.id))

        if (!dbToken) {
            return res.status(403).send({ message: "Invalid Refresh token" })
        }       

        if (dbToken?.refreshToken !== token) {
            return res.status(403).send({ success:false, message: "your refresh token is expired or used", code:"SIGNED_OUT" })
        }

        const accessToken = generateAccessToken(decodedData)
        const newRefreshToken = generateRefreshToken(decodedData)

        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
        await db.update(tokens).set({ refreshToken: newRefreshToken,expiredAt:expiresAt }).where(eq(dbToken.refreshToken, token))

        res.cookie("accessToken", accessToken,options)
        res.cookie("refreshToken", newRefreshToken,options)

        res.status(200).send({success:true,username:decodedData.username,email:decodedData.email})

    } catch (error) {
        return res.status(401).send({ success: false, message: "Invalid or Expired Token" });
    }
}

// logOut Controller
export const logOut = async (req, res) => {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken && !refreshToken) {
        return res.status(401).send({ success: false, message: "Unauthorized Request." })
    }

    try {

        const tokenToVerify = refreshToken || accessToken;

        const decodedData = jwt.verify(tokenToVerify, process.env.JWT_SECRET)

        const [dbToken] = await db.select().from(tokens).where(eq(tokens.userId, decodedData.id))

        if (!dbToken) {
            return res.status(403).send({ message: "Invalid Refresh token" })
        }

        if (refreshToken && dbToken.refreshToken !== refreshToken) {
            res.clearCookie("accessToken",options)
            res.clearCookie("refreshToken",options)
            return res.status(403).send({success:false, message: "your refresh token is expired or used",code:"SIGNED_OUT" })
        }

        await db.delete(tokens).where(eq(tokens.userId, decodedData.id));

        res.clearCookie("accessToken",options)
        res.clearCookie("refreshToken",options)

        return res.status(200).send({ logout: true, message: "Logout Successfully." })


    } catch (error) {
        return res.status(401).send({ success: false, message: "Invalid or Expired Token" });
    }

}

export const verifyUser = async(req,res)=>{
    const {email} = req.body;

    const [user] = await db.select({email:users.email}).from(users).where(eq(users.email,email));

    if(!user){
        res.status(400).send({success:false,message:"Incorrect Email"})
    }

    return res.status(200).send({success:true,message:"Email Verified Successfully."})
    


}

export const resetPassword = async(req,res)=>{
    const {email,password} = req.body;

    const [user] = await db.select({email:users.email}).from(users).where(eq(users.email,email));

    if(!user){
        return res.status(401).send({success:false,message:"Unauthorized Request."})
    }
    const hashedPassword = await bcrypt.hash(password,10)
    await db.update(users).set({password:hashedPassword}).where(eq(users.email,email))

    return res.status(200).send({success:true,message:"Password reset Successfully"})
    
}


export const sendEmailController = async (req, res) => {
  try {
    await sendOtp(req.body);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.log(err)
    return res.status(500).send({success:false,message:"Internal Server Error"})
  }
};


export const getUserData = async(req,res)=>{
    return res.status(200).send({success:true,username:req.user.username,email:req.user.email})
}