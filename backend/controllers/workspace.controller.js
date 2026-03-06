import { and, eq, inArray, or, sql } from 'drizzle-orm';
import { db } from '../config/db.js'
import bcrypt from 'bcrypt'
import generator from 'generate-password';
import { uniqueUsernameGenerator, adjectives, nouns } from 'unique-username-generator';
import { users } from '../models/user.model.js';
import { workspaces, workspaceUsers, projects, tasks, projectMembers, comments } from '../models/workspace.model.js'
import { sendMemberInvitation, sendTaskInvitation } from '../services/mail.js';

export const createWorkspace = async (req, res) => {
    const { workspaceName, createdBy, description, adminEmail } = req.body;

    try {
        const [workspace] = await db.select({ name: workspaces.workspaceName }).from(workspaces).where(eq(sql`lower(${workspaces.workspaceName})`, workspaceName.toLowerCase()));

        if (workspace) {
            return res.status(400).send({ message: "Workspace name already exist" })
        }


        const [user] = await db.select({ username: users.username, email: users.email, role: users.role }).from(users).where(eq(users.id, req.user.id))


        if (!user || user.username !== createdBy) {
            return res.status(400).send({ message: "username does not exist" })
        }

        if (user.email !== adminEmail) {
            return res.status(400).send({ message: "admin email does not exist" })
        }

        if (user.role == 'guest') {
            return res.status(401).send({ message: "You are logined as guest. No access to create workspace" })
        }

        const [workspaceOwner] = await db.select({ adminEmail: workspaces.adminEmail }).from(workspaces).where(eq(workspaces.adminEmail, adminEmail));

        if (workspaceOwner) {
            return res.status(400).send({ success: false, message: "You have already created a workspace" })
        }

        await db.transaction(async (tx) => {
            await tx.insert(workspaces).values({ workspaceName, adminEmail, description })

            await tx.insert(workspaceUsers).values({ workspaceName, username: user.email, role: 'admin' })
        })


        return res.status(200).send({ success: true, message: "workspace created successfully." })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }


}

const getWorkspaceDetails = async (workspaceName) => {
    const result = await db.query.workspaces.findFirst({
        where: (workspaces, { eq }) => eq(workspaces.workspaceName, workspaceName),
        with: {
            workspaceUsers: true,   // Pulls all users for this workspace
            projects: {
                with: {
                    tasks: true,        // Pulls all tasks for each project
                    projectMembers: true // Pulls all members for each project
                }
            }
        }
    });
    return result;
}

