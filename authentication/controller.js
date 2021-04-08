const express = require('express')
const userModel = require('../users/model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const ConflictError = require('../utils/errors/ConflictError')
const BadRequestError = require('../utils/errors/BadRequestError')
const NotFoundError = require('../utils/errors/NotFoundError')

class Authentication {
    path = '/users'
    router = express.Router()

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

            const user = await userModel.findOne({ email }).select('+password').lean()

            if (!user) return next(new NotFoundError('Invalid email or password'))

            const is_user = await bcrypt.compare(password, user.password)

            if (!is_user) return next(new NotFoundError('Invalid email or password'))

            delete user.password

            const token = await jwt.sign({ user }, 'ABC')

            if(token) res.status(200).send({ token }) 

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

            return res.status(200).send({ token })  

        } catch (error) {
            return next(error)
        }

    }
}

module.exports = Authentication