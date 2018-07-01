const fastify = require('fastify')

const app = fastify({
    logger: true
})

app.use(require('cors')())
app.register(require("fastify-blipp"));
app.register(require('fastify-helmet'))
app.register(require('fastify-boom'));
app.register(
    require('fastify-compress'), {
        brotli: require('iltorb')
    }
)

app.register(require('../routes/index'))

module.exports =  app;
