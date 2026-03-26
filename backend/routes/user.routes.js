import express from 'express';
import { checkSchema } from 'express-validator';
import { schemaValidation } from '../middleware/schema.validation.js';
import {updateUserSchema} from '../utils/user.validationSchema.js'
import { updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.route('/update').patch(checkSchema(updateUserSchema),schemaValidation,updateUser)


export default router;