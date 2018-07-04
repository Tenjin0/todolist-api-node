const Fastify = require('fastify')
const decorateAuth = require('../services/auth')
const config = require("../../config")
const Boom = require('boom')


const codes = new Map([
    [100, 'Continue'],
    [101, 'Switching Protocols'],
    [102, 'Processing'],
    [200, 'OK'],
    [201, 'Created'],
    [202, 'Accepted'],
    [203, 'Non-Authoritative Information'],
    [204, 'No Content'],
    [205, 'Reset Content'],
    [206, 'Partial Content'],
    [207, 'Multi-Status'],
    [300, 'Multiple Choices'],
    [301, 'Moved Permanently'],
    [302, 'Moved Temporarily'],
    [303, 'See Other'],
    [304, 'Not Modified'],
    [305, 'Use Proxy'],
    [307, 'Temporary Redirect'],
    [400, 'Bad Request'],
    [401, 'Unauthorized'],
    [402, 'Payment Required'],
    [403, 'Forbidden'],
    [404, 'Not Found'],
    [405, 'Method Not Allowed'],
    [406, 'Not Acceptable'],
    [407, 'Proxy Authentication Required'],
    [408, 'Request Time-out'],
    [409, 'Conflict'],
    [410, 'Gone'],
    [411, 'Length Required'],
    [412, 'Precondition Failed'],
    [413, 'Request Entity Too Large'],
    [414, 'Request-URI Too Large'],
    [415, 'Unsupported Media Type'],
    [416, 'Requested Range Not Satisfiable'],
    [417, 'Expectation Failed'],
    [418, 'I\'m a teapot'],
    [422, 'Unprocessable Entity'],
    [423, 'Locked'],
    [424, 'Failed Dependency'],
    [425, 'Unordered Collection'],
    [426, 'Upgrade Required'],
    [428, 'Precondition Required'],
    [429, 'Too Many Requests'],
    [431, 'Request Header Fields Too Large'],
    [451, 'Unavailable For Legal Reasons'],
    [500, 'Internal Server Error'],
    [501, 'Not Implemented'],
    [502, 'Bad Gateway'],
    [503, 'Service Unavailable'],
    [504, 'Gateway Time-out'],
    [505, 'HTTP Version Not Supported'],
    [506, 'Variant Also Negotiates'],
    [507, 'Insufficient Storage'],
    [509, 'Bandwidth Limit Exceeded'],
    [510, 'Not Extended'],
    [511, 'Network Authentication Required']
])
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
    app.register(require("fastify-blipp"));
    app.register(require('fastify-helmet'))
    // app.register(require('fastify-boom')); // skirt setErrorHandler
    app.register(
        require('fastify-compress'), {
            brotli: require('iltorb')
        }
    )
    app.register(require('fastify-favicon'), {
        path: './'
    })
    app.register(require('fastify-knexjs'), config.db, err => console.error(err))

    app.setErrorHandler(function(error, request, reply) {
        const newError = []
        if (error.validation) {
            for(let i=0; i < error.validation.length; i++){
                console.log(error.validation[i])
                const validation = error.validation[i]
                const paramType = Object.keys(validation.params)[0]
                newError.push({
                    code:"",
                    type: paramType,
                    Parameter : error.validation[i].params[paramType],
                    description : error.validation[i].message
                })
            }
            Boom
            reply.code(400).send({
                statusCode: 400,
                message: "",
                description: error.message,
                errors: newError
            })
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


module.exports = build; 