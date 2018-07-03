function verifyJWT(request, reply, done) {
    const jwt = this.jwt
    const knex = this.knex

    const auth = request.req.headers["auth"]
    
    if(!auth) {
        return done(new Error("Missing token header"))
    }
    
    jwt.verify(auth, onVerify)

    function onVerify(err, decoded) {
        if (err) {
            return done(new Error('Token not Valid'))
        }
        console.log(decoded)
        done()
    }
}

function verifyUserAndPassword(request, reply, done) {
    console.log("verifyUserAndPassword")
    done()
}

module.exports = {
    verifyJWT,
    verifyUserAndPassword
}