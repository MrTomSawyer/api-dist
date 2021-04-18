const userModel = require('../models/UserModel')
const express = require('express')
const auth = require('../middlewares/auth')

const BadRequestError = require('../utils/errors/BadRequestError')

class Advert {
    path = '/advert'
    router = express.Router()

    constructor() {
        this.initRoutes()
    }

    initRoutes = () => {

    }

    createAdvert = async (req, res, next) => {
        
    }

    deleteAdvert = async (req, res, next) => {

    }

    getAdvert = async (req, res, next) => {

    }

    getAdvertById = async (req, res, next) => {

    } 
}

module.exports = Advert
