const userModel = require('../models/UserModel')
const express = require('express')
const auth = require('../middlewares/auth')

const BadRequestError = require('../utils/errors/BadRequestError')

class Profile {
    path = '/profile'
    router = express.Router()

    constructor() {
        this.initRoutes()
    }

    initRoutes = () => {
        this.router.delete(this.path, auth, this.deleteAccount)
        this.router.patch(this.path, auth, this.updateProfile)
    }

    updateProfile = async (req, res ,next) => {
        const { _id } = req.user

        try {
            const user = await userModel.findByIdAndUpdate(_id, req.body, { new: true })
            res.status(200).send({ user })
        } catch (error) {
            next(new BadRequestError('Failed to update profile picture'))
        }
    }

    deleteAccount = async (req, res ,next) => {
        const { _id } = req.user

        try {
            await userModel.findByIdAndDelete(_id, { description }, { new: true })
            res.status(200).send(`Account ${_id} deleted`)
        } catch (error) {
            next(new BadRequestError('Failed to delete account'))
        }
    }
}

module.exports = Profile
