

import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/user.model";
import { generateTokens } from "@/utils/tokens";
import { NextResponse } from "next/server";



export async function POST(req){

    await dbConnect()

    const {email,password} =await req.json()
    if(!email || !password){
        throw new Error('all fields are required')
    }
  try {
      const user = await User.findOne({email})
  
      if(!user){
          return NextResponse.json({success:false,message:"User not exists"},{status:400})
      }
  
      const verifyPassword =await user.isPasswordCorrect(password)
      if(!verifyPassword){
          return NextResponse.json({success:false,message:"Incorrect password"},{status:400})
      }
  
      const {accessToken,refreshToken} =await generateTokens(user._id)
      const loggedInUser = await User.findById(user._id).select("-password -refreshToken -chats")
      const response= NextResponse.json({success:true,loggedInUser},{status:200})
  
      const options = {
          httpOnly:true,
          secure:true,
      }
      response.cookies.set("accessToken",accessToken,options)
      response.cookies.set("refreshToken",refreshToken,options)
      return response
  } catch (error) {
    return NextResponse.json({success:false,message:"Server error"})
  }
}