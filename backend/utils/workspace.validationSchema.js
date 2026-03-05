export const workspaceSchema = {
    workspaceName: {
        trim: true,
        notEmpty: {
            errorMessage: "Workspace name is required"
        },
        isString: {
            errorMessage: "Workspace name must be string"
        },
        isLength: {
            options: {
                min: 2,
                max: 32
            },
            errorMessage: "Workspace name should be 2-32 characters long."
        }
    },
    createdBy: {
        trim: true,
        notEmpty: {
            errorMessage: "admin name is required"
        },
        isString: {
            errorMessage: "admin name must be string"
        },
        isLength: {
            options: {
                min: 3,
                max: 32,
            },
            errorMessage: "Admin name should be 3-32 characters long."
        }
    },
    adminEmail: {
        trim: true,
        notEmpty: {
            errorMessage: "Admin Email is required"
        },
        isString: {
            errorMessage: "Admin Email must be string"
        },
        isLength: {
            options: {
                max: 255,
                min: 8
            },
            errorMessage: "Admin Email should be 8-255 characters long."
        },
        matches: {
            options: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/],
            errorMessage: "Admin email is not valid."
        }
    },
    description: {
        trim: true,
        notEmpty: {
            errorMessage: "Description is required"
        },
        isString: {
            errorMessage: "Description must be string"
        }
    }
}

export const joinWorkspaceSchema = {
    workspaceName: {
        trim: true,
        notEmpty: {
            errorMessage: "Workspace name must be required",
        },
        isString: {
            errorMessage: "Workspace name must be string"
        },
        isLength: {
            options: {
                min: 2,
                max: 32
            },
            errorMessage: "Workspace name should be 2-32 characters long."
        }
    }

}

export const createProjectSchema = {
    projectName: {
        trim: true,
        notEmpty: {
            errorMessage: "project name is required"
        },
        isString: {
            errorMessage: "project name must be string"
        },
        isLength: {
            options: {
                min: 5,
                max: 255
            },
            errorMessage: "project name should be 5-255 characters long."
        }
    },
    workspaceName: {
        trim: true,
        notEmpty: {
            errorMessage: "workspace name is required"
        },
        isString: {
            errorMessage: "workspace name must be string"
        },
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: "workspace name should be 5-32 characters long."
        }
    },
    projectLink: {
        trim: true,
        optional: {
            options: {
                checkFalsy: true
            }
        },
        isString: {
            errorMessage: "project link must be string"
        },
        isLength: {
            options: {
                min: 8,
                max: 255,
            },
            errorMessage: "project link should be 8-255 characters long."
        }
    },
    description: {
        trim: true,
        notEmpty: {
            errorMessage: "description is required"
        },
        isString: {
            errorMessage: "description must be string"
        },
        isLength: {
            options: {
                max: 1000,
                min: 8
            },
            errorMessage: "Description should be 8-1000 characters long."
        }
    },
    status: {
        trim: true,
        notEmpty: {
            errorMessage: "status is required"
        },
        isIn: {
            options: [['Planning','Active','Completed','On Hold','Cancelled']], 
            errorMessage: 'Invalid status provided'
        }
    },
    priority: {
        trim: true,
        notEmpty: {
            errorMessage: "priority is required"
        },
        isIn: {
            options: [['Medium','Low','High']], 
            errorMessage: 'Invalid priority provided'
        }
    },
    projectLead: {
        trim: true,
        notEmpty: {
            errorMessage: "project_leader name is required"
        },
        isString: {
            errorMessage: "project_leader name must be string"
        },
        isLength: {
            options: {
                min: 3,
                max: 32
            },
            errorMessage: "project_leader name should be 3-32 characters long."
        }
    },
    startDate: {
        trim: true,
        isDate: {
            options: {
                format: 'DD-MM-YYYY',
                strictMode: true,
                delimiters: ['-']
            },
            errorMessage: "start date must be in DD-MM-YYYY"
        }
    },
    endDate: {
        trim: true,
        notEmpty: {
            errorMessage: "endDate name is required"
        },
        isDate: {
            options: {
                format: 'DD-MM-YYYY',
                strictMode: true,
                delimiters: ['-']
            },
            errorMessage: "end date must be in DD-MM-YYYY"
        }
    }
}

