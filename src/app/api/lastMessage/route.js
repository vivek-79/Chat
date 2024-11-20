import { dbConnect } from "@/lib/dbConnect";
import { Message } from "@/models/Message";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";



export const GET = async (req,res)=>{
    try {
        
        await dbConnect();
        const {searchParams} = new URL(req.url);
        const messageId = searchParams.get('messageId')
        const updatedChat = await Message.findById(
            messageId
        ).populate({
            path:'sender',
            model:User
        })

       return NextResponse.json({success:true,updatedChat},{status:200})
    } catch (error) {
        return NextResponse.json({success:false,message:'Failed to send message'},{status:500})
    }
}