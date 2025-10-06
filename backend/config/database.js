const mongoose=require('mongoose')

const connectDB=async()=>{
    try{
        await mongoose.connect("mongodb+srv://Divy:Divy%406976@startupindia.q0igqmy.mongodb.net/devTINDER")
        console.log("MongoDB connected")
    }catch(err){
        console.log(err)
    }

}

module.exports={connectDB}