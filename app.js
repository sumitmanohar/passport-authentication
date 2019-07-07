const express = require('express')
const app=express()
var ejs =require('ejs')
var path =require('path')
const mongoose=require("mongoose")
const bodyParser = require('body-parser');

const index=require('./routes/index')
const user=require('./routes/user')
const config=require('./config/databaseKey')
const passport = require('./config/passport');


app.use(passport.initialize());
//mongodb connection
mongoose.connect(config.mongoURL,{useNewUrlParser:true}).then(()=>{
console.log('mongodb connected')
})
.catch(err=>{console.log(err)})

//bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//ejs
app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'ejs');
// Router
app.use('/',index)
app.use('/user',user)
const PORT=process.env.PORT || 5000
app.listen(PORT,console.log(`server listen on port ${PORT}`))