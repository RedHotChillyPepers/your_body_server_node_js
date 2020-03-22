const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userCredentialsSchema = new Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        private: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('userCredentials', userCredentialsSchema)