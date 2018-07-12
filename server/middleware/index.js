const Fastify = require('fastify')
const decorateAuth = require('../services/auth')
const config = require("../../config")
const Boom = require('boom')
const httpResponse = require("./codes")


function build(opts) {
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
    app.setSchemaCompiler(function(schema) {
        return ajv.compile(schema)
    })

    app.use(require('cors')())
        .register(require("fastify-blipp"))
        .register(require('fastify-helmet'))
        .register(
            require('fastify-compress'), {
                brotli: require('iltorb')
            }
        )
        .register(require('fastify-favicon'), {
            path: './'
        })
        .register(require('fastify-knexjs'), config.db, err => console.error(err))
        .register(require('fastify-jwt'), {
            secret: config.jwt.secret
        })
        .register(require('fastify-auth'))
        .after(() => {
            app.register(require("../routes"))
        })

    app.decorate("configapi", config.api)
    app.decorate('verifyJWT', decorateAuth.verifyJWT)
        .decorate('verifyUserAndPassword', decorateAuth.verifyUserAndPassword)
        .decorate('hashPassword', decorateAuth.hashPassword)
        .decorate('httpCode', httpResponse.codes)
        .decorate('errorCode', httpResponse.error_desc)

    app.setErrorHandler(function(error, request, reply) {
        const newError = []
        if (error.validation) {
            for (let i = 0; i < error.validation.length; i++) {
                const validation = error.validation[i]
                const paramType = Object.keys(validation.params)[0]
                newError.push({
                    code: "",
                    type: paramType,
                    Parameter: error.validation[i].params[paramType],
                    description: error.validation[i].message
                })
            }
            reply.code(400).send({
                statusCode: 400,
                message: "",
                description: error.message,
                errors: newError
            })
        } else if (codes.has(error.statusCode)) {
            let jsonResponse = {
                    status_code: error.statusCode,
                    message: fastify.httpCode.get(error.statusCode),
                    error_code: error.code,
                    description: fastify.error_code.get(error.code)
            }
            if (error._meta) {
                jsonResponse._meta = error._meta
            }
            if (error._link) {
                jsonResponse._link = error._link
            }
            reply.code(error.statusCode).send(jsonResponse)
        } else {
            // console.log(Object.keys(reply))
            reply.send(error)
        }


    })
    return app
}


module.exports = build;