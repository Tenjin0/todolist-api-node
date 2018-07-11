module.exports = async function(fastify, options, next) {
    fastify.get('/', async function(req, res, next) {
        const page = req.query.page && !Number.isNaN(Number.parseInt(req.query.page))? Number.parseInt(req.query.page) : 1
        const offset = (page - 1) * fastify.configapi.per_page + 1;

        let infos = await fastify.knex.table('users').columnInfo()
        infos = Object.keys(infos)
        const columns = infos.filter(e => e !== "password");
        let total_items = await fastify.knex.table("users").select().count().first()
        console.log(total_items)
        total_items = Number.parseInt(total_items.count)
        console.log(offset, total_items)
        if (offset > total_items) {
            const err = new Error()
            err.statusCode = 418
            err.message = 'short and stout'
            err._meta = {
                'page': page,
                'per_page': fastify.configapi.per_page,
                'total_pages': Math.ceil(total_items/fastify.configapi.per_page),
                'total_items': total_items
            }
            return res.send(err);
        }
        const result = await fastify.knex.table("users").select(columns).offset(offset).limit(fastify.configapi.per_page)
        
        res.send({
            items: result,
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