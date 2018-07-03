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
            console.log(fastify.knex)
            this.knex("users").insert({
                email: req.body.email,
                password: this.hashPassword(req.body.password)
            })
        }
    }, {
        method: 'POST',
        url: '/signin',
        beforeHandler: fastify.auth([fastify.verifyUserAndPassword]),
        handler: (req, res) => {
            payload = {
                id : 1
            }
            const token = fastify.jwt.sign({ payload })
            reply.send({ token })
          
        }
    })
}