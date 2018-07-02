module.exports = async function(fastify, options, next) {

    // fastify.addHook('preHandler', fastify.auth([fastify.verifyJwtAndLevel]))
    fastify.use(async function(req, res, nextInstance) {
        console.log("you'll need to auth");
        nextInstance();
    });
    fastify.register(require('./todos'), {
        prefix: 'todos'
    });

    fastify.register(require('./users'), {
        prefix: 'users'
    })
    fastify.get('/', async function(req, res) {
        res.send({
            status: "ok",
            message: "coucou api"
        });
    });
    next();
}
