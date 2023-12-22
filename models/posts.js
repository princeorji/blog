const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: String,
    description: String,
    tags: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    timestamp: { type: Date, default: Date.now },
    state: {
        type: String,
        enum: ['drafted', 'published'],
        default: 'drafted'
    },
    read_count: { type: Number, default: 0 },
    // reading_time: ,
    body: String
})

module.exports = mongoose.model('Posts', schema)