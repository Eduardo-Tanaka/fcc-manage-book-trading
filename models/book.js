'use strict';

var mongoose = require('mongoose');

var schema = mongoose.Schema({
    userEmail: String,
    bookName: String,
    cover: String,
    requested: Boolean,
    active: Boolean,
});

var Book = mongoose.model('Book', schema);

module.exports = Book;