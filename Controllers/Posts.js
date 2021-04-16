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

    getPost = async (req, res, next) => {
        let post

        try {
            post = await postModel.find()
        } catch (error) {
            return next(new NotFoundError(`No posts have yet been saved`))
        }

        res.status(200).send(post)
    }

    createPost = async (req, res, next) => {
        const data = req.body
        data.author = req.user._id
        let post
        console.log('!!!', data)
        try {
            post = await postModel.create(data)
        } catch (error) {
            return next(new ConflictError(`Failed to create post`))
        }

        res.status(201).send(post)
    }
}

module.exports = PostController

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsX2NvbmZpcm1lZCI6ZmFsc2UsIl9pZCI6IjYwNzlkMTBiZTMzNDhmMjExNDJkMzg5OCIsImVtYWlsIjoiZEBkLnJ1IiwicGFzc3dvcmQiOiIkMmIkMTAkdGs5SG4wWnhTVVZRSWdUZWJZNzA4Lkl2Z1dWU0NKSmhLTDlqNWNZcFhWLnVwc1RIeHI1S08iLCJuYW1lIjoiZmZmZiIsIl9fdiI6MH0sImlhdCI6MTYxODU5NjEwN30.6_zuXpDAkvF2x-VKYiEobx7MAaWfMOoE0eRQgD5Hs8E

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsX2NvbmZpcm1lZCI6ZmFsc2UsIl9pZCI6IjYwNzlkMTU3MWY0ODJlNDQxMGRjMWExYiIsImVtYWlsIjoiYWFhQGEucnUiLCJwYXNzd29yZCI6IiQyYiQxMCQ4UmM0U3o4VUl4Y1NsVlZPOUN1b2guWHBVUVlDb2FhN21ra0tHeUpxdEhRTlpqSUtQQS9OcSIsIm5hbWUiOiJhYWEiLCJfX3YiOjB9LCJpYXQiOjE2MTg1OTYxODN9.IZRwp6bTHZkGaAflVkhwp5TZldnjDJDi7FA6tOI7tvQ