module.exports = async function(fastify, options, next) {
    fastify.get('/', async function(req, res, next) {
        console.log(fastify)
        const page = req.query.page && !Number.isNaN(Number.parseInt(req.query.page))? Number.parseInt(req.query.page) : 1
        let infos = await fastify.knex.table('users').columnInfo()
        infos = Object.keys(infos)
        const columns = infos.filter(e => e !== "password");
        const result = await Promise.all([
            fastify.knex.table("users").select(columns).limit(1),
            fastify.knex.table("users").select().count().first()]
        )
        const total_items = Number.parseInt(result[1].count)
        res.send({
            items: result[0],
            '_meta': {
                'page': page,
                'per_page': fastify.configapi.per_page,
                'total_pages': Math.ceil(total_items/fastify.configapi.per_page),
                'total_items': total_items
            },
            '_links': {
                'next': null,
                'prev': null
            }
        })
    })
    fastify.get('/:id', async function(req, res, next) {
        res.send('ok login')
    })
    fastify.put('/:id', async function(req, res) {
        res.send('ok edit user')
    })
    next()
}