module.exports = async function(fastify, options, next) {

    fastify.get('/', async function(req, res, next) {

        const page = req.query.page && !Number.isNaN(Number.parseInt(req.query.page)) ? Number.parseInt(req.query.page) : 1
        const offset = (page - 1) * fastify.configapi.per_page;
        let infos = await fastify.knex.table('users').columnInfo()
        infos = Object.keys(infos)
        const columns = infos.filter(e => e !== "password" && e !== "level"); // refactoring
        let total_items = await fastify.knex.table("users").select().count().first()
        total_items = Number.parseInt(total_items.count)
        const total_pages = Math.ceil(total_items / fastify.configapi.per_page)

        if (offset > total_items) {
            const errResponse = new Error()
            errResponse.error_code = 'page_out_of_range'
            errResponse._meta = {
                'page': page,
                'per_page': fastify.configapi.per_page,
                'total_pages': Math.ceil(total_items / fastify.configapi.per_page),
                'total_items': total_items
            }
            res.code(400).send(errResponse)
        }
        const result = await fastify.knex.table("users").select(columns).offset(offset).limit(fastify.configapi.per_page)
        res.code(200).send({
            items: result,
            '_meta': {
                'page': page,
                'per_page': fastify.configapi.per_page,
                'total_pages': Math.ceil(total_items / fastify.configapi.per_page),
                'total_items': total_items
            },
            '_links': {
                'prev': page <= 1 ? null : "[GET]http://" + req.headers.host + fastify._routePrefix + "?pages=" + (page - 1),
                'next': page >= total_pages ? null : "[GET]http://" + req.headers.host + fastify._routePrefix + "?pages=" + (page + 1)
            }
        })



    })

    fastify.get('/:id([0-9]+)', async function(req, res, next) {
        let infos = await fastify.knex.table('users').columnInfo()
        infos = Object.keys(infos)
        const columns = infos.filter(e => e !== "password" && e !== "level"); // refactoring
        const result = await fastify.knex.table("users").select(fastify.userColumns).where('id', req.params.id).first()
        if (result) {
            res.send({
                items: [result]
            })
        } else {
            const errResponse = new Error()
            errResponse.error_code = 'id_user_not_found'
            res.code(404).send(errResponse)
        }
    })

    fastify.route({
        method: 'PUT',
        url: '/:id([0-9]+)',
        beforeHandler: fastify.auth([fastify.verifyUserLevel("ADMIN")]),
        handler: (req, res) => {
            console.log("userColumns", fastify.userColumns)
            console.log(req.user)
            payload = {
                id: 1
            }
            const token = fastify.jwt.sign(payload)
            res.send({
                token
            })

        }
    }),

    fastify.put('/me', async function(req, res) {
        console.log(req.user)
        res.send('ok edit my profile')
    })

    next()
}