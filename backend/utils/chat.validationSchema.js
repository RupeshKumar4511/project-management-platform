export const querySchema = {
    query: {
        trim:true,
        notEmpty: {
            errorMessage: "query is required."
        },
        isString: {
            errorMessage: "query must be string."
        },
        isLength: {
            options: {
                min: 2,
                max: 1000
            },
            errorMessage: "query must be between 3 and 255 characters long."
        }
    },
}