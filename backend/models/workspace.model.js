import { uuid, varchar,timestamp, pgTable,text, pgEnum,integer,uniqueIndex,index } from "drizzle-orm/pg-core";
import { users } from "./user.model.js";
import { sql, relations } from "drizzle-orm";

export const workspaceRoleEnum = pgEnum("workspace_user_role",["org:admin","org:member"])
export const taskStatusEnum = pgEnum('task_status',['TODO','IN_PROGRESS','DONE'])
export const projectStatusEnum = pgEnum('project_status',['PLANNING','ACTIVE','COMPLETED','ON_HOLD','CANCELLED'])
export const taskTypeEnum = pgEnum('task_type',['TASK','FEATURE','BUG','IMPROVEMENT','OTHER'])
export const priorityEnum = pgEnum('priority',['MEDIUM','LOW','HIGH'])


export const workspaces = pgTable("workspaces",{
    id:uuid("id").primaryKey().defaultRandom(),
    name:varchar("name",{length:32}).notNull(),
    description:varchar("description",{length:255}).notNull(),
    ownerId:uuid("owner_id").notNull().references(()=>users.id,{onDelete:'cascade'}),
    createdAt:timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt:timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
},(table)=>[
    uniqueIndex('workspace_idx').on(table.id,table.ownerId),
    index('workspace_name_idx').on(sql`lower(${table.name})`),
    index("workspace_owner_id_idx").on(table.ownerId)
])

export const workspaceUsers = pgTable('workspace_users',{
    id:uuid("id").notNull().primaryKey().defaultRandom(),
    workspaceId:uuid("workspace_id").notNull().references(()=>workspaces.id,{onDelete:'cascade'}),
    userId:uuid("user_id").notNull().references(()=>users.id,{onDelete:'cascade'}),
    role:workspaceRoleEnum('role').default('org:member').notNull(),
    createdAt:timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
    deletedAt:timestamp('deletedAt', { withTimezone: true })
},(table)=>[
    uniqueIndex('workspace_users_index').on(table.workspaceId,table.userId),
    index('workspace_user_id_idx').on(table.userId)
])

export const projects = pgTable('projects',{
    id:uuid("id").notNull().primaryKey().defaultRandom(),
    title:varchar("title",{length:255}).notNull(),
    workspaceId:uuid("workspace_id").notNull().references(()=>workspaces.id,{onDelete:'cascade'}),
    projectLink: text("project_link"),
    description:varchar("description",{length:1000}).notNull(),
    status:projectStatusEnum('status').notNull(),
    priority:priorityEnum("priority").notNull(),
    projectLead:uuid("project_lead").references(()=>workspaceUsers.id,{onDelete:'set null'}),
    startDate:timestamp('start_date').defaultNow(),
    endDate:timestamp('end_date').notNull(),
    createdAt:timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
},(table)=>[
    uniqueIndex('project_workspace_idx').on(table.workspaceId,table.id),
    index('project_title_idx').on(sql`lower(${table.title})`),
    index('project_lead_id_idx').on(table.projectLead),
])

export const projectMembers = pgTable('project_members',{
    id:uuid("id").notNull().primaryKey().defaultRandom(),
    userId:uuid("user_id").notNull().references(()=>workspaceUsers.id,{onDelete:'cascade'}),
    projectId:uuid("project_id").notNull().references(()=>projects.id,{onDelete:'cascade'}),  
},(table)=>[
    uniqueIndex('project_member_unique_idx').on(table.userId,table.projectId),
    index('project_member_project_id_idx').on(table.projectId),
])

export const tasks = pgTable('tasks',{
    id:uuid("id").notNull().primaryKey().defaultRandom(),
    title:varchar("title",{length:255}).notNull(),
    projectId:uuid("project_id").notNull().references(()=>projects.id,{onDelete:'cascade'}),
    description:varchar("description",{length:1000}).notNull(),
    type:taskTypeEnum("type").notNull(),
    priority:priorityEnum("priority").notNull(),
    status:taskStatusEnum("status").notNull(),
    assigneeId:uuid("assignee_id").references(()=>workspaceUsers.id,{onDelete:'set null'}),
    dueDate:timestamp('due_date').notNull(),
    createdAt:timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
    
},(table)=>[
    uniqueIndex('tasks_project_idx').on(table.projectId,table.id),
    index('tasks_assignee_id_idx').on(table.assigneeId)
])

export const comments = pgTable('comments',{
    id:uuid("id").notNull().primaryKey().defaultRandom(),
    taskId:uuid("task_id").notNull().references(()=>tasks.id,{onDelete:'cascade'}),
    content:text("content").notNull(),
    authorId:uuid("author_id").notNull().references(()=>workspaceUsers.id,{onDelete:'cascade'}),
    createdAt:timestamp("created_at").notNull().defaultNow()  
},(table)=>[
    index('comments_tasks_id_index').on(table.taskId),
])

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  projects: many(projects),
  workspaceUsers: many(workspaceUsers)
}));

export const workspaceUsersRelations = relations(workspaceUsers, ({ one }) => ({
  user: one(users, {
    fields: [workspaceUsers.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [workspaceUsers.workspaceId],
    references: [workspaces.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
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

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id],
  }),
  workspaceAuthor: one(workspaceUsers, {
    fields: [comments.authorId],
    references: [workspaceUsers.id],
  }),
}));
