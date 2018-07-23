const {userSchemaPut, userMeResetPasswordSchema, userResetPasswordSchema} = require("../schemas/users")
const email = require("../services/email");
require('marko/node-require');
var emailView = require('../views/email');
 
// Load a Marko view by requiring a .marko file:
// hello.render({ name: 'Frank' }, out);

module.exports = async function(fastify, options, next) {
    fastify.get('/', async function(req, res, next) {

        const page = req.query.page && !Number.isNaN(Number.parseInt(req.query.page)) ? Number.parseInt(req.query.page) : 1
        const offset = (page - 1) * fastify.configapi.per_page;
        let infos = await fastify.knex.table('users').columnInfo()
        infos = Object.keys(infos)
        const columns = infos.filter(e => e !== "password" && e !== "level"); // refactoring
        let total_items = await fastify.knex.table("users").select().count().first()
        total_items = Number.parseInt(total_items.count)
        const total_pages = Math.ceil(total_items / fastify.configapi.per_page)

        if (offset > total_items) {
            const errResponse = new Error()
            errResponse.error_code = 'page_out_of_range'
            errResponse._meta = {
                'page': page,
                'per_page': fastify.configapi.per_page,
                'total_pages': Math.ceil(total_items / fastify.configapi.per_page),
                'total_items': total_items
            }
            res.code(400).send(errResponse)
        }
        const result = await fastify.knex.table("users").select(columns).offset(offset).limit(fastify.configapi.per_page)
        res.code(200).send({
            items: result,
            '_meta': {
                'page': page,
                'per_page': fastify.configapi.per_page,
                'total_pages': Math.ceil(total_items / fastify.configapi.per_page),
                'total_items': total_items
            },
            '_links': {
                'prev': page <= 1 ? null : "[GET]http://" + req.headers.host + fastify._routePrefix + "?pages=" + (page - 1),
                'next': page >= total_pages ? null : "[GET]http://" + req.headers.host + fastify._routePrefix + "?pages=" + (page + 1)
            }
        })



    }),

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
                const errResponse = new Error()
                errResponse.error_code = 'id_user_not_found'
                res.code(404).send(errResponse)
            }
        }
    }),

    fastify.route({
        method: 'PUT',
        url: '/:id([0-9]+)',
        schema: userSchemaPut,
        beforeHandler: fastify.auth([fastify.verifyUserLevel("ADMIN")]),
        handler: (req, res) => {
            // fastify.knex.table("users").update().where('id', req.params.id).first()
            res.send('todo')
        }
    }),

    fastify.route({
        method: 'PUT',
        url: '/me',
        schema: userSchemaPut,
        handler: (req, res) => {
            // fastify.knex.table("users").update().where('id', req.params.id).first()

        }
    }),

    fastify.route({
        method: 'POST',
        url: '/me/reset_password',
        schema: userMeResetPasswordSchema,
        handler: async (req, res) => {
            console.log(req.user)
            const token = await email.genererateTokenResetPassword("toto")
            const resetLink =  "http://" + req.headers.host + fastify._routePrefix + "/" + token
            console.log(resetLink)
            var result = emailView.renderToString({resetLink: resetLink });
            // const opts = {
            //     subject: "Reset password",
            //     to: req.user.email,
            //     content: result
            // }
            // email.sendEmail(opts);
            // https://www.smashingmagazine.com/2017/11/safe-password-resets-with-json-web-tokens/
            // fastify.knex.table("users").update().where('id', req.params.id).first()
            res.send("todo")
        }
    }),

    fastify.route({
        method: 'POST',
        url: '/reset_password',
        beforeHandler: fastify.auth([fastify.verifyUserLevel("ADMIN")]),
        schema: userResetPasswordSchema,
        handler: (req, res) => {
            // fastify.knex.table("users").update().where('id', req.params.id).first()

        }
    }),

    fastify.route({
        method: 'GET',
        url: '/reset_password/:token',
        handler: (req, res) => {
            // fastify.knex.table("users").update().where('id', req.params.id).first()

        }
    })

    next()
}