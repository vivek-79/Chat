
import { dbConnect } from "@/lib/dbConnect"
import { Chat } from "@/models/Chat.model";
import { Message } from "@/models/Message";
import { User } from "@/models/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export const GET = async (req,res)=>{
    try {
        
        const {searchParams} = new URL(req.url)

        const chatId = searchParams.get('chatId')
        await dbConnect();
        const res = await Chat.findById(new mongoose.Types.ObjectId(chatId)).populate({
            path:'members',
            model:User
        })
        if (!res) {
            return NextResponse.json({ success: false, message: 'No chat found between users' }, { status: 404 });
        }
        return NextResponse.json({success:true,message:'Successfully',res}, { status: 200 })
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({success:false,message:error.message})
    }
}

export const POST = async(req,res)=>{

    try {
        await dbConnect()
        const body = await req.json()
        const {chatId,userId} = body
        await Message.updateMany({chat:chatId},
            { $addToSet:{seenBy:userId}},
            {new:true}
        ).populate({
            path:"seenBy sender",
            model:User,
        })
        return NextResponse.json({success:true,message:'Successfully seen message'})
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({success:false,message:'Cant update seen Message'})
    }
}