const express=require('express')
const connectDB=require('./config/dataBase')
const app=express();
const User=require('./models/user')
const bcrypt = require('bcrypt');
const { validationSignup}=require('./utils/validation')
const cookieParser = require('cookie-parser')
const jwt=require('jsonwebtoken')

app.use(express.json());
app.use(cookieParser());

app.post('/signup',async(req,res)=>{
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

app.post('/login',async(req,res)=>{
    try{
    const {emailId,password}=req.body;
    const user=await User.findOne({emailId:emailId});
    if(!user){
        throw new Error('Invalid credentials')
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(isPasswordValid){
        const token=await jwt.sign({_id:user._id},'Srilekh@1#2#3')
        res.cookie("token",token);
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

app.get('/profile',async(req,res)=>{
    try{
    const cookies=req.cookies;
    const {token}=cookies;
    if(!token){
        throw new Error('Invalid token')
    }
    const decodedMessage=await jwt.verify(token,'Srilekh@1#2#3')
    const {_id}=decodedMessage;
    const user=await User.findById(_id);
    if(!user){
        throw new Error('User does not exist')
    }
    res.send(user)
    }
    catch(err){
        res.status(400).send("Eror:"+err.message)
    }
})

app.get('/user',async(req,res)=>{
    try{
    const userEmail=req.body.emailId
    const users=await User.find({emailId:userEmail})
    if(users.length===0){
        res.status(400).send('user not found')
    }
    else{
    res.send(users)
    }
    }
    catch(err){
        res.status(400).send('error occured',err.message)
    }
})

app.get('/feed',async(req,res)=>{
    try{
        const user=await User.find({})
        if(!user){
            res.status(400).send('users not found');
        }
        else{
            res.send(user)
        }
    }
    catch(err){
        res.status(400).send('error occured',err.message)
    }
})
app.patch('/user/:userId',async(req,res)=>{
    const userId=req.params?.userId;
    const data=req.body;
    try{
        const ALLOWED_UPDATES=[
            "userId",
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills"
        ];
        const isUpdateAllowed=Object.keys(data).every((k)=>
        ALLOWED_UPDATES.includes(k));
        console.log(isUpdateAllowed) 
        if(!isUpdateAllowed){
            throw new Error('Update not allowed')
        }
        if(data?.skills.length>10){
            throw new Error('skills cannot be exceeded more than 10')
        }
        
        await User.findByIdAndUpdate({_id:userId},data,{runValidators:true,returnDocument:"after"})
        res.send('user details updated successfully');
        
    }
    catch(err){
        res.send('something went wrong-'+err.message)
    }
})


connectDB().then(()=>{
    console.log('dataBase Connection established sucessfully')
    app.listen(7777)
})
.catch((err)=>{
    console.log('database connection not established')
})
