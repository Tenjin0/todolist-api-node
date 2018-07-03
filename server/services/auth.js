function verifyJWTandLevel(request, reply, done) {
    console.log("verifyJWTandLevel")
    done()
}

function verifyUserAndPassword(request, reply, done) {
    console.log("verifyUserAndPassword")
   done()
}

module.exports = {
    verifyJWTandLevel, verifyUserAndPassword
}