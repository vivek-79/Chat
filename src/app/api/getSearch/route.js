import { dbConnect } from "@/lib/dbConnect"
import { User } from "@/models/user.model";
import { NextResponse } from "next/server"


export const GET = async (req,res)=>{

    await dbConnect();
    const {searchParams} = new URL(req.url)
    const data = searchParams.get('searched')
    
    try {
        const result = await User.find({
            userName:{$regex:data,$options:"i"}
        })
        return NextResponse.json({success:true,result},{status:200})
    } catch (error) {
        return NextResponse.json({success:false,message:error.message})
    }
}