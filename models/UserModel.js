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
        unique: true,
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
    email_confirmed: {
        type: Boolean,
        default: false,
        required: false
    },
    userpic: {
        type: String,
        required: false,
        validate: {
            validator(link) {
                return validator.isURL(link)
            }
        }
    },
    description: {
        type: String,
        required: false,
		maxlength: 280,
    }
})
 
const userModel = mongoose.model('User', userSchema)
 
module.exports = userModel
