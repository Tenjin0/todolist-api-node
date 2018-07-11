module.exports = async function configureRoutes(fastify, options, next) {
    fastify.addHook('onRoute', (routeOptions) => {
        // routeOptions.method
        // routeOptions.schema
        // routeOptions.url
        // routeOptions.bodyLimit
        // routeOptions.logLevel
        // routeOptions.prefix
    })
    fastify.addHook('onResponse', (req, res, next) => {
        if(next) 
            next()
    })
    fastify.addHook('onSend', (request, reply, payload, next) => {

        try {
            let newPayload = JSON.parse(payload)
            newPayload.description = 'toto'
            next(null, JSON.stringify(newPayload))
        } catch(e) {
            next(null, payload)
        }
    })

    fastify.register(require('./auth'), {
        prefix: "/auth"
    })
    fastify.register(require('./api'), {
        prefix: "/api/v1"
    })
    next()
}
