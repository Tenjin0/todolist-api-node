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
    const auth = request.req.headers["auth"] || request.query.token
    
    if(!auth) {
        return done(new Error("Missing token header"))
    }
    
    jwt.verify(auth, onVerify)

    async function onVerify(err, decoded) {
        if (err) {
            let error = new Error('Token not Valid')
                error.error_code = err.message.replace("jwt", "token").replace(/ /g, "_").toLowerCase();
            return done(error)
        }
        if (decoded.id) {
            const result = await knex.table("users").select(userColumns).where("id", decoded.id).first()
            request.user = result
            if (decoded.password) {
                request.user.newPassword = decoded.password
            }
            done()

        } else {
            let err = new Error("user_not_found")
            err.replace = "token: " + auth
            done(err)
        }
    }
}

async function verifyUserAndPassword(request, reply, done) {
    const jwt = this.jwt
    const knex = this.knex
    const result = await knex.table("users").where("email", request.body.email).first()
    if (result) {
        bcrypt.compare(request.body.password, result.password, (err, res) => {
            // res == true or res == false
            delete result.password
            request.user = result
            request.log.info({msg: 'incorrect password', data: request.body.password})
            if (res) {
                done()
            } else {
                return done(new Error("incorrect_email_or_password"))
            }
        });
    } else {
        request.log.info({msg: 'unknown users', data: request.body.email})
        return done(new Error("incorrect_email_or_password"))
    }
    // Log la vrai erreur 
}

function verifyUserLevel (level) {
    return async function (req, res, done) {
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
