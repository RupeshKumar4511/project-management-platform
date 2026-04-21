import {Router} from 'express';
import { checkout, getUserPlanDetails, paymentVerification } from '../controllers/payment.controller.js';
import {checkSchema} from 'express-validator'
import { checkoutSchema, paymentVerificationSchema } from '../utils/payment.validationSchema.js';
import { schemaValidation } from '../middleware/schema.validation.js';

const router = Router();

router.route('/').post(checkSchema(checkoutSchema),schemaValidation,checkout);
router.route('/verification').post(checkSchema(paymentVerificationSchema),schemaValidation,paymentVerification)
router.route('/details').get(getUserPlanDetails)

export default router;

