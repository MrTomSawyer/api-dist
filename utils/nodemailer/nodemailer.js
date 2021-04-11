'use strict'
const nodemailer = require('nodemailer')

async function transporter() {
    let testAccount = await nodemailer.createTestAccount()

    let e_transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
            user: testAccount.user, 
            pass: testAccount.pass, 
        },
    })

    return e_transporter
}


module.exports = transporter

// // send mail with defined transport object
// let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: "bar@example.com, baz@example.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
// })

// console.log("Message sent: %s", info.messageId)
// console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
