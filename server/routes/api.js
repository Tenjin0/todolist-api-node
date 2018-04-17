module.exports =  async function (fastify, options, next) {
    fastify.register(require('./todos'), { prefix: 'todos' });
    fastify.use(async function (req, res, nextInstance) {
        console.log("you'll need to auth");
        nextInstance();
    });
    fastify.get('/', async function (req, res) {
        res.send({
            status: "ok",
            message: "coucou api"
        });
    });
    next();
}