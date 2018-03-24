var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

router.put('/:username',(req,res)=>{
//    res.send('Username is:'+req.params.username);
    User.getUserId(req.params.username,function(error,user){
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err)
      } else {
        User.findByIdAndUpdate(user._id,
        {"$push":{"following":user._id}},
        {"new":true,"upsert":true},
        function(err,user){
          if(err) throw err;
          res.send(user);
        });
    }
});
});


module.exports = router;
