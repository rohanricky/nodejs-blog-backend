var express = require('express');
var router = express.Router();
var User = require('../models/user');
var cookieSession = require('cookie-session');
var session = require('express-session');

router.use(session({
  secret: 'Infinity War',
  resave: true,
  saveUninitialized: false
}));

router.get('/', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
          if (error) {
            return next(error);
          } else {
            if (user === null) {
              var err = new Error('Not authorized! Go back!');
              err.status = 400;
              return next(err);
            } else {
              return res.send('You are logged in: '+user.username)
            }
          }
        });
    });

module.exports = router;
