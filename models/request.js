'use strict';

var mongoose = require('mongoose');

var schema = mongoose.Schema({
	bookName: String,
    bookId: String,
    ownerId: String,
    requesterId: String,
    approved: Boolean,
    active: Boolean
});

var Request = mongoose.model('Request', schema);

module.exports = Request;