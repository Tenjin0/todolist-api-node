const Fastify = require('fastify')
const decorateAuth = require('../services/auth')
const config = require("../../config")
function build (opts) {
    const app = Fastify(opts)
    const Ajv = require('ajv')
    const ajv = new Ajv({
    // the fastify defaults
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allErrors: true,
    jsonPointers: true
    })
    app.setSchemaCompiler(function (schema) {
        return ajv.compile(schema)
    })

    app.use(require('cors')())
    app.register(require("fastify-blipp"));
    app.register(require('fastify-helmet'))
    // app.register(require('fastify-boom')); // skirt setErrorHandler
    app.register(
        require('fastify-compress'), {
            brotli: require('iltorb')
        }
    )
    app.register(require('fastify-favicon'), { path: './' })
    app.register(require('fastify-knexjs'), config.db, err => console.error(err))

    app.setErrorHandler(function (error, request, reply) {
        console.log("qsdfsfdqfsqqdsfsq", error)
        if (error.validation) {
          reply.code(400).send({  })
        } else {
          reply.send(error)
        }
      })
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
