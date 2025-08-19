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
        res.status(400).send('error occured'+err.message)
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
