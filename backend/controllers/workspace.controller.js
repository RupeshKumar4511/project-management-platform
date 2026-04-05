import { and, eq, inArray, or, sql } from 'drizzle-orm';
import client from '../config/client.js'
import { db } from '../config/db.js'
import bcrypt from 'bcrypt'
import generator from 'generate-password';
import { uniqueUsernameGenerator, adjectives, nouns } from 'unique-username-generator';
import { users } from '../models/user.model.js';
import { workspaces, workspaceUsers, projects, tasks, projectMembers, comments } from '../models/workspace.model.js'
import { sendMemberInvitation, sendTaskInvitation } from '../services/mail.js';

export const createWorkspace = async (req, res) => {
    const { workspaceName, description } = req.body;

    try {
        const [workspace] = await db.select({ name: workspaces.name }).from(workspaces).where(eq(sql`lower(${workspaces.name})`, workspaceName.toLowerCase()));

        if (workspace) {
            return res.status(400).send({ message: "Workspace name already exist" })
        }

        const [user] = await db.select({ role: users.role }).from(users).where(eq(users.id, req.user.id))

        if (user.role == 'guest') {
            return res.status(401).send({ message: "You are logined as guest. No access to create workspace" })
        }

        const [workspaceOwner] = await db.select({ ownerId: workspaces.ownerId }).from(workspaces).where(eq(workspaces.ownerId, req.user.id));

        if (workspaceOwner) {
            return res.status(400).send({ success: false, message: "You have already created a workspace" })
        }

        await db.transaction(async (tx) => {
            const [newWorkspace] = await tx.insert(workspaces).values({ name: workspaceName, ownerId: req.user.id, description }).returning({ insertedId: workspaces.id })

            await tx.insert(workspaceUsers).values({ workspaceId: newWorkspace.insertedId, userId: req.user.id, role: 'org:admin' })
        })


        return res.status(200).send({ success: true, message: "workspace created successfully." })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }


}

const getWorkspaceDetails = async (workspaceId) => {
    const cachedResult = await client.get(`workspace:${workspaceId}`);
    if (cachedResult) {
        return JSON.parse(cachedResult);
    }

    const result = await db.query.workspaces.findFirst({
        where: (workspaces, { eq }) => eq(workspaces.id, workspaceId),
        with: {
            workspaceUsers: { // Pulls all users for this workspace
                with: {
                    user: {
                        columns: {
                            password: false,
                            role: false
                        }
                    }
                }
            },
            projects: {
                with: {
                    tasks: true,        // Pulls all tasks for each project
                    projectMembers: true // Pulls all members for each project
                }
            }
        }
    });

    await client.set(`workspace:${workspaceId}`, JSON.stringify(result));
    await client.expire(`workspace:${workspaceId}`, 60 * 15);

    return result;
}

