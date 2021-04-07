const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    author: String,
    content: String,
    title: String,
})

const postModel = mongoose.model('Post', postSchema)

module.exports = postModel