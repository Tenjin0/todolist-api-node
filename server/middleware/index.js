const Fastify = require('fastify')
const decorateAuth = require('../services/auth')
const config = require("../../config")
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
    app.register(require('fastify-favicon'), { path: './' })
    app.register(require('fastify-knexjs'), config.db, err => console.error(err))

    app.decorate('verifyJWT', decorateAuth.verifyJWT)
    .decorate('verifyUserAndPassword', decorateAuth.verifyUserAndPassword)
    .decorate('hashPassword', decorateAuth.hashPassword)
    .register(require('fastify-auth'))
    // .register(require('../services/auth'))
    .after(() => {
       app.register(require("../routes"))
    })

    return app
}


module.exports =  build;
