const express = require('express')
const userModel = require('../models/UserModel')
const SendEmail = require('../utils/SendEmail/SendEmail')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/auth')

const BadRequest = require('../utils/errors/BadRequestError')
class EmailSetup {
    path = '/email'
    router = express.Router()
    Email = new SendEmail()

    constructor() {
        this.initRoutes()
    }

    initRoutes = () => {
        this.router.patch(`${this.path}/:token`, this.confirmEmail)
        this.router.get(`${this.path}`, this.resendConfirmation)
        this.router.patch(`${this.path}/:email/:token`, auth, this.changeEmail)
    }

    changeEmail = async (req, res, next) => {
        const user = req.user
        const { email } = req.body

        try {
            await userModel.findByIdAndUpdate(user._id, { email })

            res.status(200).send('Email successfully changed')
        } catch (error) {
            next(new BadRequest('Failed to change Email'))
        }
    } 

    confirmEmail = async (req, res, next) => {
        const { token } = req.params
        
        try {
            const payload = await jwt.verify(token, 'ABC')
            const user = await userModel.findByIdAndUpdate(payload.user._id, { email_confirmed: true }, { new: true })

            if(user) res.status(200).send('Email successfully confirmed')
                else return next(new BadRequest('Wrong confirmation link'))
        } catch (error) {
            next(new BadRequest('Wrong confirmation link'))
        }
    }

    resendConfirmation = async (req, res, next) => {
        const { email } = req.body
        
        try {
            const user = await userModel.findOne({ email }).lean()

            if(!user.email_confirmed) {
                const payload = user
                const token = jwt.sign({ user: payload}, 'ABC')

                const email_options = {
                    email: email,
                    subject: 'Email confirmation',
                    text: `Follow this link to confirm email:\nhttps://localhost:3000/email/${token}`
                }
        
                this.Email.sendEmail(email_options)
        
                return res.status(200).send(email_options)
            }

            res.status(404).send({message: 'Nothing to confirm'})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = EmailSetup
