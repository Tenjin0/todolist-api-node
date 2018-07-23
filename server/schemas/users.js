const userSchemaPut = {
    body: {
        type: "object",
        properties: {
            username: {
                type: "string"
            },
            email: {
                type: "string",
                format: "email"
            },
            level: {
                "enum": [ "ADMIN", "SUPPORT", "USER" ]
            },
            active: {
                type: "boolean"
            }
        }
        // required: ["email", "password", "confirmPassword"]
    }
}

const userMeResetPasswordSchema = {
    body: {
        type: "object",
        properties: {
            password: {
                type: "string"
            }
        },
        required: ["password"]
    }
}

const userResetPasswordSchema = {
    body: {
        type: "object",
        properties: {
            email: {
                type: "string",
                format: "email"
            },
            password: {
                type: "string"
            }
        },
        required: ["email", "password"]
    }
}

module.exports = {
    userSchemaPut,
    userMeResetPasswordSchema,
    userResetPasswordSchema
}
