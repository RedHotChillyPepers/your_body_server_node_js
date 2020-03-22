const mongoose = require('mongoose')
const Schema = mongoose.Schema

const socialNetworksSchema = new Schema({
    socialNetworkId: {
        type: String,
        required: true
    },
    socialNetworkType: {
        type: String,
        enum: ['vk', 'instagram', 'ok', 'go', 'twitter', 'facebook'],
        required: true
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

module.exports = mongoose.model('socialNetworks', socialNetworksSchema)