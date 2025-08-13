import mongoose from "mongoose";

export const connectDB=async()=>{
await mongoose.connect('mongodb+srv://amansharma:6299914507@cluster0.yuaexpg.mongodb.net/fooddel').then(()=>console.log("DB connected"));
}