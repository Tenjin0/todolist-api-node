const nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken')
const secret = require("../../config").jwt.secret
var configEmail = require("../../config").email

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: configEmail.address,
        pass: configEmail.password
    }
});

const genererateTokenResetPassword = async (password) => {
    let expires = (Date.now() / 1000) + 60 * 30
    let nbf = Date.now() / 1000

    return await jwt.sign({nbf: nbf, exp: expires, password}, secret)
}

const sendEmail = (opts) => {
    const mailOptions = {
        from: configEmail.address,
        to: opts.to, // list of receivers
        subject: opts.subject, // Subject line
        html: opts.content // plain text body
    };
    console.log(configEmail)
    transporter.sendMail(mailOptions, function(err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
}

module.exports = {
    sendEmail,
    genererateTokenResetPassword
}