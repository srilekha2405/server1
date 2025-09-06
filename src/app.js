const express=require('express')
const connectDB=require('./config/dataBase')
const app=express();
const User=require('./models/user')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const jwt=require('jsonwebtoken')

app.use(express.json());
app.use(cookieParser());

const authRouter=require('./routes/auth');
const profileRouter=require('./routes/profile')
const requestRouter=require('./routes/requests')
const userRequestsReceivedRouter=require('./routes/user')

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/',userRequestsReceivedRouter)


connectDB().then(()=>{
    console.log('dataBase Connection established sucessfully')
    app.listen(7777)
})
.catch((err)=>{
    console.log('database connection not established')
})
