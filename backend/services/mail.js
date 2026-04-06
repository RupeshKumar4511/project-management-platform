import otpModel from '../models/otp.model.js'
import { db } from '../config/db.js'
import bcrypt from 'bcrypt'
import { config } from 'dotenv';
import nodemailer from 'nodemailer'
import sgMail from '@sendgrid/mail';
config()


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.GMAIL_APP_PASSWORD
//     }
// });

const sendOtp = async (body) => {
    const { email } = body;


    const otp = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP Code is ${otp}`,
        html: `<div>
            <h2>Welcome to Workspace Hub </h2>
            <h2>Your OTP Code is ${otp}</h2>
        </div>`

    }

    const response = await sgMail.send(mailOptions);
    // const response = await transporter.sendMail(mailOptions);
    console.log(response);

    const hashedOtp = await bcrypt.hash(otp.toString(), 10)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 5);// 5 minute
    await db.insert(otpModel).values({ emailId: email, otp: hashedOtp, expiredAt: expiresAt })


}

export default sendOtp;


export const sendMemberInvitation = async (body) => {
    const { email, workspaceName, username, password } = body;

    // for existing user 
    let mailOptions;
    if (!username && !password) {
        mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `Invitation from ${workspaceName}`,
            html: `<div>
            <h2>Welcome to Workspace Hub </h2>
            <p>You can join ${workspaceName} by using your own email and password : </p>
        </div>`

        }
    }

    // for new user
    mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Member Invitation from ${workspaceName}`,
        html: `<div>
            <h2>Welcome to Workspace Hub </h2>
            <p>You can join ${workspaceName} by using following credentials : </p>
            <h3>Username is ${username}</h3>
            <p>You can also use your email as username</p>
            <h3>Password is ${password}</h3>
            <strong>You are requested to please reset your username and password for security purpose.</strong>
        </div>`

    }

    const response = await transporter.sendMail(mailOptions);
    console.log(response);

}

export const sendTaskInvitation = async (body) => {
    const { email, title, description,workspaceName } = body;

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Task Invitation from ${workspaceName}`,
        html: `<div>
            <p>You have assigned a new task </p>
            <h3>Title:  ${title}</h3>
            <h3>Description:  ${description}</h3>
        </div>`

    }

    const response = await transporter.sendMail(mailOptions);
    console.log(response);
}
