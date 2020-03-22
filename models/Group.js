const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    members: {
        type: ['users'],
        default: []
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('groups', groupSchema)