const router=require('express').Router();

router.get('/',(req,res, next)=>{
    // res.send('Hello word this is index page')
    res.render('index')
})

module.exports=router