import 'dotenv/config';
import Razorpay from 'razorpay';
import crypto from 'crypto'
import {db} from '../config/db.js'
import {orders} from '../models/order.model.js';
import { and, eq, isNotNull } from 'drizzle-orm';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY_ID,
    key_secret: process.env.RAZORPAY_API_KEY_SECRET
})

export const checkout = async (req, res) => {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
        return res.status(400).send({ success: false, message: "Enter a valid amount" })
    }
    let order;

    try {

        if (amount == 100) {
            order = await razorpay.orders.create({
                amount: Number(amount * 100),
                currency: "INR"
            })

            await db.insert(orders).values({userId: req.user.id,razorpay_order_id:order.id,amount:Number(amount)})

            console.log(`Order created for amount ${amount} with orderId: ${order.id}.`)

            return res.status(200).send({ order, message: `Order created for amount ${amount} with orderId: ${order.id}.` })
        }else{
            return res.status(400).send({success:true, message:"Invalid Amount for plan"})
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: order ? "Internal Server Error" : "Payment Failed" })
    }
}


export const paymentVerification = async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    try {
        const body_data = razorpay_order_id + "|" + razorpay_payment_id;

        const expected = crypto.createHmac('sha256', process.env.RAZORPAY_API_KEY_SECRET).update(body_data).digest('hex');

        const isValid = expected === razorpay_signature;

        if(isValid){
            console.log("payment is successful.");
            
            await db.update(orders).set({razorpay_payment_id, razorpay_order_id, razorpay_signature}).where(eq(orders.userId, req.user.id))


            res.redirect(`${process.env.FRONTEND_URL}/app/payment/success?payment_id ${razorpay_payment_id}`)

            return;
        } else{
            res.redirect(`${process.env.FRONTEND_URL}/app/payment/failure?payment_id ${razorpay_payment_id}`);
            return;
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false,message:"Internal Server Error"})
    }


}

export const getUserPlanDetails = async(req,res)=>{
    try {
        const [userPlan] = await db.select({id:orders.id}).from(orders).where(and(eq(orders.userId,req.user.id),isNotNull(orders.razorpay_payment_id))) ;
        
        if(userPlan){
            return res.status(200).send({payment:false,message:"No premium"})
        }else{
            return res.status(200).send({payment:true,message : "1 premium plan"})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false,message:"Internal Server Error"})
    }
}