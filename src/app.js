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


connectDB().then(()=>{
    console.log('dataBase Connection established sucessfully')
    app.listen(7777)
})
.catch((err)=>{
    console.log('database connection not established')
})
