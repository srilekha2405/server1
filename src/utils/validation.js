const validator = require('validator');
const validationSignup=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName||!lastName){
        throw new Error('Name is not valid');
    }
    else if(!validator.isEmail(emailId)){
        throw new Error('Enter a valid email address')
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error('Enter a strong password')
    }
}
module.exports={
    validationSignup
}