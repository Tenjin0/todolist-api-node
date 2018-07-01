<<<<<<< HEAD
module.exports = async function(fastify, options, next) {
    fastify.post("/signup", async (req, res, next) => {
        res.send("ok");
    });
    fastify.post("login", async (req, res, next) => {
        res.send("ok login");
    });
};
=======
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
>>>>>>> 5632dd3a896d33e565cfaac72fa6e09cc1a31eb9
