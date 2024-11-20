

import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
// import { sendEmail } from "@/utils/mailer";

export async function POST(req) {

    dbConnect();
    const data = await req.json()
    const { fullName, userName, email, password } = data
    if ([fullName, userName, email, password].some((field) => field.trim() == '')) {
        throw new Error('All fields requird')
    }
    try {
        const existingUser =await User.findOne({
            $or: [{ email }, { userName }]
        })
        if (existingUser) {
            return NextResponse.json(
                {success:false,message:"User already exist"},
                {status:400}
            )
        }
        const user = await User.create({
            fullName,
            userName: userName.toLowerCase(),
            email,
            password,
            avatar: '',
        })

        const createdUser = await User.findById(user._id).select("-password -refreshToken")
        if (!createdUser) {
            return NextResponse.json(
                { success: true,message: "user not created" }, 
                { status:500 }
            )
        }

        return NextResponse.json({ success: true ,createdUser }, 
            { status:201}
        )
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ success: false , message: "Server error" ,error:error.message}, 
            {status:500}
        )
    }
}