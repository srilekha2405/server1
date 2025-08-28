const express=require('express');
const profileAuth=express.Router();
const {userAuth}=require('../middlewares/auth')
const {validateEditProfile}=require('../utils/validation')

profileAuth.get('/profile',userAuth,async(req,res)=>{
    try{
        const user=req.user;
        res.send(user)
    }
    catch(err){
        res.status(400).send("Eror:"+err.message)
    }
})

profileAuth.patch('/profile/edit',userAuth,async(req,res)=>{
    try{
        validateEditProfile(req);
        if(!validateEditProfile){
            throw new Error('Edit not allowed');
        }
        const loggedInUser=req.user;
        Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key]);
         await loggedInUser.save()
        res.json({
            message:`${loggedInUser.firstName} loggedin successfuly`,
            data:loggedInUser
        })
    }
    catch(err){
        res.status(400).send("Error :"+err.message)
    }
})

module.exports=profileAuth
