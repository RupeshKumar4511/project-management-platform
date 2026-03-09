import jwt from 'jsonwebtoken';
import {config} from 'dotenv';
config()
export const ensureAuth = async(req,res,next)=>{
    const accessToken = req.cookies?.accessToken;
    if(!accessToken){
        return res.status(401).send({success:false,message:"Access Token is required"})
    }

    try {
        const decodedData = jwt.verify(accessToken,process.env.JWT_SECRET);
        req.user = decodedData;
        

        return next()
        
    } catch (error) {
        const message = error.name === 'TokenExpiredError' 
            ? "Token expired" 
            : "Invalid token";

        return res.status(401).json({ 
            success: false, 
            message 
        });
    }
}