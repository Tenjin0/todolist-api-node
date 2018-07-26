const {userSchemaPut, userSchemaPutMe, userMeResetPasswordSchema, userResetPasswordSchema} = require("../schemas/users")
const email = require("../services/email");

module.exports = async function(fastify, options, next) {

    fastify.route({
        method: 'GET',
        url: '/',
        beforeHandler: fastify.auth([fastify.verifyUserLevel("ADMIN")]),
        handler: async (req, res) => {
            let infos = await fastify.knex.table('users').columnInfo()
            infos = Object.keys(infos)
            const columns = infos.filter(e => e !== "password" && e !== "level"); // refactoring

            const pagination = await fastify.pagination(Number.parseInt(req.query.page), "users")
            const meta = fastify.meta(pagination.page, pagination.total)
            
            if (pagination.offset > pagination.total) {
                const errResponse = new Error("page_out_of_range")
                return res.code(400).send(errResponse)
            }
            
            const result = await fastify.knex.table("users").select(columns).offset(pagination.offset).limit(fastify.configapi.per_page)
            res.code(200).send({
                items: result,
                '_meta': meta,
                '_links': pagination.links
            })

        }
    });

    fastify.route({
        method: 'GET',
        url: '/:id([0-9]+)',
        beforeHandler: fastify.auth([fastify.verifyUserLevel("ADMIN")]),
        handler: async (req, res) => {
            const result = await fastify.knex.table("users").select(fastify.userColumns).where('id', req.params.id).first()
            if (result) {
                res.send({
                    items: [result]
                })
            } else {
                const errResponse = new Error("id_user_not_found")
                res.code(404).send(errResponse)
            }
        }
    });

    fastify.route({
        method: 'PUT',
        url: '/:id([0-9]+)',
        schema: userSchemaPut,
        beforeHandler: fastify.auth([fastify.verifyUserLevel("ADMIN")]),
        handler: async (req, res) => {

            let infoToUpdate = {
                name: req.body.name,
                level: req.body.level,
                active: req.body.active,
                update_at: fastify.knex.fn.now()
            }
            const user = await fastify.knex.table("users").where('id', req.params.id).first()
            if (user) {
                const result = await fastify.knex.table("users").update(infoToUpdate).where('id', req.params.id)
                res.code(200).send({
                    description:"The user has been updated"
                })
            } else {
                let error = new Error("user_not_found")
                error.replace = "id: " + req.params.id
                res.code(400).send(error)
            }
        }
    });

    fastify.route({
        method: 'PUT',
        url: '/me',
        schema: userSchemaPutMe,
        handler: (req, res) => {
            // fastify.knex.table("users").update().where('id', req.params.id).first()

        }
    });

    fastify.route({
        method: 'POST',
        url: '/me/reset_password',
        schema: userMeResetPasswordSchema,
        handler: async (req, res) => {

            const resetLink =  "http://" + req.headers.host + fastify._routePrefix + "/reset_password"
            await email.generateAndSendEmail(req.user.id, req.body.password, req.user.email, resetLink)
            //https://www.smashingmagazine.com/2017/11/safe-password-resets-with-json-web-tokens/
            res.code(202).send({description: "Check your email to confirm your password change"})

        }
    });

    fastify.route({
        method: 'POST',
        url: '/reset_password',
        beforeHandler: fastify.auth([fastify.verifyUserLevel("ADMIN")]),
        schema: userResetPasswordSchema,
        handler: async (req, res) => {
            const user = await fastify.knex.table("users").where('email', req.body.email).first()
            if (user) {
                const resetLink =  "http://" + req.headers.host + fastify._routePrefix + "/reset_password"
                await email.generateAndSendEmail(user.id, req.body.password, req.body.email, resetLink)
                res.code(202).send({description: "Check your email to confirm your password change"})
            } else {
                res.code(400).send(new Error("email_not_found"))
            }
        }
    });
    
    fastify.route({
        method: 'GET',
        url: '/reset_password',
        handler: async (req, res) => {
            const result = await fastify.knex.table("users").update({password: await fastify.hashPassword(req.user.newPassword)}).where('id', req.user.id)
            res.code(200).send({
                description: "Your password has been changed",
                '_links': {
                    signin: "[POST]http://" + req.headers.host + "/auth/signin"
                }
            });
        }
    })

    next()
}