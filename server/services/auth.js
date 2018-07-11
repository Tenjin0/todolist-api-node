const bcrypt = require('bcrypt');

async function hashPassword(password) {

    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, encrypted) => {
            if (err) {
                return reject(err)
            }
            resolve(encrypted)
        })
    })
  
}

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
        done()
    }
}

async function verifyUserAndPassword(request, reply, done) {
    const jwt = this.jwt
    const knex = this.knex
        const result = await knex.table("users").where("email", request.body.email).first()
        request.log.info({msg: 'unknown users', data: request.body.email})
        if (result) {
            bcrypt.compare(request.body.password, result.password, (err, res) => {
                // res == true or res == false
                delete result.password
                request.user = result
                request.log.info({msg: 'incorect password', data: request.body.password})
                if (res) {
                    done()
                } else {
                    return done(new Error("incorrect email or password"))
                }
              });
        } else {
            return done(new Error("incorrect email or password"))
        }
        // Log la vrai erreur 
}

async function hashPassword(password) {
    return bcrypt.hash(password, 10)
    
}

module.exports = {
    hashPassword,
    verifyJWT,
    verifyUserAndPassword
}
