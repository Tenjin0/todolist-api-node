const { todoSchemaPost, todoSchemaPut } = require("../schemas/todos")

module.exports = async function(fastify, options, next) {

    fastify.get('/', async function(req, res) {
        const pagination = await fastify.pagination(Number.parseInt(req.query.page), "todos")
            const meta = fastify.meta(pagination.page, pagination.total)
        
        if (pagination.offset > pagination.total) {
            const errResponse = new Error("page_out_of_range")
            return res.code(400).send(errResponse)
        }
        
        const result = await fastify.knex.table("todos").offset(pagination.offset).limit(fastify.configapi.per_page)
        res.code(200).send({
            items: result,
            '_meta': meta,
            '_links': pagination.links
        })
    })

    fastify.route({
        method: 'PUT',
        url: '/:id([0-9]+)',
        schema: todoSchemaPut,
        handler: async (req, res) => {
            const infoToPut = {
            }
            if (req.body.title)
            infoToPut.title = req.body.title
            if (req.body.completed)
                infoToPut.completed = req.body.completed
            if (Object.keys(infoToPut).length > 0) {
                infoToPut.updated_at = fastify.knex.fn.now()
                const result = await fastify.knex.table("todos").returning("*").update(infoToPut)
                res.code(200).send({
                    items: [result["0"]]
                })
            } else {
                res.code(400).send({
                    description: "No params in the body"
                })
            }
        }
    });

    fastify.route({
        method: 'POST',
        url: '/',
        schema: todoSchemaPost,
        handler: async (req, res) => {
            const infoToPost = {
                title: req.body.title,
                completed: req.body.completed,
                id_user: req.user.id
            }
            const result = await fastify.knex.table("todos").returning("*").insert(infoToPost)
            res.code(200).send({
                items: [result["0"]]
            })
        }
    });

    fastify.delete('/:id([0-9]+)', async function(req, res) {

        const result = await fastify.knex.table("todos").returning("*")
        .where('id', req.params.id)
        .del();

        if (result.length === 0) {
            let error = new Error("no_ressource_found")
            error.replace = req.params.id
            res.code(400).send(error)
        } else {
            res.code(200).send({
                items : result
            })
        }
    });

    next()
}
