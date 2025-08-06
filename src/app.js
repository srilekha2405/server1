const express=require('express')
const app=express();
app.use('/hello',(req,res)=>{
    res.send('hello from the server');
})
app.listen(7777)