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

async function verifyUserAndPassword(request, reply, done) {
    const jwt = this.jwt
    const knex = this.knex
    console.log("verifyUserAndPassword", request.body)
    const result = await knex.table("users").where("email", request.body.email)
    bcrypt.compare(request.body.password, result[0].password, (err, res) => {
        // res == true or res == false
        
        console.log("result", result[0].password, res)
        if (res) {
            delete result[0].password
            request.user = result[0]
            done()
        } else {
            done(new Error("email or password incorrect"))
        }
      });
    // request.user = result[0]
}

async function hashPassword(password) {
    return bcrypt.hash(password, 10)
    
}

module.exports = {
    hashPassword,
    verifyJWT,
    verifyUserAndPassword
}
