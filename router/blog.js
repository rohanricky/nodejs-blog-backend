var express = require('express');
var router = express.Router();
var session = require('express-session');
var Blog = require('../models/blogSchema');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

router.route('/')
    .get((req,res,next)=>{
      res.send('Blog post edit template');
    })
    .post((req,res,next)=>{
      if(req.body.title && req.body.content){
        var blogData = {
          title : req.body.title,
          content : req.body.content,
          userId : req.session.userId,
        }
        Blog.create(blogData,function(err,blog){
          if(err){
            return next(err)
          }else{
            res.send(blog);
          }
        });
      }
    });
module.exports = router;
