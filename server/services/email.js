const nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken')
const secret = require("../../config").jwt.secret
var configEmail = require("../../config").email
require('marko/node-require');
var emailView = require('../views/email');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: configEmail.address,
        pass: configEmail.password
    }
});

const genererateTokenResetPassword = async (id, password) => {
    console.log(id, password)
    let expires = (Date.now() / 1000) + 60 * 30
    let nbf = Date.now() / 1000

    return await jwt.sign({id, id, nbf: nbf, exp: expires, password}, secret)
}

const sendEmail = async (opts) => {
    const mailOptions = {
        from: configEmail.address,
        to: opts.to, // list of receivers
        subject: opts.subject, // Subject line
        html: opts.content // plain text body
    };
    console.log(configEmail)
    return transporter.sendMail(mailOptions);
}


const generateAndSendEmail = async (id, password, email, link) => {
    const token = await genererateTokenResetPassword(id, password)
    link = link + "?token=" + token
    var result = emailView.renderToString({resetLink: link });
    const opts = {
        subject: "Reset password",
        to: email,
        content: result
    }
    return sendEmail(opts);
}
module.exports = {
    sendEmail,
    genererateTokenResetPassword,
    generateAndSendEmail
}