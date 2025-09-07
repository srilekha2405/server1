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

userRoute.get('/feed', userAuth, async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 10;
        limit=limit>50? 50:limit;
        const skip=(page-1)*limit;
        const connectionRequests=await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
        ]})
        const hiddenConnectionRequests=new Set();
        connectionRequests.forEach((req)=>{
            hiddenConnectionRequests.add(req.fromUserId.toString());
            hiddenConnectionRequests.add(req.toUserId.toString())
        })
        const hiddenUsers=[...hiddenConnectionRequests]
       const avaliableUsers=await User.find({
        $and:[
           {_id: { $nin: hiddenUsers }},
           {_id:{$ne:loggedInUser._id}}
        ]
       }).select(USER_SAFE_DATA)
         .skip(skip)
         .limit(limit)
       res.json({data:avaliableUsers});
    }
    catch(err){
        res.status(400).send({message:err.message})
    }
    
})

module.exports=userRoute;
