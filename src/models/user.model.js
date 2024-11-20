



import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new Schema({

    userName:{
        type:String,
        required:true,
        unique:[true,"User already exist"]
    },
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:[true,"User already exist"]
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
    },
    refreshToken:{
        type:String,
    },
    verifyToken:{
        type:String,
    },
    verifyTokenExpiry:{
        type:Date,
    },
    requests:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    chats:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Chat'
        }
    ],
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]
})

userSchema.pre("save", async function(next){
    
    if(!this.isModified("password")) return next()
    this.password =await bcrypt.hashSync(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}


export const User = mongoose.models.User || mongoose.model("User",userSchema)