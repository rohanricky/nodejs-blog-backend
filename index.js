const express = require('express');
const bodyParser = require('body-parser');
var User = require('./models/user');
const mongoose = require('mongoose');
var session = require('express-session');
const blog = require('./router/blog');
const follow = require('./router/follow');
const feed = require('./router/feed');
// bycrypt , connect-mongo and express-session
mongoose.connect('mongodb://avengers:infinitywar@ds223609.mlab.com:23609/blog');

const app=express();

app.use(session({
  secret: 'Infinity War',
  resave: true,
  saveUninitialized: false,
}));

app.use('/blogpost',loggedIn,blog);
app.use('/follow',loggedIn,follow);
app.use('/feed',loggedIn,feed);
//Body Parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/',(req,res,next)=>{
    res.send("Hello Anonymous");
});

function loggedIn(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/register');
    }
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
          websiteUrl : req.body.website,
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

app.get('/cool',(req,res)=>{
    res.send(req.session.userId);
});

app.route('/login')
    .get((req,res,next)=>{
      res.sendFile('html/login.html',{ root: __dirname });
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
