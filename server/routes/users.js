module.exports = async function(fastify, options, next) {

    fastify.get('/', async function(req, res, next) {

        const page = req.query.page && !Number.isNaN(Number.parseInt(req.query.page)) ? Number.parseInt(req.query.page) : 1
        const offset = (page - 1) * fastify.configapi.per_page;
        let infos = await fastify.knex.table('users').columnInfo()
        infos = Object.keys(infos)
        const columns = infos.filter(e => e !== "password");
        let total_items = await fastify.knex.table("users").select().count().first()
        total_items = Number.parseInt(total_items.count)
        const total_pages = Math.ceil(total_items / fastify.configapi.per_page)

        if (offset > total_items) {
            const errResponse = new Error()
            errResponse.code = 'page_out_of_range'
            errResponse._meta = {
                'page': page,
                'per_page': fastify.configapi.per_page,
                'total_pages': Math.ceil(total_items / fastify.configapi.per_page),
                'total_items': total_items
            }
            res.code(400).send(errResponse)
        }
        const result = await fastify.knex.table("users").select(columns).offset(offset).limit(fastify.configapi.per_page)
        console.log(result)
        res.code(200).send({
            items: result,
            '_meta': {
                'page': page,
                'per_page': fastify.configapi.per_page,
                'total_pages': Math.ceil(total_items / fastify.configapi.per_page),
                'total_items': total_items
            },
            '_links': {
                'prev': page <= 1 ? null : "http://" + req.headers.host + fastify._routePrefix + "?pages=" + (page - 1),
                'next': page >= total_pages ? null : "http://" + req.headers.host + fastify._routePrefix + "?pages=" + (page + 1)
            }
        })



    })

    fastify.get('/:id', async function(req, res, next) {
        let infos = await fastify.knex.table('users').columnInfo()
        infos = Object.keys(infos)
        const columns = infos.filter(e => e !== "password");
        const result = await fastify.knex.table("users").select(columns).where('id', req.params.id).first()
        if (result) {
            res.send({
                items: [result]
            })
        } else {
            const errResponse = new Error()
            errResponse.code = 'id_user_not_found'
            res.code(404).send(errResponse)
        }
    })

    fastify.put('/:id', async function(req, res) {
        res.send('ok edit user')
    })

    next()
}