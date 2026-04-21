import {Router} from 'express';
import { checkout, paymentVerification } from '../controllers/payment.controller';
import {checkSchema} from 'express-validator'
import { checkoutSchema, paymentVerificationSchema } from '../utils/payment.validationSchema';
import { schemaValidation } from '../middleware/schema.validation';

const router = Router();

router.route('/').post(checkSchema(checkoutSchema),schemaValidation,checkout);
router.route('/verification').post(checkSchema(paymentVerificationSchema),schemaValidation,paymentVerification)


export default router;

