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
    title: {
        trim: true,
        notEmpty: {
            errorMessage: "project name is required"
        },
        isString: {
            errorMessage: "project name must be string"
        },
        isLength: {
            options: {
                min: 2,
                max: 255
            },
            errorMessage: "project name should be 2-255 characters long."
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
            options: [['PLANNING', 'ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED']],
            errorMessage: 'Invalid status provided'
        }
    },
    priority: {
        trim: true,
        notEmpty: {
            errorMessage: "priority is required"
        },
        isIn: {
            options: [['MEDIUM', 'LOW', 'HIGH']],
            errorMessage: 'Invalid priority provided'
        }
    },
    projectLead: {
        trim: true,
        notEmpty: {
            errorMessage: "project_leader email is required"
        },
        isString: {
            errorMessage: "project_leader email must be string"
        },
        isLength: {
            options: {
                max: 255
            },
            errorMessage: "project_leader email should not exceeds 255 characters."
        }
    },
    startDate: {
        trim: true,
        isDate: {
            options: {
                format: 'YYYY-MM-DD',
                strictMode: true,
                delimiters: ['-']
            },
            errorMessage: "start date must be in YYYY-MM-DD"
        }
    },
    endDate: {
        trim: true,
        notEmpty: {
            errorMessage: "endDate name is required"
        },
        isDate: {
            options: {
                format: 'YYYY-MM-DD',
                strictMode: true,
                delimiters: ['-']
            },
            errorMessage: "end date must be in YYYY-MM-DD"
        }
    },
    teamMembers: {
        trim: true,
        isArray: {
            errorMessage: "teamMembers must be an array"
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
                min: 36,
                max: 36
            },
            errorMessage: "project id should be 36 characters long."
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
    type: {
        trim: true,
        notEmpty: {
            errorMessage: "type is required"
        },
        isIn: {
            options: [['TASK', 'FEATURE', 'BUG', 'IMPROVEMENT', 'OTHER']],
            errorMessage: 'Invalid type provided'
        }
    },
    priority: {
        trim: true,
        notEmpty: {
            errorMessage: "priority is required"
        },
        isIn: {
            options: [['MEDIUM', 'LOW', 'HIGH']],
            errorMessage: 'Invalid priority provided'
        }
    },
    status: {
        trim: true,
        notEmpty: {
            errorMessage: "status is required"
        },
        isIn: {
            options: [['TODO', 'IN_PROGRESS', 'DONE']],
            errorMessage: 'Invalid status provided'
        }
    },
    assigneeId: {
        trim: true,
        notEmpty: {
            errorMessage: "assigneeId is required"
        },
        isString: {
            errorMessage: "assigneeId must be string"
        },
        isLength: {
            options: {
                min: 36,
                max: 36
            },
            errorMessage: "assigneeId should be 36 characters long."
        }
    },
    dueDate: {
        trim: true,
        notEmpty: {
            errorMessage: "dueDate  is required"
        },
        isDate: {
            options: {
                format: 'YYYY-MM-DD',
                strictMode: true,
                delimiters: ['-']
            },
            errorMessage: "due date must be in YYYY-MM-DD"
        },
        toDate: true
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
                min: 36,
                max: 36
            },
            errorMessage: "task id should be 36 characters long."
        }
    },
    authorId: {
        trim: true,
        notEmpty: {
            errorMessage: "author id is required"
        },
        isString: {
            errorMessage: "author id must be string"
        },
        isLength: {
            options: {
                min: 36,
                max: 36
            },
            errorMessage: "author id should be 36 characters long."
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
    workspaceId: {
        in: ['params'],
        trim: true,
        notEmpty: {
            errorMessage: "workspaceId is required"
        },
        isString: {
            errorMessage: "workspace id must be string"
        },
        isLength: {
            options: {
                min: 36,
                max: 36
            },
            errorMessage: "workspace id should be 36 characters long."
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
    projectId: {
        in: ['params'],
        trim: true,
        notEmpty: {
            errorMessage: "projectId is required"
        },
        isString: {
            errorMessage: "project id must be string"
        },
        isLength: {
            options: {
                min: 36,
                max: 36
            },
            errorMessage: "project id should be 36 characters long."
        }
    },
    title: {
        trim: true,
        notEmpty: {
            errorMessage: "project title is required"
        },
        isString: {
            errorMessage: "project title must be string"
        },
        isLength: {
            options: {
                max: 255
            },
            errorMessage: "project title should not exceeds 255 characters."
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
            options: [['PLANNING', 'ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED']],
            errorMessage: 'Invalid status provided'
        }
    },
    priority: {
        trim: true,
        notEmpty: {
            errorMessage: "priority is required"
        },
        isIn: {
            options: [['MEDIUM', 'LOW', 'HIGH']],
            errorMessage: 'Invalid priority provided'
        }
    },
    startDate: {
        trim: true,
        // Use isISO8601 instead of isDate for full timestamp strings
        isISO8601: {
            options: { strict: true },
            errorMessage: "Start date must be a valid ISO8601 string (YYYY-MM-DDTHH:mm:ss.sssZ)"
        },
        // This is the CRITICAL fix for your "value.toISOString is not a function" error
        toDate: true
    },
    endDate: {
        trim: true,
        notEmpty: {
            errorMessage: "endDate name is required"
        },
        isISO8601: {
            options: { strict: true },
            errorMessage: "Start date must be a valid ISO8601 string (YYYY-MM-DDTHH:mm:ss.sssZ)"
        },
        
        toDate: true
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
                min: 36,
                max: 36
            },
            errorMessage: "project id should be 36 characters long."
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
    type: {
        trim: true,
        notEmpty: {
            errorMessage: "type is required"
        },
        isIn: {
            options: [['TASK', 'FEATURE', 'BUG', 'IMPROVEMENT', 'OTHER']],
            errorMessage: 'Invalid type provided'
        }
    },
    priority: {
        trim: true,
        notEmpty: {
            errorMessage: "priority is required"
        },
        isIn: {
            options: [['MEDIUM', 'LOW', 'HIGH']],
            errorMessage: 'Invalid priority provided'
        }
    },
    status: {
        trim: true,
        notEmpty: {
            errorMessage: "status is required"
        },
        isIn: {
            options: [['TODO', 'IN_PROGRESS', 'DONE']],
            errorMessage: 'Invalid status provided'
        }
    },
    assignee: {
        trim: true,
        notEmpty: {
            errorMessage: "assignee Id is required"
        },
        isString: {
            errorMessage: "assignee Id must be string"
        },
        isLength: {
            options: {
                min: 36,
                max: 36
            },
            errorMessage: "assignee name should be 36 characters long."
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
        trim: true,
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
            options: [['org:admin', 'org:member']],
            errorMessage: 'Invalid role provided'
        }
    },
}

export const updateProjectMemberSchema = {
    email: {
        trim: true,
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
        isEmpty: {
            errorMessage: "project Id is required"
        },
        isString: {
            errorMessage: "project id must be string"
        },
        isLength: {
            options: {
                min: 36,
                max: 36
            },
            errorMessage: "project id should be 36 characters long."
        }
    },
}

