import { dbConnect } from "@/lib/dbConnect"
import { User } from "@/models/user.model"
import { NextResponse } from "next/server"

export const GET = async(req,res)=>{

    const {searchParams} =new URL(req.url);
    const userId = searchParams.get('userId')
    console.log(userId)
    try {
        await dbConnect();
        const result = await User.find(
            {
                _id:{$ne:userId}
            }
        ).limit(10)

        if(!result){
            return NextResponse.json({success:false,message:"Users not found"},{status:500})
        }

        return NextResponse.json({success:true,result},{status:200})
    } catch (error) {
        return NextResponse.json({success:false,message:error.message},{status:500})
    }
}