export const getFullWorkspaceDetails = async (req, res) => {
    try {
        const workspaceDetails = await getWorkspaceDetails(req.user.workspaceId)

        return res.status(200).send({ success: true, details: workspaceDetails })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

export const joinWorkspace = async (req, res) => {
    const { workspaceName } = req.body;
    try {

        const [workspace] = await db.select({ name: workspaces.name, }).from(workspaces).where(eq(sql`lower(${workspaces.name})`, workspaceName.toLowerCase()))

        if (!workspace) {
            return res.status(400).send({ success: false, message: `WorkspaceName is Incorrect` })
        }

        const workspaceDetails = await getWorkspaceDetails(req.user.workspaceId)

        return res.status(200).send({ success: true, message: "Join Workspace Successfully", details: workspaceDetails })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

export const createProject = async (req, res) => {
    const { title, projectLink, description, status, priority, projectLead, startDate, endDate, teamMembers } = req.body;

    try {
        const [project] = await db.select({ title: projects.title }).from(projects).where(and(eq(sql`lower(${projects.title})`, title.toLowerCase()), eq(projects.workspaceId, req.user.workspaceId)))

        if (project) {
            return res.status(409).send({ success: false, message: "Project name already exists" })
        }

        await db.transaction(async (tx) => {
            const foundUsers = await tx.select({ id: workspaceUsers.id, email: users.email }).from(workspaceUsers).innerJoin(users, eq(workspaceUsers.userId, users.id)).where(inArray(users.email, teamMembers))

            if (foundUsers.length == 0) {
                return res.status(400).send({ success: false, message: "Members does not exists. First add members to team" })
            }

            if (foundUsers.length > 0) {
                const [projectLeadId] = foundUsers.map((user) => {
                    if (user.email == projectLead) {
                        return user.id
                    }
                })
                const start_date = new Date(startDate)
                const end_date = new Date(endDate)
                const [newProject] = await tx.insert(projects).values({ title, workspaceId: req.user.workspaceId, projectLink, description, status, priority, projectLead: projectLeadId, startDate: start_date, endDate: end_date }).returning({ insertedId: projects.id });

                await tx.insert(projectMembers).values(foundUsers.map((user) => ({ userId: user.id, projectId: newProject.insertedId })))
            }

        })

        await client.expire(`workspace:${req.user.workspaceId}`, 0)

        return res.status(201).send({ success: true, message: "project created successfully." })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }

}

// Add and Invite Team Members to workspace
export const addTeamMemberToWorkspace = async (req, res) => {
    const { email, role } = req.body;

    // Generate a unique username
    const username = uniqueUsernameGenerator({
        dictionaries: [adjectives, nouns],
        separator: '-',
        randomDigits: 3,
        maxLength: 15
    });

    // Generate a secure random password
    const password = generator.generate({
        length: 8,
        numbers: true,
        symbols: '@$!%*?&',
        uppercase: true,
        lowercase: true,
        strict: true
    });

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        let body;
        const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));

        const [workspace] = await db.select({ name: workspaces.name }).from(workspaces).where(eq(workspaces.id, req.user.workspaceId))

        if (user) {
            body = { workspaceName: workspace.name, email }
            await db.insert(workspaceUsers).values({ workspaceId: req.user.workspaceId, userId: user.id, role })
        } else {
            body = { workspaceName: workspace.name, email, username, password }
            await db.transaction(async (tx) => {
                const [newUser] = await tx.insert(users).values({ username, email, password: hashedPassword, role: "guest" }).returning({ insertedId: users.id });
                await tx.insert(workspaceUsers).values({ workspaceId: req.user.workspaceId, userId: newUser.insertedId, role })

            })
        }

        await client.expire(`workspace:${req.user.workspaceId}`, 0)

        await sendMemberInvitation(body);

        return res.status(201).send({ success: true, message: "Member added to workspace successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })

    }
}

// Add members to project
export const addMemberToProject = async (req, res) => {
    const { email, projectId } = req.body;
    try {

        const [isValidProject] = await db.select({ projectId: projects.id }).from(projects).innerJoin(workspaces, eq(workspaces.id
            , projects.workspaceId)).where(or(and(eq(projects.projectLead, req.user.memberId), eq(projects.id, projectId)), and(eq(workspaces.ownerId, req.user.id), eq(projects.id, projectId)
            )));

        if (!isValidProject) {
            return res.status(400).send({ success: false, message: "This is not your project" })
        }

        const [workspaceUser] = await db.select({ id: workspaceUsers.id }).from(workspaceUsers).innerJoin(users, eq(users.id, workspaceUsers.userId)).where(eq(users.email, email))

        if (!workspaceUser) {
            return res.status(400).send({ success: false, message: "No user found with this emailId" })
        }

        const [projectMember] = await db.select({ userId: projectMembers.userId }).from(projectMembers).where(eq(projectMembers.userId, workspaceUser.id))

        if (projectMember) {
            return res.status(409).send({ success: false, message: "Project member already exists" })
        }

        await db.insert(projectMembers).values({ userId: workspaceUser.id, projectId })

        await client.expire(`workspace:${req.user.workspaceId}`, 0)

        return res.status(201).send({ success: true, message: "Team member added to project successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

// Create Task in a project and invite to team member 
export const createTask = async (req, res) => {
    const { projectId, title, description, type, priority, assigneeId, status, dueDate } = req.body;

    try {

        const [isValidProject] = await db.select({ projectId: projects.id, workspaceName: workspaces.name }).from(projects).innerJoin(workspaces, eq(workspaces.id, projects.workspaceId)).where(
            or(
                and(eq(projects.projectLead, req.user.memberId), eq(projects.id, projectId)),
                and(eq(workspaces.ownerId, req.user.id), eq(projects.id, projectId))
            )
        );

        if (!isValidProject) {
            return res.status(400).send({ success: false, message: "This is not your project" })
        }

        const [task] = await db.select({ title: tasks.title }).from(tasks).where(and(eq(sql`lower(${tasks.title})`, title.toLowerCase()), eq(tasks.projectId, projectId)))

        if (task) {
            return res.status(400).send({ success: false, message: "this task already exist. Provide another title." })
        }

        const [workspaceUser] = await db.select({ id: workspaceUsers.id, email: users.email }).from(workspaceUsers).innerJoin(users, eq(workspaceUsers.userId, users.id)).where(and(eq(workspaceUsers.workspaceId, req.user.workspaceId), eq(workspaceUsers.id, assigneeId)))

        if (!workspaceUser) {
            return res.status(400).send({ success: false, message: "User does not exists. Add members to team first" })
        }

        // invite to team member 

        const body = { email: workspaceUser.email, title, description, workspaceName: isValidProject.workspaceName };

        await sendTaskInvitation(body);

        await db.insert(tasks).values({
            projectId, title, description, type, priority, assigneeId, status, dueDate: new Date(dueDate)
        })

        await client.expire(`workspace:${req.user.workspaceId}`, 0)

        return res.status(200).send({ success: true, message: "Task created successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }

}

export const getMyTasks = async (req, res) => {

    try {
        const [tasks] = await db.select().from(tasks).where(eq(tasks.assigneeId, req.user.memberId))

        return res.status(200).send({ success: true, tasks })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }

}

// update Workspace 
export const updateWorkspace = async (req, res) => {
    const { workspaceId } = req.params;
    const { name, description } = req.body;
    try {

        const [isValidWorkspace] = await db.select({ id: workspaces.id }).from(workspaces).where(and(eq(workspaces.ownerId, req.user.id), eq(workspaces.id, workspaceId)));

        if (!isValidWorkspace) {
            return res.status(400).send({ success: false, message: "Access Denied" })
        }

        await db.update(workspaces).set({ name, description }).where(eq(workspaces.id, workspaceId));

        await client.expire(`workspace:${req.user.workspaceId}`, 0)
        return res.status(200).send({ success: true, message: "Workspace updated successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

// Update Projects 
export const updateProject = async (req, res) => {
    const { projectId } = req.params;
    const { title, projectLink, description, status, priority, startDate, endDate } = req.body;

    try {

        const [isValidProject] = await db.select({ projectId: projects.id }).from(projects).innerJoin(workspaces, eq(workspaces.id, projects.workspaceId)).where(or(and(eq(projects.projectLead, req.user.memberId), eq(projects.id, projectId)), and(eq(workspaces.ownerId, req.user.id), eq(projects.id, projectId)
        )));

        if (!isValidProject) {
            return res.status(400).send({ success: false, message: "This is not your project" })
        }
        const [project] = await db.select({ projectId: projects.id }).from(projects).where(eq(projects.id, projectId));

        if (!project) {
            return res.status(400).send({ success: false, message: "Task Id not found" })
        }

        await db.update(projects).set({ title, projectLink, description, status, priority, startDate, endDate });

        await client.expire(`workspace:${req.user.workspaceId}`, 0)

        return res.status(200).send({ success: true, message: "Project Updated Successfully." })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

// Update project member
export const updateProjectMember = async (req, res) => {
    const { userId, projectId } = req.body;

    try {

        const [isValidProject] = await db.select({ projectId: projects.id }).from(projects).innerJoin(workspaces, eq(workspaces.id, projects.workspaceId)).where(and(eq(workspaces.ownerId, req.user.id), eq(projects.workspaceId, req.user.workspaceId)
        ));

        if (!isValidProject) {
            return res.status(400).send({ success: false, message: "This is not your project" })
        }

        const [workspaceUser] = await db.select({ id: workspaceUsers.id }).from(workspaceUsers).where(eq(workspaceUsers.id, userId))

        if (!workspaceUser) {
            return res.status(400).send({ success: false, message: "No user found with this emailId" })
        }


        await db.update(projects).set({ projectLead: userId }).where(eq(projects.id, projectId))

        await client.expire(`workspace:${req.user.workspaceId}`, 0)

        return res.status(200).send({ success: false, message: "Project member updated successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

// Update Task 
export const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, projectId, description, type, status, priority, assigneeId, dueDate } = req.body;

    try {
        const [isValidTask] = await db.select({ workspaceName: workspaces.name }).from(projects).innerJoin(workspaces, eq(workspaces.id, projects.workspaceId)).innerJoin(tasks, eq(projects.id, tasks.projectId)).where(or(and(eq(projects.projectLead, req.user.memberId), eq(projects.id, projectId)), and(eq(workspaces.ownerId, req.user.id), eq(tasks.id, taskId)
        )));

        if (!isValidTask) {
            return res.status(400).send({ success: false, message: "Access Denied" })
        }
        const [project] = await db.select({ projectId: projects.id }).from(projects).where(eq(projects.id, projectId));

        if (!project) {
            return res.status(400).send({ success: false, message: "Project Id not found" })
        }

        const [task] = await db.select({ assigneeId: tasks.assigneeId }).from(tasks).where(eq(tasks.id, taskId));

        if (!task) {
            return res.status(400).send({ success: false, message: "Task not found" })
        }

        const [workspaceUser] = await db.select({ id: workspaceUsers.id, email: users.email }).from(workspaceUsers).innerJoin(users, eq(workspaceUsers.userId, users.id)).where(and(eq(workspaceUsers.workspaceId, req.user.workspaceId), eq(workspaceUsers.id, assigneeId)))

        if (!workspaceUser) {
            return res.status(400).send({ success: false, message: "User does not exists. Add members to team first" })
        }

        if (task.assigneeId !== workspaceUser.id) {
            const body = { title, description, workspaceName: isValidTask.workspaceName, email: workspaceUser.email }
            await sendTaskInvitation(body)
        }

        await db.update(tasks).set({ title, description, type, status, priority, assigneeId: workspaceUser.id, dueDate:new Date(dueDate) }).where(eq(tasks.id, taskId));

        await client.expire(`workspace:${req.user.workspaceId}`, 0)

        return res.status(200).send({ success: true, message: "Task Updated Successfully." })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

export const updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { projectId, status } = req.body;

    if (!taskId?.trim() || !projectId?.trim() || !status?.trim()) {
        return res.status(400).send({ success: false, message: "Required field not found." })
    }
    try {
        const [isValidTask] = await db.select({ workspaceName: workspaces.name }).from(workspaces).innerJoin(projects, eq(projects.workspaceId, workspaces.id)).innerJoin(tasks, eq(tasks.projectId, projects.id)).where(or(and(eq(projects.projectLead, req.user.memberId), eq(projects.id, projectId)), and(eq(workspaces.ownerId, req.user.id), eq(tasks.id, taskId)
        )));


        if (!isValidTask) {
            return res.status(400).send({ success: false, message: "Access Denied" })
        }
        const [project] = await db.select({ projectId: projects.id }).from(projects).where(eq(projects.id, projectId));

        if (!project) {
            return res.status(400).send({ success: false, message: "Project Id not found" })
        }

        const [task] = await db.select({ assignee: tasks.assigneeId }).from(tasks).where(eq(tasks.id, taskId));

        if (!task) {
            return res.status(400).send({ success: false, message: "Task not found" })
        }

        await db.update(tasks).set({ status }).where(eq(tasks.id, taskId));

        await client.expire(`workspace:${req.user.workspaceId}`, 0)

        return res.status(200).send({ success: true, message: "Task status Updated Successfully." })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

// delete Workspace 
export const deleteWorkspace = async (req, res) => {
    const { workspaceId } = req.params;

    if (!workspaceId) {
        return res.status(400).send({ success: false, message: "WorkspaceId not found" })
    }

    try {
        const [workspace] = await db.select({ workspaceId: workspace.id }).from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.ownerId, req.user.id)))

        if (!workspace) {
            return res.status(400).send({ success: false, message: "Invalid workspaceId" })
        }

        await db.delete(workspaces).where(eq(workspaces.id, workspaceId))

        await client.expire(`workspace:${req.user.workspaceId}`, 0)

        return res.status(200).send({ success: false, message: "Workspace deleted Successfully." })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

// delete project
export const deleteProject = async (req, res) => {
    const { projectId } = req.params;

    if (!projectId) {
        return res.status(400).send({ success: false, message: "projectId not found" })
    }

    try {
        const [isValidProject] = await db.select({ projectId: projects.id }).from(projects).innerJoin(workspaces, eq(workspaces.id, projects.workspaceId)).where(and(eq(workspaces.ownerId, req.user.id), eq(projects.id, projectId)));

        if (!isValidProject) {
            return res.status(400).send({ success: false, message: "This is not your project" })
        }
        const [project] = await db.select({ projectId: projects.id }).from(projects).where(eq(projects.id, projectId))

        if (!project) {
            return res.status(400).send({ success: false, message: "Invalid projectId" })
        }

        await db.delete(projects).where(eq(projects.id, projectId))

        await client.expire(`workspace:${req.user.workspaceId}`, 0)

        return res.status(200).send({ success: false, message: "project deleted Successfully." })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

// delete task
export const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    if (!taskId) {
        return res.status(400).send({ success: false, message: "taskId not found" })
    }

    try {

        const [isValidTask] = await db.select({ taskId: tasks.id }).from(tasks).innerJoin(projects, eq(projects.id, tasks.projectId)).innerJoin(workspaces, eq(workspaces.id, projects.workspaceId)).where(or(and(eq(projects.projectLead, req.user.memberId), eq(tasks.id, taskId)), and(eq(workspaces.ownerId, req.user.id), eq(tasks.id, taskId)
        )));

        if (!isValidTask) {
            return res.status(400).send({ success: false, message: "This is not your task" })
        }
        const [task] = await db.select({ taskId: tasks.id }).from(tasks).where(eq(tasks.id, taskId))

        if (!task) {
            return res.status(400).send({ success: false, message: "Invalid taskId" })
        }

        await db.delete(tasks).where(eq(tasks.id, taskId))

        await client.expire(`workspace:${req.user.workspaceId}`, 0)

        return res.status(200).send({ success: false, message: "task deleted Successfully." })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

// delete Team member from workspace
export const deleteWorkspaceMember = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).send({ success: false, message: "User Id is not provided." })
    }
    try {
        const [isAuthorizedUser] = await db.select({ id: workspaceUsers.id, ownerId: workspaces.ownerId }).from(workspaceUsers).innerJoin(workspaces, eq(workspaces.ownerId, workspaceUsers.userId)).where(and(eq(workspaces.id, req.user.workspaceId), eq(workspaces.ownerId, req.user.id)))

        if (!isAuthorizedUser) {
            return res.status(403).send({ success: false, message: "Access Denied" })
        }

        if (userId === isAuthorizedUser.ownerId) {
            return res.status(400).send({ success: false, message: "Cannot delete admin" })
        }



        await db.delete(workspaceUsers).where(eq(workspaceUsers.id, userId));

        await client.expire(`workspace:${req.user.workspaceId}`, 0)

        return res.status(200).send({ success: true, message: "Team member deleted Successfully." })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }

}

// delete Team member from projects
export const deleteProjectMember = async (req, res) => {
    const { userId, projectId } = req.query;

    try {
        const [isValidProject] = await db.select({ projectId: projects.id, projectLead: projects.projectLead }).from(projects).innerJoin(workspaces, eq(workspaces.id, projects.workspaceId)).where(or(and(eq(projects.projectLead, req.user.memberId), eq(projects.id, projectId)), and(eq(workspaces.ownerId, req.user.id), eq(projects.id, projectId)
        )));

        if (!isValidProject) {
            return res.status(400).send({ success: false, message: "This is not your project" })
        }

        if (userId === isValidProject.projectLead) {
            return res.status(400).send({ success: false, message: "First appoint any members as projectLead then delete the previous one" })
        }

        const [projectMember] = await db.select({ id: projectMembers.id }).from(projectMembers).where(and(eq(projectMembers.userId, userId), eq(projectMembers.projectId, projectId)))

        if (!projectMember) {
            return res.status(400).send({ success: false, message: "User not found" })
        }

        await db.delete(projectMembers).where(eq(projectMembers.userId, userId))

        await client.expire(`workspace:${req.user.workspaceId}`, 0)

        return res.status(200).send({ success: false, message: "Project member deleted Successfully." })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

// Add comments 
export const addComments = async (req, res) => {
    const { taskId, content } = req.body;

    try {
        const [task] = await db.select({ taskId: tasks.id }).from(tasks).where(eq(tasks.id, taskId))

        if (!task) {
            return res.status(400).send({ success: false, message: "TaskId does not exist" })
        }

        await db.insert(comments).values({ taskId, content, authorId: req.user.memberId })

        await client.expire(`comments:${taskId}`, 0)

        return res.status(201).send({ success: true, message: "Comment added successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }

}

// Get Comments 
export const getComments = async (req, res) => {
    const { taskId } = req.params
    if (!taskId.trim()) {
        return res.status(400).send({ success: false, message: "TaskId required" })
    }
    try {

        const [task] = await db.select({ taskId: tasks.id }).from(tasks).where(eq(tasks.id, taskId));

        if (!task) {
            return res.status(400).send({ success: false, message: "Task does not exist" })
        }

        const cachedResult = await client.get(`comments:${taskId}`)
        if (cachedResult) {
            console.log("from cache")
            console.log(cachedResult)
            return res.status(200).send({ success: true, comments: JSON.parse(cachedResult) })
        }
        const taskComments = await db.query.comments.findMany({
            where: eq(comments.taskId, taskId),
            with: {
                workspaceAuthor: {
                    with: {
                        user: true,
                    },
                },
            },
        });

        await client.set(`comments:${taskId}`, JSON.stringify(taskComments));
        await client.expire(`comments:${taskId}`, 60 * 5)

        return res.status(200).send({ success: true, comments: taskComments })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

// delete Comments 
export const deleteComments = async (req, res) => {
    const { taskId } = req.params;

    if (!taskId) {
        return res.status(400).send({ success: false, message: "taskId not found" })
    }

    try {
        const [task] = await db.select({ taskId: tasks.id, projectId: tasks.projectId }).from(tasks).where(eq(tasks.id, taskId))

        if (!task) {
            return res.status(400).send({ success: false, message: "Invalid taskId" })
        }

        const [data] = await db.select({ projectLead: projects.projectLead, ownerId: workspaces.ownerId }).from(projects).innerJoin(workspaces, eq(workspaces.id, projects.workspaceId)).where(eq(projects.id, task.projectId))

        if (data.projectLead == req.user.memberId || data.ownerId == req.user.id) {

            await db.delete(comments).where(eq(comments.taskId, taskId))

            await client.expire(`comments:${taskId}`, 0)

            return res.status(200).send({ success: false, message: `Comment related to taskId ${taskId} deleted Successfully.` })

        } else {
            return res.status(401).send({ success: false, message: "Access Denied" })
        }


    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}
