const express = require('express')
const router=express.Router()
const UserModel=require('./../model/userModel')
const passport = require('passport')
var bcrypt = require('bcryptjs');
var multer  = require('multer')
const jwt=require('jsonwebtoken')

//file upload using multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/upload')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  var upload = multer({ storage: storage })

  router.post('/fileupload',upload.single('image'),(req,res,next)=>{
      res.send({
          msg:'file upload successfully'
      })
  })
  //end of file upload
//login
router.get('/login', (req, res) => res.render('login'));

router.post('/login', (req, res, next) => {
    // passport.authenticate('local', {
    //   successRedirect: '/welcome',
    //   failureRedirect: '/dashboard',
    // })(req, res, next);
    passport.authenticate('local',(err,user)=>{
        if(err){
            console.log(err)
        }
        var userDetails={
           name:user.name,
           email:user.email
        }
        jwt.sign({userDetails}, 'privateKey', (err, token)=> {
            console.log(token);
          });
    })(req, res, next);
   
  });

  //welcome
   router.post('/welcome',authToken,(req,res)=>{
       jwt.verify(req.token,'privateKey',(err,authorizData)=>{
           if(err) return res.status(403);
           res.status(200).send({
            message: 'Successful log in',
            authorizData 
           })
          
       })

   })

  //end of code

  //verfiy jwt authtoken function
  function authToken(req,res,next){
      var bearerToken=req.headers['authorization']
      console.log(bearerToken,'jk')
      if(typeof bearerToken!==undefined){
              var token=bearerToken.split(" ")
              req.token=token[1]
              next()
      }else{
          res.status(403)
      }
      
  }


  // end of code
  
//register
router.get('/register',(req,res)=>res.render('register'));
router.post('/register',(req,res)=>{
if(!req.body.name){
    res.status(400).send({msg:"name is required"})
}else if(!req.body.email){
    res.status(400).send({msg:"email is required"})
}else if(!req.body.password){
    res.status(400).send({msg:"password is required"})
}
bcrypt.genSalt(10,(err,salt)=>{
bcrypt.hash(req.body.password,salt,(err,hash)=>{
    if (err) return res.status(400).send({
        msg: err
    })

    const User=new UserModel({
        name:req.body.name,
        email:req.body.email,
        password:hash
    })

    User.save((err,value)=>{
        if(err){
      if(err.code === 11000){
         if((err.errmsg).indexOf('email_1') != -1){
             return res.status(400).send({
                 msg:"Email already exists",
                 emailExist:true
             })
    
         }
      }else{
          console.log(err)
        return res.status(400).send({ msg: err });
      }  
        }else{
            return res.status(200).send({msg:"User Created Successfully"})
    
        }
    })


})
})

})
module.exports=router