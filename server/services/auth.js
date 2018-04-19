module.exports =  function decorateAuth (fastify) {
    fastify.decorate("verifyJwtAndLevel", function (request, reply, done) {
        console.log('verifyJwtAndLevel')
        const err = new Error('toto')
        done(err)
    })
    fastify.decorate("verifyUserAndPassword", function (request, reply, done) {
        console.log('verifyUserAndPassword')
        done()
    })
}
