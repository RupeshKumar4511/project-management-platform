import express from 'express';
import { createWorkspace, joinWorkspace, createProject, createTask, addTeamMemberToWorkspace, addMemberToProject, addComments, getFullWorkspaceDetails, updateWorkspace, updateProject, updateTask, updateProjectMember, deleteWorkspace, deleteProject, deleteTask, deleteComments, deleteProjectMember, deleteWorkspaceMember, getMyTasks, getComments } from '../controllers/workspace.controller.js';
import { checkSchema } from 'express-validator';
import { workspaceSchema, joinWorkspaceSchema, createProjectSchema, createTaskSchema, addTeamMemberToWorkspaceSchema, updateProjectMemberSchema, addCommentSchema, updateWorkspaceSchema, updateProjectSchema, updateTaskSchema } from '../utils/workspace.validationSchema.js';
import { schemaValidation } from '../middleware/schema.validation.js'
import { ensureAuth } from '../middleware/ensureAuth.js'
import ensureWorkspaceUser from '../middleware/ensureWorkspaceUser.js';
import restrictTo from '../middleware/restrictTo.js';

const router = express.Router();

router.route('/create-workspace').post(checkSchema(workspaceSchema), schemaValidation, ensureAuth, createWorkspace)
router.route('/join-workspace').post(checkSchema(joinWorkspaceSchema), schemaValidation, ensureAuth, ensureWorkspaceUser, joinWorkspace);
router.route('/create-project').post(checkSchema(createProjectSchema), schemaValidation, ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin"]), createProject)
router.route('/create-task').post(checkSchema(createTaskSchema), schemaValidation, ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), createTask)
router.route('/get-my-task').post(ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), getMyTasks)
router.route('/add-workspace-member').post(checkSchema(addTeamMemberToWorkspaceSchema), schemaValidation, ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin"]), addTeamMemberToWorkspace)
router.route('/add-project-member').post(checkSchema(updateProjectMemberSchema), schemaValidation, ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), addMemberToProject)
router.route('/add-comment').post(checkSchema(addCommentSchema), schemaValidation, ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), addComments)
router.route('/get-comments/:taskId').get(ensureAuth, ensureWorkspaceUser, restrictTo(['org:admin', "org:member"]), getComments)
router.route('/get-details').get(ensureAuth, ensureWorkspaceUser, restrictTo(['org:admin', "org:member"]), getFullWorkspaceDetails)
router.route('/update-workspace/:workspaceId').put(checkSchema(updateWorkspaceSchema), schemaValidation, ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin",]), updateWorkspace)
router.route('/update-project/:projectId').put(checkSchema(updateProjectSchema), schemaValidation, ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), updateProject)
router.route('/update-task/:taskId').put(checkSchema(updateTaskSchema), schemaValidation, ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), updateTask)
router.route('/update-task-status/:taskId').patch(ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), updateTask)
router.route('/update-project-member').put(checkSchema(updateProjectMemberSchema), schemaValidation, ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin",]), updateProjectMember)
router.route('/delete-workspace/:workspaceId').delete(ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin",]), deleteWorkspace)
router.route('/delete-project/:projectId').delete(ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin",]), deleteProject)
router.route('/delete-task/:taskId').delete(ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), deleteTask)
router.route('/delete-workspace-member').delete(ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin",]), deleteWorkspaceMember)
router.route('/delete-project-member').delete(ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin", "org:member"]), deleteProjectMember)
router.route('/delete-comments/:taskId').delete(ensureAuth, ensureWorkspaceUser, restrictTo(["org:admin",]), deleteComments)


export default router;