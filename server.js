const express = require('express');
const bodyParser = require('body-parser');
var User = require('./models/user');
const mongoose = require('mongoose');
var session = require('express-session');
// bycrypt , connect-mongo and express-session
mongoose.connect('mongodb://localhost/blog');

const app=express();

app.use(session({
  secret: 'Infinity War',
  resave: true,
  saveUninitialized: false
}));
//Body Parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/',isLoggedIn,(req,res)=>{
  res.send("HEllo!");
});

function isLoggedIn(req, res, next){
    // if user is authenticated in the session, carry on
    if (!req.isAuthenticated || !req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}

app.route('/register')
    .get((req,res,next)=>{
        res.sendFile('html/register.html',{ root: __dirname });
      })
    .post((req,res,next)=>{
      if(req.body.name && req.body.username && req.body.password){
        var userData = {
          name: req.body.name,
          username: req.body.username,
          password: req.body.password,
        }

        User.create(userData, function (err, user) {
          if (err) {
            return next(err)
          } else {
            req.session.userId = user._id;
            return res.redirect('/profile'); // redirect to login / profile directly
          }
        });
      }
      });

app.route('/login')
    .get((req,res,next)=>{
      res.send('Login template here');
    })
    .post((req,res,next)=>{
      if(req.body.username && req.body.password){
        User.authenticate(req.body.username, req.body.password, function (error, user) {
          if (error || !user) {
            var err = new Error('Wrong email or password.');
            err.status = 401;
            return next(err);
          } else {
            req.session.userId = user._id;
            return res.redirect('/profile');
      }
    });
      }
    });

app.get('/profile', function (req, res, next) {
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

app.listen(5000,() => console.log('Example app listening on port 5000!'))
