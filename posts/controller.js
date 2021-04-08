const express = require('express')
const postModel = require('./model')

const NotFoundError = require('../utils/errors/NotFoundError')
const AccessForbidden = require('../utils/errors/AccessForbiddenError')
const ConflictError = require('../utils/errors/ConflictError')

class PostController {
    path = '/posts'
    router = express.Router()

    constructor() {
        this.initRoutes()
    }

    initRoutes() {
        this.router.get(this.path, this.getPost)
        this.router.get(`${this.path}/:id`, this.getPostById)
        this.router.patch(`${this.path}/:id`, this.updatePost)
        this.router.delete(`${this.path}/:id`, this.deletePost)
        this.router.post(this.path, this.createPost)
    }

    getPostById = async (req, res, next) => {
        const id = req.params.id

        const post = await postModel.findById(id)

        if(post) res.status(200).send(post)
            else next(new NotFoundError(`Post with ${id} not found`))
    }

    updatePost = async (req, res, next) => {
        const id = req.params.id
        const post_data = req.body
 
        const post = postModel.findByIdAndUpdate(id, post_data, { new: true })

        if(post) res.status(200).send(post)
            else next(new NotFoundError(`Post with ${id} not found`))
    }

    deletePost = async (req, res, next) => {
        const id = req.params.id

        const post = postModel.findByIdAndDelete(id)

        if(post) res.status(200).send(`Post ${id} deleted`)
            else next(new AccessForbidden(`You cant delete other users' posts`))
    }

    getPost = async (req, res, next) => {
        const post = await postModel.find()

        if(post) res.status(200).send(post)
            else next(new NotFoundError(`No posts found`))
    }

    createPost = async (req, res) => {
        const post = new postModel(req.body)
        const saved_post = await post.save()
        
        if(saved_post) res.status(200).send(saved_post)
        else next(new ConflictError(`Failed to create post`))
    }
}

module.exports = PostController