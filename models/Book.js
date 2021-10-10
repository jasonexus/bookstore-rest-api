const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isbn13: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
})

module.exports = mongoose.model('Book', bookSchema)