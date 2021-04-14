const express = require('express')
const userModel = require('../users/model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Email = require('../utils/SendEmail/SendEmail')

const ConflictError = require('../utils/errors/ConflictError')
const BadRequestError = require('../utils/errors/BadRequestError')
const NotFoundError = require('../utils/errors/NotFoundError')
const AccessForbidden = require('../utils/errors/AccessForbiddenError')

class Authentication {
    path = '/users'
    router = express.Router()
    Email = new Email()

    constructor() {
        this.initRoutes()
    }

    initRoutes() {
        this.router.post(`${this.path}/signup`, this.signUp)
        this.router.post(`${this.path}/signin`, this.signIn)
    }

    signIn = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await userModel.findOne({ email }).select('+password').select('+email_confirmed').lean()

            if (!user) return next(new NotFoundError('Invalid email or password'))
            if(!user.email_confirmed) return next(new AccessForbidden('Confirm your email before logging in'))

            const is_user = await bcrypt.compare(password, user.password)
            if (!is_user) return next(new NotFoundError('Invalid email or password'))

            delete user.password
            const token = await jwt.sign({ user }, 'ABC')

            if(token) res.status(200).send({ token }) 
                else next() //?
        } catch (error) {
            next(error)
        }
    }

    signUp = async (req, res, next) => {
        const { email, password, name } = req.body

        try {
            const user = await userModel.findOne({ email })

            if (user) return next(new ConflictError('This email already taken'))
            if (password.length < 8) return next(new BadRequestError('Password has to be at least 8 characters long'))

            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)

            const new_user = await userModel.create({
                email, password: hash, name
            })
            
            delete new_user.password
            const token = await jwt.sign({ user: new_user }, 'ABC')

            const email_options = {
                email: email,
                subject: 'Email confirmation',
                text: `Follow this link to confirm email: /n https://localhost:3000/email/${email}/${token}`
            }

            this.Email.sendEmail(email_options)

            return res.status(200).send({ token })  

        } catch (error) {
            return next(error)
        }
    }
}

module.exports = Authentication