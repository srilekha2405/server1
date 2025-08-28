const express=require('express');
const profileAuth=express.Router();
const {userAuth}=require('../middlewares/auth')

profileAuth.get('/profile',userAuth,async(req,res)=>{
    try{
        const user=req.user;
        res.send(user)
    }
    catch(err){
        res.status(400).send("Eror:"+err.message)
    }
})

module.exports=profileAuth
