
import mongoose,{Schema} from "mongoose";

const chatSchema = new Schema({

    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        }
    ],
    messages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Message',
        }
    ],
    isGroup:{
        type:Boolean,
        default:false
    },
    name:{
        type:String,
        default:'',
    },
    groupPhoto:{
        type:String,
        default:'',
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
},{timestamps:true})

export const Chat = mongoose.models.Chat || mongoose.model('Chat',chatSchema)