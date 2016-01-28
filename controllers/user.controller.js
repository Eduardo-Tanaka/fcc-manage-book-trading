'use strict';

var User = require('../models/user');
var bCrypt = require('bcryptjs');

module.exports.changePassword = function(req, res, next) {
    User.findOne({ 'email' :  req.user.email }, 
        function(err, user) {
            // In case of any error, return using the done method
            if (err)
                return done(null, false, req.flash(err.message));
            // User and password both match, return user from done method
            // which will be treated like success
            if (!isValidPassword(user, req.body.current)) {
                res.render('settings', { user: user, password: "Invalid Password." });
            };
            user.password = createHash(req.body.password);

            // save the user
            user.save(function(err) {
                if (err){
                    console.log('Error in Saving user: '+err);  
                    throw err;  
                }
                console.log('User Registration succesful');    
            });
            res.render('settings', { user: req.user, password: 'Password changed.' });
        }
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
}

module.exports.changeProfile = function(req, res, next) {
    User.findOne({ 'email' :  req.user.email }, 
        function(err, user) {
            // In case of any error, return using the done method
            if (err)
                res.render('settings', { user: req.user, profile: err.message });
            user.username = req.body.username
            user.city = req.body.city;
            user.state = req.body.state;
            // save the user
            user.save(function(err) {
                if (err){
                    console.log('Error in Saving user: ' + err);  
                    res.render('settings', { user: req.user, profile: err.message });
                }
                console.log('User Profile');    
            });
            res.render('settings', { user: user, profile: 'Profile changed.' });
        }
    );
}