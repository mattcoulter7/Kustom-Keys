const mongoose = require('mongoose')

const keyboardSchema = new mongoose.Schema({
    directory: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Keyboard', keyboardSchema)