module.exports = async function configureRoutes(fastify, options) {
    fastify.register(require('./api'), {
        prefix: "/api/v1"
    })
}