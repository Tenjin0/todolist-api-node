module.exports = async function(fastify, options, next) {
    fastify.get('/', async function(req, res) {
        res.send({
            status: "ok",
            message: 'all todos',
            data: [{
                id: 1,
                title: "todo1",
                completed: false
            }, {
                id: 2,
                title: "todo2",
                completed: false
            }, {
                id: 3,
                title: "todo3",
                completed: false
            }]
        })
    })
}