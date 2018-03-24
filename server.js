const express = require('express');
const bodyParser = require('body-parser');
var User = require('./models/user');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/blog');

const app=express();
//Body Parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
  res.send("HEllo!");
});

app.route('/register')
    .get((req,res,next)=>{
        res.send('Login template here');
      })
    .post((req,res,next)=>{
      var name = req.body.name;
      var username = req.body.username;
      var password = req.body.password;
      var new_user = new User({
        name: name,
        username: username,
        password: password
      });
      new_user.save((err)=>{
        if(err) throw err;
        });
      res.send(name+" "+username+" "+password);
      });

app.listen(5000,() => console.log('Example app listening on port 5000!'))
