const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const userModel = require('../users/model')
const Email = require('../utils/SendEmail/SendEmail')

const NotFoundError = require('../utils/errors/NotFoundError')
const AccessForbidden = require('../utils/errors/AccessForbiddenError')
const BadRequestError = require('../utils/errors/BadRequestError')

class PasswordReset {
    path = '/reset'
    transporter
    Email = new Email()
    router = express.Router()

    constructor() {
        this.initRoutes() 
    }

    initRoutes = () => {
        this.router.post(this.path, this.sendResetEmail)
    }

    sendResetEmail = async (req, res, next) => {
        const { email } = req.body

        try {
            const user = await userModel.findOne({ email }).lean()
            
            if(!user) return next(new NotFoundError('No such user found'))
    
            const secret = 'ABC' + user.email
            const payload = { id: user.id, email: user.email}
    
            const token = await jwt.sign(payload, secret, { expiresIn: '15m' })
            const link = `https://localhost:3000/${user.id}/${token}`
    
            const email_options = {
                email: email,
                subject: 'Password reset instructions',
                text: `Follow this link to reset password: /n${link}`
            }

            this.Email.sendEmail(email_options)

            res.status(200).send('Token has been sent')

        } catch (error) {
            error.message = 'Failed to send password reset instructions'
            return next(error)
        }
    }

    resetPassword = async (req, res, next) => {
        const { id, token } = req.params

        const user = await userModel.findOne({ id }).lean()

        // if(!user) return next(new NotFoundError('No such user found'))
        const secret = 'ABC' + user.password
        let payload

        try {
            payload = await jwt.verify(payload, secret)
        } catch (error) {
            return next(new AccessForbidden('Failed to verify token'))
        }

        if(payload.id !== id) {
            return next(new BadRequestError('Wrong password reset link')) 
        }

        res.status(200).send({ user })
    }

}

module.exports = PasswordReset