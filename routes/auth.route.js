const router = require("express").Router();
const User = require("../models/user.model");
const { body, validationResult } = require("express-validator");
const passport=require('passport')

router.post("/login",ensureNOTAuthenticated, passport.authenticate('local',{
    successRedirect:"/user/profile",
    failureRedirect:"/auth/login",
    failureFlash:true
}));



router.get("/login",ensureNOTAuthenticated, (req, res, next) => {
  res.render("login");
});

router.get("/register",ensureNOTAuthenticated,(req, res, next) => {
  //req.flash('error','some error')
  //req.flash('key','some value')
  //const messages= req.flash()
  //console.log(message);
  //res.render('register',{messages})
  res.render("register");
});

router.post(
  "/register",ensureNOTAuthenticated,
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Email must be Valid")
      .normalizeEmail()
      .toLowerCase(),
    body("password")
      .trim()
      .isLength(6)
      .withMessage("Password lenght short, min 6 char required"),
    body("password2").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password do not match");
      }
      return true;
    }),
  ],
  async (req, res, next) => {
    // res.send(req.body)
    try {
      //======validation==========

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // console.log(errors);
        // return;
        errors.array().forEach((error) => {
          req.flash("error", error.msg);
        });
        res.render("register", {
          email: req.body.email,
          messages: req.flash(),
        });
        return;
      }

      //=========================
      const { email } = req.body;
      const doesExist = await User.findOne({ email: email });
      if (doesExist) {
        res.redirect("/auth/register");
        return;
      }
      const user = new User(req.body);
      await user.save();
      req.flash("success", `${user.email} registred succesfully, you can now login`);
      res.redirect("/auth/login");

      //res.send(user);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/logout",ensureAuthenticated, (req, res, next) => {
  //res.send("logout ");
  req.logout()
  res.redirect('/')
});

module.exports = router;


function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect('/auth/login');
  }
}


function ensureNOTAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    res.redirect('back');
  }else{
    next()
  }
}