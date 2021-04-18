const mongoose = require('mongoose')
const validator = require('validator')

const advertSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
        required: true
    },
    client: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true,
        validate: {
            validator(link) {
                return validator.isURL(link)
            }
        }
    },
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
})

const advertModel = mongoose.model('Advert', advertSchema)

module.exports = advertModel
