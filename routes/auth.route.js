const router = require("express").Router();
const User = require("../models/user.model");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

const connectEnsure = require("connect-ensure-login"); //redirect user back after login to the requested route.
const {registerValidator}=require('../utils/validators')


router.post(
  "/login",
  connectEnsure.ensureLoggedOut({ redirectTo: "/" }),
  passport.authenticate("local", {
    // successRedirect:"/user/profile",
    successReturnToOrRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

router.get(
  "/login",
  connectEnsure.ensureLoggedOut({ redirectTo: "/" }),
  (req, res, next) => {
    res.render("login");
  }
);

router.get(
  "/register",
  connectEnsure.ensureLoggedOut({ redirectTo: "/" }),
  (req, res, next) => {
    //req.flash('error','some error')
    //req.flash('key','some value')
    //const messages= req.flash()
    //console.log(message);
    //res.render('register',{messages})
    res.render("register");
  }
);

router.post(
  "/register",
  connectEnsure.ensureLoggedOut({redirectTo:'/'}),
  registerValidator,
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
      req.flash(
        "success",
        `${user.email} registred succesfully, you can now login`
      );
      res.redirect("/auth/login");

      //res.send(user);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/logout", connectEnsure.ensureLoggedIn({redirectTo:'/'}), (req, res, next) => {
  //res.send("logout ");
  req.logout();
  res.redirect("/");
});

module.exports = router;

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     res.redirect("/auth/login");
//   }
// }

// function ensureNOTAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     res.redirect("back");
//   } else {
//     next();
//   }
// }
