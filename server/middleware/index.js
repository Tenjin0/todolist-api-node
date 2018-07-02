const Fastify = require('fastify')
const decorateAuth = require('../services/auth')

function build (opts) {
    const app = Fastify(opts)


    app.use(require('cors')())
    app.register(require("fastify-blipp"));
    app.register(require('fastify-helmet'))
    app.register(require('fastify-boom'));
    app.register(
        require('fastify-compress'), {
            brotli: require('iltorb')
        }
    )
    

    app.decorate('verifyJWTandLevel', decorateAuth.verifyJWTandLevel)
    .decorate('verifyUserAndPassword', decorateAuth.verifyUserAndPassword)
    .register(require('fastify-auth'))
    // .register(require('../services/auth'))
    .after(() => {
        app.route({
            method: 'POST',
            url: '/auth-multiple',
            beforeHandler: app.auth([
            app.verifyJWTandLevel,
            app.verifyUserAndPassword
            ]),
            handler: (req, reply) => {
            req.log.info('Auth route')
            reply.send({ hello: 'world' })
            }
        })
    })

    return app
}


module.exports =  build;
