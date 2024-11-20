

import mongoose from "mongoose";

const connected = {};

export const dbConnect = async () => {
    if(connected.connection){
        console.log('Alredy connected')
        return
    }
    try {
        const db =await mongoose.connect(process.env.MONGODB_URI,{
            serverSelectionTimeoutMS: 30000
        })
        connected.connection = db.connections[0].readyState
        console.log("db connected successfully")
    } catch (error) {
        console.log("Failed to connect db",error.message)
        process.exit(1)
    }
}