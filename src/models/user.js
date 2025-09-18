const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                 throw new Error('Invalid EmailId')
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                 throw new Error('Enter a Strong Password')
            }
        }
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not defined")
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://i.pinimg.com/originals/01/4e/f2/014ef2f860e8e56b27d4a3267e0a193a.jpg",
        validate(value){
            if(!validator.isURL(value)){
                 throw new Error('Enter a validURL')
            }
        }
        
    }, 
    about:{
        type:String,
        default:"This is a default about of the user!",
    },
    skills:{
        type:[String],
        validate:{
            validator(value){
                return Array.isArray(value) && new Set(value).size===value.length;
            },
            message:"Duplicate skills are not allowed"
        }
    }
},
{
    timestamps:true
});
userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id},"Srilekh@1#2#3",{expiresIn:"1d"})
    return token;
}
userSchema.methods.validatePassword=async function(passwordGivenByUser){
    const user=this;
    const passwordHash=user.password;
    const isValidate=await bcrypt.compare(passwordGivenByUser,passwordHash);
    return isValidate;
}


const User=mongoose.model("User",userSchema);
module.exports=User;