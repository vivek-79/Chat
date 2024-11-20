

import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text:{
        type:String,
        default:'',
    },
    photo:{
        type:String,
        default:"",
    },
    seenBy:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:"",
        }
    ]
},{timestamps:true})

export const Message = mongoose.models.Message || mongoose.model('Message',messageSchema) 