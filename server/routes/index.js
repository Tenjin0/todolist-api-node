export default async function configureRoutes(fastify, options, next) {
    fastify.register(require('./api'), {
        prefix: "/api/v1"
    })
    fastify.register(require('./auth'), {
        prefix: "/auth"
    })
    next()
}
