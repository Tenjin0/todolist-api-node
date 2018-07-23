const bcrypt = require('bcrypt');

const levelAuth = {
    "ADMIN": 3,
    "SUPPORT": 2,
    "USER": 1
}
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
    const userColumns = this.userColumns
    const auth = request.req.headers["auth"]
    
    if(!auth) {
        return done(new Error("Missing token header"))
    }
    
    jwt.verify(auth, onVerify)

    async function onVerify(err, decoded) {
        if (err) {
            return done(new Error('Token not Valid'))
        }
        if (decoded.id) {
            const result = await knex.table("users").select(userColumns).where("id", decoded.id).first()
            request.user = result
            done()

        } else {
            let err = new Error("User not found")
            err.error_code = "user_not_found"
            done(err)
        }
    }
}

async function verifyUserAndPassword(request, reply, done) {
    const jwt = this.jwt
    const knex = this.knex
    const userColumns = this.userColumns
    const result = await knex.table("users").where("email", request.body.email).first()
    request.log.info({msg: 'unknown users', data: request.body.email})
    if (result) {
        bcrypt.compare(request.body.password, result.password, (err, res) => {
            // res == true or res == false
            delete result.password
            request.user = result
            request.log.info({msg: 'incorrect password', data: request.body.password})
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

function verifyUserLevel (level) {
    return async function (req, res, done) {
        console.log("verifyUserLevel", level)
        if (!req.user) {
            return done(new Error("no_user_identified"))
        }
        
        console.log(req.user);
        if (req.user && levelAuth[req.user.level] >= levelAuth[level]) {
            done()
        } else {
            const err = new Error("access_forbidden")
            done(err)
        }
    }
}

module.exports = {
    hashPassword,
    verifyJWT,
    verifyUserAndPassword,
    verifyUserLevel
}
