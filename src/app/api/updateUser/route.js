
import { dbConnect } from "@/lib/dbConnect"
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});
export async function POST(req){

    await dbConnect();

    const data = await req.json();
    console.log(data)
    const user = await User.findById(data.userId)
    if(!user){
        return NextResponse.json({success:false,messge:"User not exist"},{status:400})
    }
    try {
        if(data.password){
            const verifyPassword = await user.isPasswordCorrect(data.oldPassword)
            
            if(!verifyPassword){
                return NextResponse.json({success:false,messge:"Old password incorrect"},{status:400})
            }
            else{
                user.password=data.password;
            }
        }
        if(data.userName && data.userName !== user.userName){
            
            const existUsername = await User.findOne({userName:data.userName});
            if(existUsername){
                return NextResponse.json({success:false,messge:"Username already taken"},{status:400})
            }
            else{
                user.userName=data.userName
            }
        }
        if(data.fullName && data.fullName !== user.fullName){
            user.fullName=data.fullName;
        }
        if(data.profileImg && data.profileImg !== user.avatar){

            const img = user.avatar
            const Url = img.split('/').pop()
            const publicUrl = Url.split('.')[0]

            const deleted = await cloudinary.uploader.destroy(publicUrl)
            if(deleted){
                user.avatar =data.profileImg;
            }
        }
        await user.save()

        const updatedUser = await User.findById(data.userId).select('-password -chats -refreshToken')
        return NextResponse.json({success:true,messge:"updated",updatedUser},{status:201})
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({success:false,message:"Server error try again"},{status:500})
    }
}