const userSchemaSignUp = {
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
        handler: async (req, res) => {

            try {
                var encryptedPassword = await fastify.hashPassword(req.body.password)
                const result = await fastify.knex.table("users").insert({
                    email : req.body.email,
                    password: encryptedPassword
                }).returning("*")
                console.log(result)
                res.send({
                    token: "azedfsfd"
                })
            }catch (e) {
                console.log(e)
                return res.send("erreur")
            }
            
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
