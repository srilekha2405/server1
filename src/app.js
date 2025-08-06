const express=require('express')
const app=express();
app.use('/hello/123',(req,res)=>{
    res.send('This is hello from /hello/123')
})
app.use('/hello',(req,res)=>{
    res.send('hello from the server');
})
app.use('/',(req,res)=>{
    res.send('This is the root directory')
})
app.listen(7777)