export const createTaskSchema = {
    projectId: {
        trim: true,
        notEmpty: {
            errorMessage: "project id is required"
        },
        isString: {
            errorMessage: "project id must be string"
        },
        isLength: {
            options: {
                min: 1,
                max: 15
            },
            errorMessage: "project id should be 1-15 characters long."
        }
    },
    title: {
        trim: true,
        notEmpty: {
            errorMessage: "title is required"
        },
        isString: {
            errorMessage: "title must be string"
        },
        isLength: {
            options: {
                min: 5,
                max: 255
            },
            errorMessage: "title should be 5-255 characters long."
        }
    },
    description: {
        trim: true,
        notEmpty: {
            errorMessage: "description is required"
        },
        isString: {
            errorMessage: "description must be string"
        },
        isLength: {
            options: {
                max: 1000,
                min: 8
            },
            errorMessage: "Description should be 8-1000 characters long."
        }
    },
    priority: {
        trim: true,
        notEmpty: {
            errorMessage: "priority is required"
        },
        isIn: {
            options: [['Medium','Low','High']], 
            errorMessage: 'Invalid priority provided'
        }
    },
    status: {
        trim: true,
        notEmpty: {
            errorMessage: "status is required"
        },
        isIn: {
            options: [['Task','Feature','Bug','Improvement','Other']], 
            errorMessage: 'Invalid status provided'
        }
    },
    assignee: {
        trim: true,
        notEmpty: {
            errorMessage: "assignee is required"
        },
        isString: {
            errorMessage: "assignee must be string"
        },
        isLength: {
            options: {
                min: 3,
                max: 32
            },
            errorMessage: "assignee name should be 3-32 characters long."
        }
    },
    dueDate: {
        trim: true,
        notEmpty: {
            errorMessage: "dueDate  is required"
        },
        isDate: {
            options: {
                format: 'DD-MM-YYYY',
                strictMode: true,
                delimiters: ['-']
            },
            errorMessage: "due date must be in DD-MM-YYYY"
        }
    }
}

export const addCommentSchema = {
    taskId: {
        trim: true,
        notEmpty: {
            errorMessage: "task id is required"
        },
        isString: {
            errorMessage: "task id must be string"
        },
        isLength: {
            options: {
                min: 1,
                max: 15
            },
            errorMessage: "task id should be 1-15 characters long."
        }
    },
    content: {
        trim: true,
        notEmpty: {
            errorMessage: "content is required"
        },
        isString: {
            errorMessage: "content must be string"
        },
        isLength: {
            options: {
                max: 1000,
                min: 2
            },
            errorMessage: "content should be 8-1000 characters long."
        }
    }
}

export const updateWorkspaceSchema = {
    workspaceId:{
        in: ['params'],
        trim: true,
        notEmpty: {
            errorMessage : "workspaceId is required"
        }
    },
    workspaceName: {
        trim: true,
        notEmpty: {
            errorMessage: "Workspace name is required"
        },
        isString: {
            errorMessage: "Workspace name must be string"
        },
        isLength: {
            options: {
                min: 2,
                max: 32
            },
            errorMessage: "Workspace name should be 2-32 characters long."
        }
    },
    description: {
        trim: true,
        notEmpty: {
            errorMessage: "Description is required"
        },
        isString: {
            errorMessage: "Description must be string"
        }
    }
}

export const updateProjectSchema = {
    projectId:{
        in:['params'],
        trim: true,
        isEmpty:{
            errorMessage: "project Id is required"
        }
    },
    projectName: {
        trim: true,
        notEmpty: {
            errorMessage: "project name is required"
        },
        isString: {
            errorMessage: "project name must be string"
        },
        isLength: {
            options: {
                min: 5,
                max: 255
            },
            errorMessage: "project name should be 5-255 characters long."
        }
    },
    workspaceName: {
        trim: true,
        notEmpty: {
            errorMessage: "workspace name is required"
        },
        isString: {
            errorMessage: "workspace name must be string"
        },
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: "workspace name should be 5-32 characters long."
        }
    },
    projectLink: {
        trim: true,
        optional: {
            options: {
                checkFalsy: true
            }
        },
        isString: {
            errorMessage: "project link must be string"
        },
        isLength: {
            options: {
                min: 8,
                max: 255,
            },
            errorMessage: "project link should be 8-255 characters long."
        }
    },
    description: {
        trim: true,
        notEmpty: {
            errorMessage: "description is required"
        },
        isString: {
            errorMessage: "description must be string"
        },
        isLength: {
            options: {
                max: 1000,
                min: 8
            },
            errorMessage: "Description should be 8-1000 characters long."
        }
    },
    status: {
        trim: true,
        notEmpty: {
            errorMessage: "status is required"
        },
        isIn: {
            options: [['Planning','Active','Completed','On Hold','Cancelled']], 
            errorMessage: 'Invalid status provided'
        }
    },
    priority: {
        trim: true,
        notEmpty: {
            errorMessage: "priority is required"
        },
        isIn: {
            options: [['Medium','Low','High']], 
            errorMessage: 'Invalid priority provided'
        }
    },
    startDate: {
        trim: true,
        isDate: {
            options: {
                format: 'DD-MM-YYYY',
                strictMode: true,
                delimiters: ['-']
            },
            errorMessage: "start date must be in DD-MM-YYYY"
        }
    },
    endDate: {
        trim: true,
        notEmpty: {
            errorMessage: "endDate name is required"
        },
        isDate: {
            options: {
                format: 'DD-MM-YYYY',
                strictMode: true,
                delimiters: ['-']
            },
            errorMessage: "end date must be in DD-MM-YYYY"
        }
    },
    progress:{
        optional:{
            options:{
                checkFalsy:true
            }
        },
        trim: true,
        notEmpty:{
            errorMessage: "progress must not be empty"
        },
        isNumeric:{
            errorMessage:"progress percentage must be numeric"
        }
    }
}

