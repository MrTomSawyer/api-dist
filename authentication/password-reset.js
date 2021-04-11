const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const userModel = require('../users/model')
const NotFoundError = require('../utils/errors/NotFoundError')

class PasswordReset {
    path = '/reset'
    transporter

    options = {
        from: 'district.robot@gmail.com',
        to: '',
        subject: 'Password reset instructions',
        text: 'Follow this link to reset password: '
    } 

    router = express.Router()

    constructor() {
        this.initRoutes()
        this.createTransporter()
    }

    initRoutes = () => {
        this.router.post(this.path, this.forgotPassword)
    }

    createTransporter = () => {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'district.robot@gmail.com',
                pass: 'yh5-RMh-GSR-XTJ', 
            },
        })
    }

    forgotPassword = async (req, res, next) => {
        try {

            const { email } = req.body
            const user = await userModel.findOne({ email }).lean()
            
            // if(!user) return next(new NotFoundError('No such user found'))
    
            const secret = 'ABC'
            const user_data = { id: '12', email: 'd'}
    
            const token = jwt.sign(user_data, secret, {expiresIn: '15m'})
            const link = `https://localhost:3000/${token}`
    
            this.options.to = email
            this.options.text += link
    
            this.transporter.sendMail(this.options, function(error, info) {
                if(error) console.log('ERROR', error)
                  else ('SUCCESS', info)
            })

        } catch (error) {
            error.message = 'Failed to send password reset instructions'
            next(error)
        }
    }

}

module.exports = PasswordReset