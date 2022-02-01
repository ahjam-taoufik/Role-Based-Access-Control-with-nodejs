const express = require("express");
const createHttpError = require("http-errors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const connectFlash = require("connect-flash");
const passport=require('passport')
require("dotenv").config();
const app = express();
app.use(morgan("dev")); //this line for show method sender in Terminal
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const MongoStore=require('connect-mongo')//this package for save  your session in mongoDB
const connectEnsureLogin=require('connect-ensure-login')//redirect user back after login to the requested route.




const PORT = process.env.PORT || 3000;

mongoose
.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //useCreateIndex: true,
  //useFindAndModify: false,
})
.then(() => {
  console.log(" Connected to dabtabase...");
  app.listen(PORT, () => console.log(`listening on port ${PORT}`));
})
.catch((err) => console.log(err.message));

//Init session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
     // secure:true //use this prop when you use https
     httpOnly:true
    },
    store :MongoStore.create({ mongoUrl: process.env.MONGO_URI })
  })
);

app.use(passport.initialize())
app.use(passport.session())
require('./utils/passport.auth')

app.use((req,res,next)=>{
  res.locals.user=req.user
  next()
})



app.use(connectFlash())
app.use((req,res,next)=>{
  res.locals.messages=req.flash()
  next()
})


app.use("/", require("./routes/index.route"));
app.use("/auth", require("./routes/auth.route"));
// app.use("/user",ensureAuthenticated, require("./routes/user.route"));
app.use("/user",connectEnsureLogin.ensureLoggedIn({redirectTo:'/auth/login'}), require("./routes/user.route"));

app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.render("error_40x", { error });
  //res.send(error)
});
 


// function ensureAuthenticated(req,res,next){
//   if(req.isAuthenticated()){
//     next()
//   }else{
//     res.redirect('/auth/login');
//   }
// }