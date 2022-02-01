const router=require('express').Router();
const User=require('../models/user.model')



router.post('/login',(req,res, next)=>{
    res.send('login page for post')
})

router.get('/login',(req,res, next)=>{
    res.render('login')
})

router.get('/register',(req,res, next)=>{
//req.flash('error','some error')
//req.flash('key','some value')
//const messages= req.flash()
//console.log(message);
//res.render('register',{messages})
    res.render('register')
})


router.post('/register',async (req,res, next)=>{
    // res.send(req.body)
    try {
        const {email}=req.body
        const doesExist=await User.findOne({email:email})
        if(doesExist){
            res.redirect('/auth/register')
            return
        }
        const user=new User(req.body)
       await user.save();
        res.send(user)
    } catch (error) {
        next(error)
    }
})



router.get('/logout',(req,res, next)=>{
    res.send('logout ')
})


module.exports=router