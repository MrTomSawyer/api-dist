const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const userModel = require('../models/UserModel')
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
            const link = `https://localhost:3000/email/${user.id}/${token}`
    
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

    changePassword = async (req, res, next) => {
        const { token, email, password } = req.body

        try {
            const payload = jwt.verify(token, 'ABC')
            if(!payload) return next(new BadRequestError('Failed to verify token'))

            const salt = await bcrypt.genSalt(10)
            const password_hash = await bcrypt.hash(password, salt)

            const user = await userModel.findOneAndUpdate(email, { password: password_hash }, { new: true })

            const secret = 'ABC' + user.email
            const new_payload = { id: user.id, email: user.email }
            const new_token = await jwt.sign(new_payload, secret, { expiresIn: '15m' })
            const link = `https://localhost:3000/email/${user.id}/${new_token}`
                
            const email_options = {
                email: email,
                subject: 'Your account password has been changed',
                text: `Somebody (may be you) has changed your account password./n
                If it wasn't you, follow this link to reset password: /n${link}`
            }

            this.Email.sendEmail(email_options)

        } catch (error) {
            next(new BadRequestError('Failed to change password'))
        }
    }

}

module.exports = PasswordReset