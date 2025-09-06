const express=require('express');
const userRoute=express.Router();
const ConnectionRequest=require('../models/connectionRequest');
const User=require('../models/user');
const {userAuth}=require('../middlewares/auth');

const USER_SAFE_DATA="firstName lastName photoUrl age about skills "

userRoute.get('/user/requests/received', userAuth, async(req,res)=>
{
    try{
    const loggedInUser=req.user;
    const connectionRequests= await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status:"intrested"
    }).populate("fromUserId", USER_SAFE_DATA)
    res.json({
        message:"Data fetched successfully",
        data:connectionRequests
    })
}
catch(err){
     res.status(400).send("Error"+err.message)
}
})

userRoute.get('/user/connections',userAuth,async(req,res)=>{

    try{
        const loggedInUser=req.user;
        const connections= await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id, status:"accepted"},
                {toUserId:loggedInUser._id, status:"accepted"}
            ],
        })
        .populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA)
        const data=connections.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.json({message:"data fetched successfully", data})

    }
    catch(err){
        res.status(400).send({message:err.message})
    }
})

module.exports=userRoute;
