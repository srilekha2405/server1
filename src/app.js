const express=require('express')
const connectDB=require('./config/dataBase')
const app=express();
const User=require('./models/user')

app.use(express.json());

app.post('/signup',async(req,res)=>{
    console.log(req.body)
    const user=new User(req.body)
    try{
    await user.save();
    res.send('user added successfully')
    }
    catch(err){
        res.status(400).send('error occured',err.message)
    }
});

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


connectDB().then(()=>{
    console.log('dataBase Connection established sucessfully')
    app.listen(7777)
})
.catch((err)=>{
    console.log('database connection not established')
})
