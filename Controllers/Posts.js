const express = require('express')
const postModel = require('../models/PostModel')

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
        this.router.get(this.path, this.getPost)
        this.router.get(`${this.path}/:id`, this.getPostById)
        this.router.patch(`${this.path}/:id`, this.updatePost)
        this.router.delete(`${this.path}/:id`, this.deletePost)
        this.router.post(this.path, this.createPost)
    }

    getPostById = async (req, res, next) => {
        const { id } = req.params

        const post = await postModel.findById(id)

        if(post) res.status(200).send(post)
            else next(new NotFoundError(`Post with ${id} not found`))
    }

    updatePost = async (req, res, next) => {
        const { id } = req.params
        const post_data = req.body
 
        const post = postModel.findByIdAndUpdate(id, post_data, { new: true })

        if(post) res.status(200).send(post)
            else next(new NotFoundError(`Post with ${id} not found`))
    }

    deletePost = async (req, res, next) => {
        const { id } = req.params
        const { authorization } = req.headers

        if(!authorization || !authorization.startsWith('Bearer ')) {
            return next(new NotAuthorizedError('You need to sign in before deleting a card'))
        }

        const token = authorization.replace('Bearer ', '');
        let payload

        try {
            payload = await jwt.verify(token, 'ABC')
        } catch (error) {
            error.message = 'Failed to verify token'
            return next(error)
        }

        const post = await postModel.findByIdAndDelete(id)
        
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