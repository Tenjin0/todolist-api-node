const decorateAuth = require('../services/auth')

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
decorateAuth(app)

app
    .register(require('fastify-jwt'), {
        secret: 'supersecret'
    })
    // .register(require('fastify-leveldb'), {
    //     name: 'authdb'
    // })
    .register(require('fastify-auth'))
    .after(() => {
        app.register(require('../routes'))
    })

app.setErrorHandler((error, reply) => {
    console.log('error', error)
    error.message = JSON.parse(error.message);
    reply.send(error);
});

module.exports = app;