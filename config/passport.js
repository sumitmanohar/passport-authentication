const passport = require('passport')
LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../model/userModel');

  module.exports=passport.use(new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'  
      },
      (username,password,done)=>{
      
          User.findOne({email:username},(err,user)=>{
              if(err) return done(err)
              if(!user){
                  return done(null,false,{message:'Incorrect Email Id.'});
              }else if(!bcrypt.compareSync(password,user.password)){
                return done(null,false,{message:'Incorrect Password.'});
              }
              return done(null,user)

          })
      }
  ))

  passport.serializeUser((user, done)=> {
    done(null, user);
  });
  
  passport.deserializeUser((user, done)=> {
    done(null, user);
  });