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
        .register(require('fastify-knexjs'), config.db, err => console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>"))

        .register(require('fastify-jwt'), {
            secret: config.jwt.secret
        })
        .register(require('fastify-auth'))
        .after(() => {
            app.register(require("../routes"))
        })
        .register(async (instance, opts, next) => {
            // not working duno why
            let userColumnsInfo = await instance.knex.table('users').columnInfo()
            userColumnsInfo = Object.keys(userColumnsInfo)
            const columns = userColumnsInfo.filter(e => e !== "password" && e !== "level"); // refactoring
            instance.userColumns = columns
            instance.decorate('userColumns', columns)
            next()
        })
        .ready(async (err) => {
            let userColumnsInfo = await app.knex.table('users').columnInfo()
            userColumnsInfo = Object.keys(userColumnsInfo)
            const columns = userColumnsInfo.filter(e => e !== "password" && e !== "level"); // refactoring
            app.userColumns = columns
            console.log('Everything has been loaded')
        })
            

    app.decorate("configapi", config.api)
    app.decorate('verifyJWT', decorateAuth.verifyJWT)
        .decorate('verifyUserAndPassword', decorateAuth.verifyUserAndPassword)
        .decorate('hashPassword', decorateAuth.hashPassword)
        .decorate('verifyUserLevel', decorateAuth.verifyUserLevel)
        .decorate('httpCode', httpResponse.codes)
        .decorate('errorCode', httpResponse.error_desc)
        .decorateReply('httpCode', httpResponse.codes)
        .decorateReply('errorCode', httpResponse.error_desc)

    app.setErrorHandler((error, request, reply) => {
        console.log("setErrorHandler")
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
            return reply.code(400).send({
                statusCode: 400,
                message: "",
                description: error.message,
                errors: newError
            })
        }
        let jsonResponse = {}
        let replace = ""
        if (!error.error_code) {
            if (reply.res.statusCode === 404) {
                error.error_code = "route_not_found"
                replace =  request.raw.url
            } else {
                error.error_code = "unknown_error"
            }
        }
        jsonResponse = {
            status_code: reply.res.statusCode,
            message: reply.httpCode.get(reply.res.statusCode),
            error_code: error.error_code,
            description: reply.errorCode.get(error.error_code).replace("{}", replace)
        }
        if (error._meta) {
            jsonResponse._meta = error._meta
        }
        if (error._link) {
            jsonResponse._link = error._link
        }
        reply.send(jsonResponse)


    })
    return app
}


module.exports = build;