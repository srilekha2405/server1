const express=require('express');
const authRouter=express.Router();
const { validationSignup}=require('../utils/validation');
const bcrypt = require('bcrypt');
const User=require('../models/user');

authRouter.post('/signup',async(req,res)=>{
    try{
    const {firstName,lastName,emailId,password}=req.body;
    validationSignup(req)
    const passwordHash=await bcrypt.hash(password,10)
    const user=new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash
    })
    await user.save();
    res.send('user added successfully')
    }
    catch(err){
        res.status(400).send('Error:'+err.message)
    }
});

authRouter.post('/login',async(req,res)=>{
    try{
    const {emailId,password}=req.body;
    const user=await User.findOne({emailId:emailId});
    if(!user){
        throw new Error('Invalid credentials')
    }
    const isPasswordValid=await user.validatePassword(password);
    if(isPasswordValid){
        const token=await user.getJWT();
        res.cookie("token",token,{expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)});
        res.send('login successful')
        
    }
    else{
        throw new Error('Invalid credentials')
    }
    }
    catch(err){
        res.status(400).send('Error:'+err.message)
    }

})



module.exports=authRouter;