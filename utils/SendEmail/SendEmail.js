const nodemailer = require('nodemailer')
class Email {
    transporter

    options = {
        from: 'district.robot@gmail.com',
        to: null,
        subject: null,
        text: null
    }

    constructor() {
        this.createTransporter()
    }

    createTransporter = async () => {
        this.transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'district.robot@gmail.com',
                pass: 'yh5-RMh-GSR-XTJ', 
            },
        })
    }

    sendEmail = object => {
        const { email, subject, text } = object

        this.options.to = email
        this.options.subject = subject
        this.options.text = text

        this.transporter.sendMail(this.options, (error, info) => {
            if(error) console.log('ERROR', error)
                else ('Email sent', info)
        })
    }
}

module.exports = Email