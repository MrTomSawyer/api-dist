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
        this.router.get(this.path, auth, this.getPosts)
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
            return next(new NotFoundError(`No post with the id: ${id} found`))
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
            return next(new NotFoundError(`No post with the id: ${id} found`))
        }

        res.status(200).send(post)
    }

    deletePost = async (req, res, next) => {
        const { id } = req.params
        const owner  = req.user
        let post

        try {
            const post_to_delete = await postModel.findOne({ _id: id })

            if(JSON.stringify(post_to_delete.author) === JSON.stringify(owner._id)) {
                post = await postModel.findByIdAndDelete({ _id: id })   
            } else {
                return next(new AccessForbidden('You can only delete your own posts'))
            }
        } catch (error) {
            return next(new NotFoundError(`Failed to delete post ${id}`))
        }
        
        res.status(200).send(`Post ${id} deleted`)
    }

    getPosts = async (req, res, next) => {
        let posts

        try {
            posts = await postModel.find()
        } catch (error) {
            return next(new NotFoundError(`No posts have yet been saved`))
        }

        res.status(200).send(posts)
    }

    createPost = async (req, res, next) => {
        const data = req.body
        data.author = req.user._id
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
