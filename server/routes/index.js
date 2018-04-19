module.exports = async function configureRoutes(fastify, options, next) {
    fastify.addHook('onSend', (request, reply, payload, next) => {
        console.log('onSend', typeof(payload))
        let newPayload = JSON.parse(payload)
        newPayload.description = 'toto'
        next(null, JSON.stringify(newPayload))
    })

    fastify.register(require('./api'), {
        prefix: "/api/v1"
    })
    fastify.register(require('./auth'), {
        prefix: "/auth"
    })
    next()
}
