"use strict";

var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.controller');
var bookController = require('../controllers/book.controller');
var requestController = require('../controllers/request.controller');

module.exports = function(passport) {
	/* GET home page. */
	router.get('/', function(req, res, next) {
	  res.render('index', { user: req.user });
	});

	router.get('/signup', function(req, res, next) {
		res.render('signup', { message: req.flash('message') });
	});

	router.get('/login', function(req, res, next) {
		res.render('login', { message: req.flash('message') });
	});

	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/login',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	router.post('/login', passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash : true  
	}));

	router.get('/settings', isAuthenticated, function(req, res, next) {
		res.render('settings', { user: req.user });
	});

	router.post('/profile', isAuthenticated, userController.changeProfile);

	router.post('/settings', isAuthenticated, userController.changePassword);

	router.get('/logout', function(req, res, next) {
	    req.logout();
	  	res.redirect('/login');
	});

	router.get('/allbooks', isAuthenticated, bookController.allBooks);

	router.post('/allbooks', isAuthenticated, requestController.requestBook);	

	router.get('/mybooks', isAuthenticated, bookController.listMyBooks);	

	router.post('/mybooks', isAuthenticated, bookController.addBook);

	router.post('/deleteBook', isAuthenticated, bookController.deleteBook);

	router.post('/deleteRequest', isAuthenticated, requestController.deleteRequest);

	router.get('/approve/:id&:url', isAuthenticated, requestController.approve);

	router.get('/unapprove/:id&:url', isAuthenticated, requestController.unapprove);

	return router;
}

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/login');
}