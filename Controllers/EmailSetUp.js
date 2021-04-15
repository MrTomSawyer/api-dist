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

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsX2NvbmZpcm1lZCI6ZmFsc2UsIl9pZCI6IjYwNzdlMzllZGQ5NjlmMzliYzVlYzI0NSIsImVtYWlsIjoibGV0dGVydGhpbmdAeWFuZGV4LnJ1IiwicGFzc3dvcmQiOiIkMmIkMTAkS0dTaUtkbXQ3SHNGVHNuRTF1WmRBdUprZjZ2SW9GQURaMTJ4ZHR1bTJPY003NVdCcnFiQm0iLCJuYW1lIjoiU2xhdmEiLCJfX3YiOjB9LCJpYXQiOjE2MTg0Njk3OTB9.ozL2XjifD9eFEJ9kxLRHWC9iSYCtzgBrFih1dsBQoqk
