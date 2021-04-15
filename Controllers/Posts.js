const express = require('express')
let postModel = require('../models/PostModel')
const auth = require('../middlewares/auth')

const NotFoundError = require('../utils/errors/NotFoundError')
const AccessForbidden = require('../utils/errors/AccessForbiddenError')
const ConflictError = require('../utils/errors/ConflictError')

class PostController {
    path = '/posts'
    router = express.Router()

    constructor() {
        this.initRoutes()
    }

    initRoutes = () => {
        this.router.get(this.path, auth, this.getPost)
        this.router.get(`${this.path}/:id`, auth, this.getPostById)
        this.router.patch(`${this.path}/:id`, auth, this.updatePost)
        this.router.delete(`${this.path}/:id`, auth, this.deletePost)
        this.router.post(this.path, auth, this.createPost)
    }

    getPostById = async (req, res, next) => {
        const { id } = req.params
        let post 

        try {
            post = await postModel.findById(id)
        } catch (error) {
            return next(new NotFoundError(`No post with id: ${id} found`))
        }

        res.status(200).send(post)
    }

    updatePost = async (req, res, next) => {
        const { id } = req.params
        let post_data = req.body
        let post

        try {
            post = await postModel.findByIdAndUpdate(id, post_data, { new: true })
        } catch (error) {
            return next(new NotFoundError(`No post with id: ${id} found`))
        }

        res.status(200).send(post)
    }

    deletePost = async (req, res, next) => {
        const { id } = req.params
        let post

        try {
            post = await postModel.findByIdAndDelete(id)   
        } catch (error) {
            return next(new NotFoundError(`Post with ${id} not found`))
        }
        
        res.status(200).send(`Post ${id} deleted`)
    }

    getPost = async (req, res, next) => {
        let post

        try {
            post = await postModel.find()
        } catch (error) {
            return next(new NotFoundError(`No posts have yet been saved`))
        }

        res.status(200).send(post)
    }

    createPost = async (req, res) => {
        const data = req.body
        let post

        try {
            post = await postModel.create(data)
        } catch (error) {
            return next(new ConflictError(`Failed to create post`))
        }

        res.status(201).send(post)
    }
}

module.exports = PostController