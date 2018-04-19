module.exports = async function(fastify, options, next) {
    fastify.get('/', async function (req, res, next) {
        res.send('ok users')
    })
    fastify.get('/:id', async function (req, res, next) {
        res.send('ok login')
    })
    fastify.post('/:id', async function (req, res) {
        res.send('ok new user')
    })
    next()
}