export const updateTaskSchema = {
    projectId: {
        in: ['params'],
        trim: true,
        notEmpty: {
            errorMessage: "project id is required"
        },
        isString: {
            errorMessage: "project id must be string"
        },
        isLength: {
            options: {
                min: 1,
                max: 15
            },
            errorMessage: "project id should be 1-15 characters long."
        }
    },
    title: {
        trim: true,
        notEmpty: {
            errorMessage: "title is required"
        },
        isString: {
            errorMessage: "title must be string"
        },
        isLength: {
            options: {
                min: 5,
                max: 255
            },
            errorMessage: "title should be 5-255 characters long."
        }
    },
    description: {
        trim: true,
        notEmpty: {
            errorMessage: "description is required"
        },
        isString: {
            errorMessage: "description must be string"
        },
        isLength: {
            options: {
                max: 1000,
                min: 8
            },
            errorMessage: "Description should be 8-1000 characters long."
        }
    },
    priority: {
        trim: true,
        notEmpty: {
            errorMessage: "priority is required"
        },
        isIn: {
            options: [['Medium','Low','High']], 
            errorMessage: 'Invalid priority provided'
        }
    },
    status: {
        trim: true,
        notEmpty: {
            errorMessage: "status is required"
        },
        isIn: {
            options: [['Task','Feature','Bug','Improvement','Other']], 
            errorMessage: 'Invalid status provided'
        }
    },
    assignee: {
        trim: true,
        notEmpty: {
            errorMessage: "assignee is required"
        },
        isString: {
            errorMessage: "assignee must be string"
        },
        isLength: {
            options: {
                min: 3,
                max: 32
            },
            errorMessage: "assignee name should be 3-32 characters long."
        }
    },
    dueDate: {
        trim: true,
        notEmpty: {
            errorMessage: "dueDate  is required"
        },
        isDate: {
            options: {
                format: 'DD-MM-YYYY',
                strictMode: true,
                delimiters: ['-']
            },
            errorMessage: "due date must be in DD-MM-YYYY"
        }
    }
}

export const addTeamMemberToWorkspaceSchema = {
    email: {
        trim:true,
        notEmpty: {
            errorMessage: "email is required."
        },
        isString: {
            errorMessage: "email must be string."
        },
        isLength: {
            options: {
                min: 8,
                max: 255
            },
            errorMessage: "email must be between 8 and 255 characters long."
        },
        matches: {
            options: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/],
            errorMessage: "email is not valid."
        }
    },
    role: {
        trim: true,
        notEmpty: {
            errorMessage: "role is required"
        },
        isIn: {
            options: [['admin','member']], 
            errorMessage: 'Invalid role provided'
        }
    },
}

export const updateProjectMemberSchema = {
    email: {
        trim:true,
        notEmpty: {
            errorMessage: "email is required."
        },
        isString: {
            errorMessage: "email must be string."
        },
        isLength: {
            options: {
                min: 8,
                max: 255
            },
            errorMessage: "email must be between 8 and 255 characters long."
        },
        matches: {
            options: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/],
            errorMessage: "email is not valid."
        }
    },
    projectId: {
        trim: true,
        isEmpty:{
            errorMessage: "project Id is required"
        }
    },
}

