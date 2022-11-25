const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String
    },
    thumbnailurl: {
        type: String
    },
    data: {
        type: Object,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Design', designSchema)