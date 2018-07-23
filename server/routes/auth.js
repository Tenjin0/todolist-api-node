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
            }
        },
        required: ["email", "password"]
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
                    email: req.body.email,
                    password: encryptedPassword
                }).returning(["id", "name", "email", "created_at", "updated_at"]).first()

                res.code(201).send({
                    items: [result],
                    _links: {
                        signin: "[POST]http://" + req.headers.host + "/auth/signin"
                    }
                })
            } catch (e) {
                return res.code(500).send(e)
            }

        }
    })

    fastify.route({

        method: 'POST',
        url: '/signin',
        beforeHandler: fastify.auth([fastify.verifyUserAndPassword]),

        handler: (req, res) => {
            payload = {
                id: req.user.id
            }
            const token = fastify.jwt.sign(payload)
            res.send({
                token
            })

        }
    })
}