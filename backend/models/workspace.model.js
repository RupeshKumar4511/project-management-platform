import { uuid, varchar,timestamp, pgTable,text, pgEnum,integer,uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./user.model.js";
import { sql,relations } from "drizzle-orm";

export const workspaceRoleEnum = pgEnum("workspace_user_role",["admin","member"])
export const taskStatusEnum = pgEnum('task_status',['To Do','In Progress','Done'])
export const projectStatusEnum = pgEnum('project_status',['Planning','Active','Completed','On Hold','Cancelled'])
export const taskTypeEnum = pgEnum('task_type',['Task','Feature','Bug','Improvement','Other'])
export const priorityEnum = pgEnum('priority',['Medium','Low','High'])


export const workspaces = pgTable("workspaces",{
    id:uuid("id").primaryKey().defaultRandom(),
    workspaceName:varchar("workspace_name",{length:32}).notNull().unique(),
    description:varchar("description",{length:255}).notNull(),
    adminEmail:varchar("admin_email",{length:255}).references(()=>users.email,{onDelete:'cascade'}),
    createdAt:timestamp('created_at').defaultNow().notNull(),
    updatedAt:timestamp('updated_at').notNull().defaultNow()
},(workspaces)=>[
    uniqueIndex('workspace_index').on(sql`lower(${workspaces.workspaceName})`,workspaces.adminEmail)
])

export const workspaceUsers = pgTable('workspace_users',{
    id:uuid("id").notNull().primaryKey().defaultRandom(),
    workspaceName:varchar("workspace_name",{length:32}).notNull().references(()=>workspaces.workspaceName,{onDelete:'cascade',onUpdate:'cascade'}),
    userEmail:varchar("user_email",{length:255}).notNull().references(()=>users.email,{onDelete:'cascade'}).unique(),
    role:workspaceRoleEnum('role').default('member').notNull(),
    createdAt:timestamp("created_at").notNull().defaultNow(),
    updatedAt:timestamp('updated_at').notNull().defaultNow()
},(workspaceUsers)=>[
    uniqueIndex('workspace_users_index').on(sql`lower(${workspaceUsers.workspaceName})`,workspaceUsers.userEmail)
])

export const projects = pgTable('projects',{
    id:uuid("id").notNull().primaryKey().defaultRandom(),
    title:varchar("title",{length:255}).notNull(),
    workspaceName:varchar("workspace_name",{length:32}).notNull().references(()=>workspaces.workspaceName,{onDelete:'cascade',onUpdate:'cascade'}),
    projectLink: text("project_link"),
    description:varchar("description",{length:1000}).notNull(),
    status:projectStatusEnum('status').notNull(),
    priority:priorityEnum("priority").notNull(),
    projectLead:varchar("project_lead",{length:255}).notNull().references(()=>workspaceUsers.userEmail,{onDelete:'cascade',onUpdate:'cascade'}),
    startDate:timestamp('start_date').defaultNow(),
    endDate:timestamp('end_date').notNull(),
    progress:integer("progress",{max:100,min:0}).default(0),
    createdAt:timestamp("created_at").notNull().defaultNow(),
    updatedAt:timestamp('updated_at').notNull().defaultNow()
},(projects)=>[
    uniqueIndex('project_index').on(sql`lower(${projects.workspaceName})`,sql`lower(${projects.title})`)
])

export const projectMembers = pgTable('project_members',{
    id:uuid("id").notNull().primaryKey().defaultRandom(),
    userEmail:varchar("workspace_user_email",{length:255}).notNull().references(()=>workspaceUsers.userEmail,{onDelete:'cascade',onUpdate:'cascade'}),
    projectId:uuid("project_id").notNull().references(()=>projects.id,{onDelete:'cascade'}),

})

export const tasks = pgTable('tasks',{
    id:uuid("id").notNull().primaryKey().defaultRandom(),
    title:varchar("title",{length:255}).notNull(),
    projectId:uuid("project_id").notNull().references(()=>projects.id,{onDelete:'cascade'}),
    description:varchar("description",{length:1000}).notNull(),
    type:taskTypeEnum("type").notNull(),
    priority:priorityEnum("priority").notNull(),
    status:taskStatusEnum("status").notNull(),
    assignee:varchar("assignee",{length:255}).notNull().references(()=>workspaceUsers.userEmail,{onDelete:'cascade',onUpdate:'cascade'}),
    dueDate:timestamp('due_date').notNull(),
    createdAt:timestamp("created_at").notNull().defaultNow(),
    updatedAt:timestamp('updated_at').notNull().defaultNow()
    
},(tasks)=>[
    uniqueIndex('tasks_index').on(tasks.projectId,sql`lower(${tasks.title})`)
])

export const comments = pgTable('comments',{
    id:uuid("id").notNull().primaryKey().defaultRandom(),
    taskId:uuid("task_id").notNull().references(()=>tasks.id,{onDelete:'cascade'}),
    content:text("content").notNull(),
    username:varchar("username",{length:32}).notNull().references(()=>users.username,{onDelete:'cascade',onUpdate:'cascade'}),
    createdAt:timestamp("created_at").notNull().defaultNow()
    
})

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  projects: many(projects),
  workspaceUsers: many(workspaceUsers)
}));

export const workspaceUsersRelations = relations(workspaceUsers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceUsers.workspaceName],
    references: [workspaces.workspaceName],
  }),
}));


export const projectsRelations = relations(projects, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceName],
    references: [workspaces.workspaceName],
  }),
  tasks: many(tasks),
  projectMembers: many(projectMembers), 
}));


export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  })
}));


export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));