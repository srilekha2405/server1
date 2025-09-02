const express=require('express');
const requestRoute=express.Router();
const ConnectionRequest=require('../models/connectionRequest')
const {userAuth}=require('../middlewares/auth');
const User=require('../models/user')

requestRoute.post('/request/send/:status/:toUserId',
    userAuth,
    async(req,res)=>{
        try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId; 
        const status=req.params.status

        const allowedStatus=["intrested","ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:'Invalid status type'+status})
        }

        const toUser= await User.findById(toUserId)
        if(!toUser){
            return res.status(400).json({message:'User not find'})
        }

        const existingConnectionRequest= await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        })
        if(existingConnectionRequest){
            return res.status(400).send({message:'connection request already exist'})
        }

        const connectionRequest= new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data=await connectionRequest.save();
        res.json({
            message: req.user.firstName + "is"+ status+ "in"+  toUser.firstName,
            data
        })
        }
        catch(err){
            res.status(400).send('Error' +err.message)
        }
    }
)
module.exports=requestRoute;