export const getFullWorkspaceDetails = async (req, res) => {
    try {
        const workspaceDetails = await getWorkspaceDetails(req.user.workspaceName)

        return res.status(200).send({ success: true, workspaceDetails })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

export const joinWorkspace = async (req, res) => {
    const { workspaceName } = req.body;
    try {

        const [workspace] = await db.select({ workspaceName: workspaces.workspaceName, }).from(workspaces).where(eq(workspaces.workspaceName, workspaceName))

        if (!workspace) {
            return res.status(400).send({ success: false, message: `WorkspaceName or WorkspacePassword is Incorrect` })
        }

        const workspaceDetails = await getWorkspaceDetails(workspaceName)

        return res.status(200).send({ success: true, message: "Join Workspace Successfully", workspaceDetails })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

export const createProject = async (req, res) => {
    const { title, projectLink, description, status, priority, projectLead, startDate, endDate, teamMembers } = req.body;

    const [project] = db.select({ title: projects.title }).from(projects).where(and(eq(sql`lower(${projects.title})`, title.toLowerCase()), eq(projects.workspaceName, req.user.workspaceName)))

    if (project) {
        return res.status(409).send({ success: false, message: "Project name already exists" })
    }

    const [user] = await db.select({ userEmail: workspaceUsers.userEmail }).from(workspaceUsers).where(eq(workspaceUsers.userEmail, projectLead))

    if (!user) {
        return res.status(400).send({ success: false, message: "User does not exists. Add members to team first" })
    }

    await db.transaction(async (tx) => {
        const [newProject] = await tx.insert(projects).values({ title, workspaceName: req.user.workspaceName, projectLink, description, status, priority, projectLead, startDate, endDate }).returning({ insertedId: projects.id });

        const foundUsers = await tx.select({ userEmail: workspaceUsers.userEmail }).innerJoin(users, eq(workspaceUsers.userEmail, users.email)).where(inArray(users.email, teamMembers))

        if (foundUsers.length > 0) {
            await tx.insert(projectMembers).values(foundUsers.map((userEmail) => ({ userEmail, projectId: newProject.insertedId })))
        }

    })

    res.status(201).send({ success: true, message: "project created successfully." })

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
        symbols: true,
        uppercase: true,
        strict: true
    });

    const hashedPassword = bcrypt.hash(password, 10)

    try {
        let body;
        const [user] = db.select({ email: users.email }).from(users).where(eq(users.email, email));

        if (user) {
            body = { workspaceName: req.user.workspaceName, email }
            await db.insert(workspaceUsers).values({ workspaceName: req.user.workspaceName, username: user.email, role })
        } else {
            body = { workspaceName: req.user.workspaceName, email, username, password }
            await db.transaction(async (tx) => {
                await tx.insert(workspaceUsers).values({ workspaceName: req.user.workspaceName, email, role })
                await tx.insert(users).values({ username, email, password: hashedPassword, role: "guest" })
            })
        }

        await sendMemberInvitation(body);

        return res.status(201).send({ success: true, message: "Member added to workspace successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })

    }
}

// Add members to project
export const addTeamMemberToProject = async (req, res) => {
    const { email, projectId } = req.body;
    try {

        const isValidProject = await db.select({ projectId: projects.id }).from(projects).innerJoin(workspaces, eq(workspaces.workspaceName, projects.workspaceName)).where(or(and(eq(projects.projectLead, req.user.email), eq(projects.id, projectId)), and(eq(workspaces.adminEmail, req.user.email), eq(projects.id, projectId)
        )));

        if (!isValidProject) {
            return res.status(400).send({ success: false, message: "This is not your project" })
        }

        const [workspaceUser] = await db.select({ email: workspaceUsers.userEmail }).from(workspaceUsers).innerJoin(users, eq(workspaceUsers.userEmail, users.email)).where(eq(users.email, email))

        if (!workspaceUser) {
            return res.status(400).send({ success: false, message: "No user found with this emailId" })
        }

        const [project] = await db.select({ projectId: projects.id }).where(eq(projects.id, projectId));

        if (!project) {
            return res.status(400).send({ success: false, message: "Project not found" })
        }

        const projectMember = await db.select({ userEmail: projectMembers.userEmail }).from(projectMembers).where(eq(projectMembers.userEmail, workspaceUser.userEmail))

        if (projectMember) {
            return res.status(400).send({ success: false, message: "Project member already exists" })
        }

        await db.insert(projectMembers).values({ username: workspaceUser.username, projectId })

        return res.status(201).send({ success: true, message: "Team member added to project successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

// Create Task in a project and invite to team member 
export const createTask = async (req, res) => {
    const { projectId, title, description, type, priority, assignee, status, dueDate } = req.body;

    try {

        const isValidProject = await db.select({ projectId: projects.id }).from(projects).innerJoin(workspaces, eq(workspaces.workspaceName, projects.workspaceName)).where(or(and(eq(projects.projectLead, req.user.email), eq(projects.id, projectId)), and(eq(workspaces.adminEmail, req.user.email), eq(projects.id, projectId)
        )));

        if (!isValidProject) {
            return res.status(400).send({ success: false, message: "This is not your project" })
        }

        const [task] = await db.select({ title: tasks.title }).from(tasks).where(and(eq(sql`lower(${tasks.title})`, title.toLowerCase()), eq(tasks.projectId, projectId)))

        if (task) {
            return res.status(400).send({ success: false, message: "this task already exist. Provide another title." })
        }

        const [user] = await db.select({ email: workspaceUsers.userEmail }).from(workspaceUsers).where(eq(workspaceUsers.userEmail, assignee))

        if (!user) {
            return res.status(400).send({ success: false, message: "User does not exists. Add members to team first" })
        }

        // invite to team member 

        const body = { email: user.email, title, description, workspaceName: req.user.workspaceName };

        await sendTaskInvitation(body);

        await db.insert(tasks).values({
            projectId, title, description, type, priority, assignee, status, dueDate
        })

        return res.status(200).send({ success: true, message: "Task created successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }

}

// update Workspace 
export const updateWorkspace = async (req, res) => {
    const { workspaceId } = req.params;
    const { workspaceName, description } = req.body;
    try {

        const isValidWorkspace = await db.select({ id: workspaces.id }).from(workspaces).where(and(eq(workspaces.workspaceName, req.user.workspaceName), eq(workspaces.id, workspaceId)));

        if (!isValidWorkspace) {
            return res.status(400).send({ success: false, message: "This is not your workspace" })
        }

        await db.update(workspaces).set({ workspaceName, description }).where(eq(workspaces.id, workspaceId));

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

// Update Projects 
export const updateProject = async (req, res) => {
    const { projectId } = req.params;
    const { title, projectLink, description, status, priority, startDate, endDate, progress } = req.body;

    try {

        const isValidProject = await db.select({ projectId: projects.id }).from(projects).innerJoin(workspaces, eq(workspaces.workspaceName, projects.workspaceName)).where(or(and(eq(projects.projectLead, req.user.email), eq(projects.id, projectId)), and(eq(workspaces.adminEmail, req.user.email), eq(projects.id, projectId)
        )));

        if (!isValidProject) {
            return res.status(400).send({ success: false, message: "This is not your project" })
        }
        const [project] = await db.select({ projectId: projects.id }).where(eq(projects.id, projectId));

        if (!project) {
            return res.status(400).send({ success: false, message: "Task Id not found" })
        }

        await db.update(projects).set({ title, projectLink, description, status, priority, startDate, endDate, progress });

        return res.status(200).send({ success: true, message: "Project Updated Successfully." })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

// Update project member
export const updateProjectMember = async (req, res) => {
    const { email, projectId } = req.body;

    try {

        const isValidProject = await db.select({ projectId: projects.id }).from(projects).innerJoin(workspaces, eq(workspaces.workspaceName, projects.workspaceName)).where(or(and(eq(projects.projectLead, req.user.email), eq(projects.id, projectId)), and(eq(workspaces.adminEmail, req.user.email), eq(projects.id, projectId)
        )));

        if (!isValidProject) {
            return res.status(400).send({ success: false, message: "This is not your project" })
        }

        const [user] = await db.select({ username: users.email }).innerJoin(workspaceUsers, eq(users.email, workspaceUsers.userEmail)).where(eq(users.email, email))

        if (!user) {
            return res.status(400).send({ success: false, message: "No user found with this emailId" })
        }

        const [project] = await db.select({ projectId: projects.id }).where(eq(projects.id, projectId));

        if (!project) {
            return res.status(400).send({ success: false, message: "Project not found" })
        }

        await db.update(projectMembers).set({ projectLead: email }).where(eq(projects.id, projectId))

        return res.status(200).send({ success: false, message: "Project member updated successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

// Update Task 
export const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, projectId, description, type, status, priority, assignee, dueDate } = req.body;

    try {
        const isValidTask = await db.select({ taskId: tasks.id }).from(projects).innerJoin(workspaces, eq(workspaces.workspaceName, projects.workspaceName)).innerJoin(tasks, eq(projects.id, tasks.projectId)).where(or(and(eq(projects.projectLead, req.user.email), eq(projects.id, projectId)), and(eq(workspaces.adminEmail, req.user.email), eq(tasks.id, taskId)
        )));

        if (!isValidTask) {
            return res.status(400).send({ success: false, message: "This is not your task" })
        }
        const [project] = await db.select({ projectId: projects.id }).where(eq(projects.id, projectId));

        if (!project) {
            return res.status(400).send({ success: false, message: "Project Id not found" })
        }

        const [task] = await db.select({ taskId: tasks.id, assignee: tasks.assignee }).where(eq(tasks.id, taskId));

        if (!task) {
            return res.status(400).send({ success: false, message: "Task Id not found" })
        }

        if (task.assignee !== assignee) {
            const body = { title, description, workspaceName: req.user.workspaceName, email: assignee }
            await sendTaskInvitation(body)
        }

        await db.update(tasks).set({ title, description, type, status, priority, assignee, dueDate }).where(eq(tasks.id, taskId));

        return res.status(200).send({ success: true, message: "Task Updated Successfully." })

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
        const [workspace] = await db.select({ workspaceId: workspace.id }).from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userEmail, req.user.email)))

        if (!workspace) {
            return res.status(400).send({ success: false, message: "Invalid workspaceId" })
        }

        await db.delete(workspaces).where(eq(workspaces.id, workspaceId))

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
        const isValidProject = await db.select({ projectId: projects.id }).from(projects).innerJoin(workspaces, eq(workspaces.workspaceName, projects.workspaceName)).where(and(eq(workspaces.adminEmail, req.user.email), eq(projects.id, projectId)));

        if (!isValidProject) {
            return res.status(400).send({ success: false, message: "This is not your project" })
        }
        const [project] = await db.select({ projectId: projects.id }).from(projects).where(eq(projects.id, projectId))

        if (!project) {
            return res.status(400).send({ success: false, message: "Invalid projectId" })
        }

        await db.delete(projects).where(eq(projects.id, projectId))

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

        const isValidTask = await db.select({ taskId: tasks.id }).from(projects).innerJoin(workspaces, eq(workspaces.workspaceName, projects.workspaceName)).innerJoin(tasks, eq(projects.id, tasks.projectId)).where(or(and(eq(projects.projectLead, req.user.email), eq(projects.id, projectId)), and(eq(workspaces.adminEmail, req.user.email), eq(tasks.id, taskId)
        )));

        if (!isValidTask) {
            return res.status(400).send({ success: false, message: "This is not your task" })
        }
        const [task] = await db.select({ taskId: tasks.id }).from(tasks).where(eq(tasks.id, taskId))

        if (!task) {
            return res.status(400).send({ success: false, message: "Invalid taskId" })
        }

        await db.delete(tasks).where(eq(tasks.id, taskId))

        return res.status(200).send({ success: false, message: "task deleted Successfully." })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

// delete Team member from workspace
export const deleteTeamMember = async (req, res) => {
    const { email } = req.body;

    const [workspaceUser] = await db.select({ email: workspaceUsers.userEmail }).from(workspaceUsers).innerJoin(workspaces, eq(workspaces.userEmail, workspaceUsers.userEmail)).where(and(eq(workspaceUsers.userEmail, email), eq(workspaces.email, req.user.email)))

    if (!workspaceUser) {
        return res.status(400).send({ success: false, message: "User not found" })
    }

    await db.delete(workspaceUsers).where(eq(workspaceUsers.userEmail, email))

    return res.status(200).send({ success: false, message: "Team member deleted Successfully." })
}

// delete Team member from projects
export const deleteProjectMember = async (req, res) => {
    const { projectId } = req.params;
    const { email } = req.body;

    try {
        const isValidProject = await db.select({ projectId: projects.id }).from(projects).innerJoin(workspaces, eq(workspaces.workspaceName, projects.workspaceName)).where(or(and(eq(projects.projectLead, req.user.email), eq(projects.id, projectId)), and(eq(workspaces.adminEmail, req.user.email), eq(projects.id, projectId)
        )));

        if (!isValidProject) {
            return res.status(400).send({ success: false, message: "This is not your project" })
        }

        const [projectMember] = await db.select({ email: projectMembers.userEmail }).from(projectMembers).where(and(eq(projectMembers.userEmail, email), eq(projectMembers.id, projectId)))

        if (!projectMember) {
            return res.status(400).send({ success: false, message: "User not found" })
        }

        await db.delete(projectMembers).where(eq(projectMembers.userEmail, email))

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

        await db.insert(comments).values({ taskId, content, username: req.user.username })

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
            return res.status(400).send({ success: false, message: "TaskId does not exist" })
        }
        const [comments] = await db.select({ username: comments.username, content: comments.content, createdAt: comments.createdAt }).from(comments).where(eq(comments.taskId, taskId))

        return res.status(200).send({ success: true, comments: comments })

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
        const [task] = await db.select({ taskId: tasks.id }).from(tasks).where(eq(tasks.id, taskId))

        if (!task) {
            return res.status(400).send({ success: false, message: "Invalid taskId" })
        }

        await db.delete(comments).where(eq(comments.taskId, taskId))

        return res.status(200).send({ success: false, message: `Comment related to taskId ${taskId} deleted Successfully.` })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}
