const mongoose=require('mongoose');

const URI="mongodb+srv://srilekha2405:Wt4X6x4cDscb6sfT@cluster0.39jvfjf.mongodb.net/devTinder"
const connectDB=async()=>{
    await mongoose.connect(URI)
}
module.exports=connectDB