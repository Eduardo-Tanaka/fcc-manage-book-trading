'use strict';

var Book = require('../models/book');
var Request = require('../models/request');

var google = require('node-google-api')(process.env.GOOGLE_KEY)

module.exports.listMyBooks = function(req, res, next) {
	var tradeRequests;
	var requests;
	function myTradeRequests(calllback) {
		Request.find({ 'requesterId': req.user.email }, function(err, requests){
			if (err)
				req.flash('error', err.message)
			calllback(requests);
		});
	}

	function myRequests(calllback) {
		Request.find({ 'ownerId': req.user.email }, function(err, requests){
			if (err)
				req.flash('error', err.message)
			calllback(requests);
		});
	}	

	Book.find({ 'userEmail': req.user.email, 'active': true }, function(err, books){
		if (err)
			res.render('mybooks', { error: err.message });
		
		myTradeRequests(function(requests){
			tradeRequests = requests;
			var tradeUnapproved = [];
			var tradeApproved = [];
			var tradeWaiting = [];
			tradeRequests.forEach(function(request) {
				if(request.approved == true)
					tradeApproved.push(request)
				else if(request.approved == false)
					tradeUnapproved.push(request)
				else
					tradeWaiting.push(request)
			});
			myRequests(function(requests){
				requests = requests;

				var unapproved = [];
				var approved = [];
				var waiting = [];
				requests.forEach(function(request) {
					if(request.approved == true)
						approved.push(request)
					else if(request.approved == false)
						unapproved.push(request)
					else
						waiting.push(request)
				})
					res.render('mybooks', { user: req.user, books: books, success: req.flash('success'), successRequest: req.flash('successRequest')
				, tradeWaiting: tradeWaiting, tradeApproved: tradeApproved, tradeUnapproved: tradeUnapproved, approved: approved, unapproved: unapproved, waiting: waiting });
			});
		});
	});
}

module.exports.allBooks = function(req, res, next) {
	var tradeRequests;
	var requests;
	function myTradeRequests(calllback) {
		Request.find({ 'requesterId': req.user.email }, function(err, requests){
			if (err)
				req.flash('error', err.message)
			calllback(requests);
		});
	}
	function myRequests(calllback) {
		Request.find({ 'ownerId': req.user.email }, function(err, requests){
			if (err)
				req.flash('error', err.message)
			calllback(requests);
		});
	}	
	Book.find({ 'active': true }, function(err, books){
		if (err)
			res.render('mybooks', { error: err.message });

		myTradeRequests(function(requests){
			tradeRequests = requests;
			var tradeUnapproved = [];
			var tradeApproved = [];
			var tradeWaiting = [];
			tradeRequests.forEach(function(request) {
				if(request.approved == true)
					tradeApproved.push(request)
				else if(request.approved == false)
					tradeUnapproved.push(request)
				else
					tradeWaiting.push(request)
			});
			myRequests(function(requests){
				requests = requests;

				var unapproved = [];
				var approved = [];
				var waiting = [];
				requests.forEach(function(request) {
					if(request.approved == true)
						approved.push(request)
					else if(request.approved == false)
						unapproved.push(request)
					else
						waiting.push(request)
				})
				res.render('allbooks', { user: req.user, books: books, success: req.flash('success'), successRequest: req.flash('successRequest')
				, tradeWaiting: tradeWaiting, tradeApproved: tradeApproved, tradeUnapproved: tradeUnapproved, approved: approved, unapproved: unapproved, waiting: waiting });
			});
		});
	});
}

module.exports.addBook = function(req, res, next) {
	google.build(function(api) {
		api.books.volumes.list({
			q: req.body.book
		}, function(result) {
			if(result.error){
				res.render('mybooks', { error: result.error.message });
			} else {
				var newBook = {
					userEmail: req.user.email,
					bookName: result.items[0].volumeInfo.title,
					cover: result.items[0].volumeInfo.imageLinks === undefined ? "" : result.items[0].volumeInfo.imageLinks.thumbnail,
					requested: false,
					active: true
				};
				Book.create(newBook, function(err, book){
					if (err)
						res.render('mybooks', { error: err.message });
					req.flash('success', 'Book Added')
					res.redirect('mybooks');
				});
			}
		});
	});
}

module.exports.deleteBook = function(req, res, next) {
	Book.remove({ '_id': req.body.id }, function(err){
		if (err){
			console.log(err);
			res.redirect('mybooks');
		}
		req.flash('success', 'Book Removed');
		res.redirect('mybooks');
	})
}