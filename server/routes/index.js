module.exports = async function configureRoutes(fastify, options, next) {
    fastify.addHook('onRoute', (routeOptions) => {
        // console.log('onRoute', routeOptions)
        // routeOptions.method
        // routeOptions.schema
        // routeOptions.url
        // routeOptions.bodyLimit
        // routeOptions.logLevel
        // routeOptions.prefix
    })
    fastify.addHook('onClose', (instance, done) => {
        // some code
        console.log('onClose')

        done()
      })
    //   fastify.addHook('onOpen', (instance, done) => {
    //     // some code
    //     console.log('onOpen')

    //     done()
    //   })
    fastify.addHook('onResponse', (req, res, next) => {
        if(next) 
            next()
    })
    fastify.addHook('onSend', (request, reply, payload, next) => {
        console.log("onSend")
        try {
            let payloadParsed = JSON.parse(payload)
            console.log("payloadParsed", payloadParsed)
            if(!payloadParsed.status_code) {
                let newPayload = {} // make addStatusCode and reconstructMethod
                newPayload.status_code = reply.res.statusCode
                newPayload.message = fastify.httpCode.get(reply.res.statusCode)
                for (const key in payloadParsed) {
                    newPayload[key] = payloadParsed[key]
                }
                payloadParsed = newPayload
            }
            payloadParsed.api_version = 'v1'
            next(null, JSON.stringify(payloadParsed))
        } catch(e) {
            next(null, payload)
        }
    })

    fastify.register(require('./auth'), {
        prefix: "/auth"
    })
    fastify.register(require('./api'), {
        prefix: "/api/v1"
    })
    next()
}
