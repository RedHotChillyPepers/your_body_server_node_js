const mongoose = require('mongoose')
const Schema = mongoose.Schema
const privatePaths = require('mongoose-private-paths')

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        unique: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
})

userSchema.plugin(privatePaths)

module.exports = mongoose.model('users', userSchema)