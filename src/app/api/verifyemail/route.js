import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";


export async function POST(req){

    await dbConnect()

    try {
        const reqBody= await req.json()

        const token = reqBody.token

        const user = await User.findOne({ verifyToken:token,verifyTokenExpiry:{$gt:Date.now()}})
        if(!user){
            return NextResponse.json({success:false,message:"Session expired"})
        }

        user.isVerified = true;
        user.verifyToken=undefined;
        user.verifyTokenExpiry=undefined;

        await user.save()

        return NextResponse.json({success:true,message:"User verified"})
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({success:false,message:"Server error"})
    }
} 