import express from 'express';
import { createWorkspace,joinWorkspace,createProject, createTask, addTeamMemberToWorkspace, addMemberToProject, addComments, getFullWorkspaceDetails, updateWorkspace, updateProject, updateTask, updateProjectMember, deleteWorkspace, deleteProject, deleteTask, deleteComments, deleteProjectMember, deleteWorkspaceMember, getMyTasks } from '../controllers/workspace.controller.js';
import { checkSchema } from 'express-validator';
import { workspaceSchema,joinWorkspaceSchema,createProjectSchema, createTaskSchema, addTeamMemberToWorkspaceSchema, updateProjectMemberSchema, addCommentSchema, updateWorkspaceSchema, updateProjectSchema, updateTaskSchema } from '../utils/workspace.validationSchema.js';
import {schemaValidation} from '../middleware/schema.validation.js'
import {authentication} from '../middleware/authenticate.js'
import ensureWorkspaceUser from '../middleware/ensureWorkspaceUser.js';
import restrictTo from '../middleware/restrictTo.js';

const router = express.Router();

router.route('/create-workspace').post(checkSchema(workspaceSchema),schemaValidation,authentication,createWorkspace)
router.route('/join-workspace').post(checkSchema(joinWorkspaceSchema),schemaValidation,authentication,ensureWorkspaceUser,joinWorkspace);
router.route('/create-project').post(checkSchema(createProjectSchema),schemaValidation,authentication,ensureWorkspaceUser,restrictTo(["org:admin"]),createProject)
router.route('/create-task').post(checkSchema(createTaskSchema),schemaValidation,authentication,ensureWorkspaceUser,restrictTo(["org:admin","org:member"]),createTask)
router.route('/get-my-task').post(authentication,ensureWorkspaceUser,restrictTo(["org:admin","org:member"]),getMyTasks)
router.route('/add-workspace-member').post(checkSchema(addTeamMemberToWorkspaceSchema),schemaValidation,authentication,ensureWorkspaceUser,restrictTo(["org:admin"]),addTeamMemberToWorkspace)
router.route('/add-project-member').post(checkSchema(updateProjectMemberSchema),schemaValidation,authentication,ensureWorkspaceUser,restrictTo(["org:admin","org:member"]),addMemberToProject)
router.route('/add-comment').post(checkSchema(addCommentSchema),schemaValidation,authentication,ensureWorkspaceUser,restrictTo(["org:admin","org:member"]),addComments)
router.route('/get-details').get(authentication,ensureWorkspaceUser,restrictTo(['org:admin',"org:member"]),getFullWorkspaceDetails)
router.route('/update-workspace').put(checkSchema(updateWorkspaceSchema),schemaValidation,authentication,ensureWorkspaceUser,restrictTo(["org:admin",]),updateWorkspace)
router.route('/update-project').put(checkSchema(updateProjectSchema),schemaValidation,authentication,ensureWorkspaceUser,restrictTo(["org:admin","org:member"]),updateProject)
router.route('/update-task').put(checkSchema(updateTaskSchema),schemaValidation,authentication,ensureWorkspaceUser,restrictTo(["org:admin","org:member"]),updateTask)
router.route('/update-project-member').put(checkSchema(updateProjectMemberSchema),schemaValidation,authentication,ensureWorkspaceUser,restrictTo(["org:admin",]),updateProjectMember)
router.route('/delete-workspace').delete(authentication,ensureWorkspaceUser,restrictTo(["org:admin",]),deleteWorkspace)
router.route('/delete-project').delete(authentication,ensureWorkspaceUser,restrictTo(["org:admin",]),deleteProject)
router.route('/delete-task').delete(authentication,ensureWorkspaceUser,restrictTo(["org:admin","org:member"]),deleteTask)
router.route('/delete-team-member').delete(authentication,ensureWorkspaceUser,restrictTo(["org:admin",]),deleteWorkspaceMember)
router.route('/delete-project-member').delete(authentication,ensureWorkspaceUser,restrictTo(["org:admin","org:member"]),deleteProjectMember)
router.route('/delete-comments').delete(authentication,ensureWorkspaceUser,restrictTo(["org:admin",]),deleteComments)


export default router;