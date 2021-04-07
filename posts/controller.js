const express = require('express')
const postModel = require('./model')

class PostController {
    path = '/posts'
    router = express.Router()

    constructor() {
        this.initRoutes()
    }

    initRoutes() {
        this.router.get(this.path, this.getPosts)
        this.router.get(`${this.path}/:id`, this.getPostById)
        this.router.patch(`${this.path}/:id`, this.updatePost)
        this.router.delete(`${this.path}/:id`, this.deletePost)
        this.router.post(this.path, this.createPost)
    }

    getPostById(req, res) {
        const id = req.params.id
        postModel.findById(id).
            then(post => res.status(200).send(post))
    }

    updatePost(req, res) {
        const id = req.params.id
        const post_data = req.body
        console.log('!!!', id, post_data)
        postModel.findByIdAndUpdate(id, post_data, { new: true })
            .then(post => res.status(200).send(post))
    }

    deletePost(req, res) {
        const id = req.params.id

        postModel.findByIdAndDelete(id)
            .then(result => {
                if(result) res.status(200).send(`Post ${id} deleted`)
                    else res.status(404).send(`Post ${id} not found`)
            })
    }

    getPosts(req, res) {
        console.log('!!!')
        postModel.find().then(post => res.status(200).send(post))
    }

    createPost(req, res) {
        const post = new postModel(req.body)
        post.save().then(saved_post => res.status(200).send(saved_post))
    }
}

module.exports = PostController