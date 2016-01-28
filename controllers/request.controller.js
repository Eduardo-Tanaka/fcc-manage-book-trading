'use strict';

var Request = require('../models/request');
var Book = require('../models/book');

module.exports.requestBook = function(req, res, next) {
	Book.findOne({ '_id': req.body.id }, function(err, book){
		if (err)
			res.redirect('allbooks');
		var newRequest = {
			bookName: book.bookName,
			bookId: book._id,
			ownerId: book.userEmail,
			requesterId: req.user.email,
			active: true
		}
		Request.create(newRequest, function(err){
			if (err)
				req.flash('error', err.message);
			book.requested = true;
			book.save(function(err){
				if (err) {
					req.flash('error', err.message);
				}					
				req.flash('success', "Book Requested");
				res.redirect('allbooks');
			});
		});
	});
}

module.exports.deleteRequest = function(req, res, next) {
	console.log(req.body.bookId)
	Book.findOne({ '_id': req.body.bookId }, function(err, book) {
		if (err)
			req.flash('error', err.message);
		book.requested = false;
		book.save(function(err){
			if (err) 
				req.flash('error', err.message);
			Request.remove({ 'requesterId': req.user.email, 'bookId': req.body.bookId }, function(err) {
				if (err)
					req.flash('error', err.message);
				req.flash('successRequest', 'Request Removed')
				res.redirect(req.body.url);
			});
		});
	})
}

module.exports.approve = function(req, res, next) {
	Request.findOne({ '_id': req.params.id }, function(err, request) {
		if (err)
			req.flash('error', err.message);
		request.approved = true;
		request.active = false;
		request.save(function(err){
			if (err) 
				req.flash('error', err.message);
			Book.findOne({ '_id': request.bookId }, function(err, book) {
				if (err)
					req.flash('error', err.message);
				book.active = false;
				book.save(function(err) {
					if (err)
						req.flash('error', err.message);
					req.flash('successRequest', 'Request Approved')	
				})
			});
		});
		res.redirect('/'+req.params.url);
	});
}

module.exports.unapprove = function(req, res, next) {
	Request.findOne({ '_id': req.params.id }, function(err, request) {
		if (err)
			req.flash('error', err.message);
		request.approved = false
		request.save(function(err){
			if (err) 
				req.flash('error', err.message);
			Book.findOne({ '_id': request.bookId }, function(err, book) {
				if (err)
					req.flash('error', err.message);
				book.request = false;
				book.save(function(err) {
					if (err)
						req.flash('error', err.message);
					req.flash('successRequest', 'Request Denied')	
				})
			});
		});
		res.redirect('/'+req.params.url);
	});	
}