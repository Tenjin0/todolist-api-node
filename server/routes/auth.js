const userSchemaSignUp = {
    body: {
        type: "object",
        properties: {
            email: {
                type: "string",
                format: "email"
            },
            password: {
                type: "string"
            },
            confirmPassword: {
                type: "string"
            }
        },
        required: ["email", "password", "confirmPassword"]
    }
}

module.exports = async function(fastify, options) {

    fastify.route({
        method: 'POST',
        url: '/signup',
        schema: userSchemaSignUp,
        handler: (req, res) => {
            res.send({
                token: "azedfsfd"
            })
        }
    }, {
        method: 'POST',
        url: '/signin',
        beforeHandler: fastify.auth([fastify.verifyUserAndPassword]),
        handler: (req, res) => {
            res.send({
                token: "azedfsfd"
            })
        }
    })
}