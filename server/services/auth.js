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
        console.log(decoded)
        done()
    }
}

function verifyUserAndPassword(request, reply, done) {
    console.log("verifyUserAndPassword")
    done()
}

async function hashPassword(password) {
    return bcrypt.hash(password, 10)
    
}

module.exports = {
    hashPassword,
    verifyJWT,
<<<<<<< HEAD
    verifyUserAndPassword,
    hashPassword
}
=======
    verifyUserAndPassword
}
>>>>>>> 651ad0bb5575e6438f940adf0046ae9e7af420f7
