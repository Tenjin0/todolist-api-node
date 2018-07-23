require('marko/node-require');
var emailView = require('../server/views/email');
const email = require("../server/services/email")
email.genererateTokenResetPassword("toto").then((token) => {
    const resetLink =  "http://"  + token
    var result = emailView.renderToString({resetLink: resetLink });
    console.log(result)
}).catch((err) => {
    console.log(err)
})
