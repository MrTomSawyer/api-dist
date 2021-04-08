const mongoose = require('mongoose')
const validator = require('validator')
 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
			validator(link) {
				return validator.isEmail(link);
			}
        }
    },
    password: {
        type: String,
        minlength: 8,
		maxlength: 60,
        required: true,
        select: false
    },
})
 
const userModel = mongoose.model('User', userSchema)
 
module.exports = userModel
