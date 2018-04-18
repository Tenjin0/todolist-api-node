export default async function(fastify, options, next) {
    fastify.get('/', async (req, res, next) => {
        res.send('ok')
    })
    fastify.get(':id', async (req, res, next) => {
        res.send('ok login')
    })
    fastify.post('/:id', async (req, res) => {
        
    })
    next()
}
