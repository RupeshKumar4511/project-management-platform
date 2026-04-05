import express from 'express';
import { createWorkspace, joinWorkspace, createProject, createTask, addTeamMemberToWorkspace, addMemberToProject, addComments, getFullWorkspaceDetails, updateWorkspace, updateProject, updateTask, updateProjectMember, deleteWorkspace, deleteProject, deleteTask, deleteComments, deleteProjectMember, deleteWorkspaceMember, getMyTasks, getComments, updateTaskStatus } from '../controllers/workspace.controller.js';
import { checkSchema } from 'express-validator';
import { workspaceSchema, joinWorkspaceSchema, createProjectSchema, createTaskSchema, addTeamMemberToWorkspaceSchema, updateProjectMemberSchema, addCommentSchema, updateWorkspaceSchema, updateProjectSchema, updateTaskSchema, addProjectMemberSchema } from '../utils/workspace.validationSchema.js';
import { schemaValidation } from '../middleware/schema.validation.js'
import ensureWorkspaceUser from '../middleware/ensureWorkspaceUser.js';
import restrictTo from '../middleware/restrictTo.js';

const router = express.Router();

router.route('/create-workspace').post(checkSchema(workspaceSchema), schemaValidation, createWorkspace)
router.route('/join-workspace').post(checkSchema(joinWorkspaceSchema), schemaValidation, ensureWorkspaceUser, joinWorkspace);
router.route('/create-project').post(ensureWorkspaceUser, restrictTo(["org:admin"]), checkSchema(createProjectSchema), schemaValidation, createProject)
router.route('/create-task').post(ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), checkSchema(createTaskSchema), schemaValidation, createTask)
router.route('/get-my-task').post(ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), getMyTasks)
router.route('/add-workspace-member').post(ensureWorkspaceUser, restrictTo(["org:admin"]), checkSchema(addTeamMemberToWorkspaceSchema), schemaValidation, addTeamMemberToWorkspace)
router.route('/add-project-member').post(ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), checkSchema(addProjectMemberSchema), schemaValidation, addMemberToProject)
router.route('/add-comment').post(ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), checkSchema(addCommentSchema), schemaValidation, addComments)
router.route('/get-comments/:taskId').get(ensureWorkspaceUser, restrictTo(['org:admin', "org:member"]), getComments)
router.route('/get-details').get(ensureWorkspaceUser, restrictTo(['org:admin', "org:member"]), getFullWorkspaceDetails)
router.route('/update-workspace/:workspaceId').put(ensureWorkspaceUser, restrictTo(["org:admin",]), checkSchema(updateWorkspaceSchema), schemaValidation, updateWorkspace)
router.route('/update-project/:projectId').put(ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), checkSchema(updateProjectSchema), schemaValidation, updateProject)
router.route('/update-task/:taskId').put(ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), checkSchema(updateTaskSchema), schemaValidation, updateTask)
router.route('/update-task-status/:taskId').patch(ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), updateTaskStatus)
router.route('/update-project-member').patch(checkSchema(updateProjectMemberSchema), schemaValidation, ensureWorkspaceUser, restrictTo(["org:admin",]), updateProjectMember)
router.route('/delete-workspace/:workspaceId').delete(ensureWorkspaceUser, restrictTo(["org:admin",]), deleteWorkspace)
router.route('/delete-project/:projectId').delete(ensureWorkspaceUser, restrictTo(["org:admin",]), deleteProject)
router.route('/delete-task/:taskId').delete(ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), deleteTask)
router.route('/delete-workspace-member/:userId').delete(ensureWorkspaceUser, restrictTo(["org:admin",]), deleteWorkspaceMember)
router.route('/delete-project-member').delete(ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), deleteProjectMember)
router.route('/delete-comments/:taskId').delete(ensureWorkspaceUser, restrictTo(["org:admin","org:member",]), deleteComments)


export default router;