export const checkoutSchema = {
    amount: {
        trim : true,
        notEmpty : {
            errorMessage: "Amount can not be empty"
        }
    }
}

export const paymentVerificationSchema = {
    razorpay_order_id: {
        trim : true,
        notEmpty : {
            errorMessage: "razorpay_order_id can not be empty"
        }
    },
    razorpay_payment_id: {
        trim : true,
        notEmpty : {
            errorMessage: "razorpay_payment_id can not be empty"
        }
    },
    razorpay_signature: {
        trim : true,
        notEmpty : {
            errorMessage: "razorpay_signature can not be empty"
        }
    }
}