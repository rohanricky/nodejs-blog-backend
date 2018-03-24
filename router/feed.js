var express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
var Blog = require('../models/blogSchema');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

router.get('/',(req,res)=>{
    id = req.session.userId;
    User.findById(id,function(err,user){
      if(err) throw err;
      if(user.following!=null){
        for(i=0;i<=user.following.length;i++){
          Blog.findOne({"userId":user.following[i]})
          .exec(function (err, blog) {
            if (err) {
              return next(err)
            }else{
                res.send(blog);
            }
          });
        }
      }else{
        return next(err)
      }
    });
});

module.exports = router;
