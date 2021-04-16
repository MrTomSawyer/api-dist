const express = require('express')
const userModel = require('../models/UserModel')
const SendEmail = require('../utils/SendEmail/SendEmail')
const jwt = require('jsonwebtoken')

const BadRequest = require('../utils/errors/BadRequestError')
class EmailSetup {
    path = '/email'
    router = express.Router()
    Email = new SendEmail()

    constructor() {
        this.initRoutes()
    }

    initRoutes = () => {
        this.router.patch(`${this.path}/:email/:token`, this.confirmEmail)
    }

    confirmEmail = async (req, res, next) => {
        const { token } = req.params
        
        try {
            const payload = await jwt.verify(token, 'ABC')
            await userModel.findByIdAndUpdate(payload.user._id, { email_confirmed: true })

            res.status(200).send('Email successfully confirmed')

        } catch (error) {
            next(new BadRequest('Wrong confirmation link'))
        }
    }

    resendConfirmation = async (req, res, next) => {
        const { token, email } = req.params

        try {
            const email_options = {
                email: email,
                subject: 'Email confirmation',
                text: `Follow this link to confirm email:\nhttps://localhost:3000/email/${email}/${token}`
            }
    
            this.Email.sendEmail(email_options)
    
            res.status(200).send('Email sent', email_options)

        } catch (error) {
            next(error)
        }
    }
}

module.exports = EmailSetup
