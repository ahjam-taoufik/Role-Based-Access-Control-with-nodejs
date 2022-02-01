const router=require('express').Router();


router.get('/register',(req,res, next)=>{
    res.render('register')
})
router.get('/login',(req,res, next)=>{
    res.render('login')
})
router.post('/register',(req,res, next)=>{
    res.send('Register page for post')
})

router.post('/login',(req,res, next)=>{
    res.send('login page for post')
})

router.get('/logout',(req,res, next)=>{
    res.send('logout ')
})


module.exports=router