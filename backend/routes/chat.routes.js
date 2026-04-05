import {Router} from 'express'
import { checkSchema } from 'express-validator';
import { schemaValidation } from '../middleware/schema.validation.js';
import {querySchema} from '../utils/chat.validationSchema.js'
import restrictTo from '../middleware/restrictTo.js';
import { queryResponse } from '../controllers/chat.controller.js';
import ensureWorkspaceUser from '../middleware/ensureWorkspaceUser.js';

const router = Router();

router.route('/').post(ensureWorkspaceUser,restrictTo(["org:admin","org:member"]),checkSchema(querySchema),schemaValidation,queryResponse)

export default router