import mongoose, { mongo } from "mongoose";

const mongoUrl = process.env.MONGO_URL ;

if(!mongoUrl) {
  throw new Error("MONGO_URL is not defined");
  console.log("MONGO_URL is not defined");
}

export const connectDb = async()=>{
  if(mongoose.connection.readyState === 1)return mongoose.connection;
  if(mongoose.connection.readyState === 2)return new Promise((resolve, reject)=>{
    mongoose.connection.once("open", ()=>resolve(mongoose.connection));
    mongoose.connection.once("error", (err)=>reject(err));
  });
  return mongoose.connect(mongoUrl, {
    dbName: "PropertyDb",
  });
}