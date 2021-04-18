const advertModel = require('../models/AdvertModel')
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
        this.router.get(this.path, auth, this.getAdverts)
        this.router.get(`${this.path}/:id`, auth, this.getAdvertById)
        this.router.patch(`${this.path}/:id`, auth, this.updateAdvert)
        this.router.delete(`${this.path}/:id`, auth, this.deleteAdvert)
        this.router.post(this.path, auth, this.createAdvert)
    }

    updateAdvert = async (req, res, next) => {
        const { id } = req.params
        let adv_data = req.body
        let adv

        try {
            adv = await dvertModel.findByIdAndUpdate(id, adv_data, { new: true })
        } catch (error) {
            return next(new NotFoundError(`No adv with id: ${id} found`))
        }

        res.status(200).send(adv)
    }

    createAdvert = async (req, res, next) => {
        const data = req.body
        let adv

        try {
            adv = await advertModel.create(data)
        } catch (error) {
             next(new BadRequestError('Failed to create advertising'))
        }

        res.status(201).send(adv)
    }

    deleteAdvert = async (req, res, next) => {
        const { id } = req.params
        const { is_admin }  = req.user
        let adv

        try {
            if(is_admin) {
                adv = await advertModel.findByIdAndDelete({ _id: id })   
            } else {
                return next(new AccessForbidden('Only admins can delete an advertising'))
            }
        } catch (error) {
            return next(new NotFoundError(error.message))
        }
        
        res.status(200).send(`Advertising ${id} deleted`)
    }

    getAdverts = async (req, res, next) => {
        let advs

        try {
            advs = await advertModel.find()
        } catch (error) {
            return next(new NotFoundError(`No advs have yet been saved`))
        }

        res.status(200).send(advs)
    }

    getAdvertById = async (req, res, next) => {
        const { id } = req.params
        let adv 

        try {
            adv = await advertModel.findById(id)
        } catch (error) {
            return next(new NotFoundError(`No adv with the id: ${id} found`))
        }

        res.status(200).send(adv)
    } 
}

module.exports = Advert
