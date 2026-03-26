export const updateUserSchema = {
    newUserName: {
        trim:true,
        toLowerCase:true,
        notEmpty: {
            errorMessage: "newUserName is required."
        },
        isString: {
            errorMessage: "newUserName must be string."
        },
        isLength: {
            options: {
                min: 3,
                max: 255
            },
            errorMessage: "newUserName must be between 3 and 255 characters long."
        }
    },
    
}