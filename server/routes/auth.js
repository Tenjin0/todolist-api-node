module.exports = async function(fastify, options) {

    fastify.post('/signup', async function(req, res, next) {
        res.send('ok signup')
    })
    fastify.route({
        method: 'POST',
        url: '/login',
        beforeHandler: fastify.auth([fastify.verifyUserAndPassword]),
        handler: (req, res) => {
            res.send('ok login')
        }
    })
}