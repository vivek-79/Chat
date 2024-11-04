import { User } from "@/models/user.model"
import mongoose from "mongoose"
import { NextResponse } from "next/server"


export const POST = async (req, res) => {

    const { requested, userId } = await req.json()

    if (!requested || !userId) {
        throw new Error('userId not found')
    }

    try {
        const check = await User.findOne({
            _id:requested,
            requests: userId
        })

        if (!check) {
            const sent = await User.findByIdAndUpdate(
                requested,
                {
                    $push: { requests: userId }
                },
                {
                    new: true,
                }
            )
            await sent.save()
            const requests = sent.requests
            return NextResponse.json({ success: true, message: 'Complete', requests }, { status: 201 })
        }
        return NextResponse.json({ success: false, message: 'Request already sent' }, { status: 400 })
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
    }
}

export const GET = async(req,res)=>{

    const {searchParams} = new URL(req.url)
   const userId = searchParams.get('userId')

   try {
     const result = await User.aggregate([
         {
             $match:{_id:new mongoose.Types.ObjectId(userId)},
         },
         {
             $lookup:{
                 from:'users',
                 localField:'requests',
                 foreignField:'_id',
                 as:'requests',
                 pipeline:[
                     {
                         $project:{
                             userName:1,
                             avatar:1,
                         }
                     }
                 ]
             }
         },
         {
            $project:{
                requests:1,
            }
         }
     ])
     return NextResponse.json({success:true,message:'completed',result},{status:200})
   } catch (error) {
    return NextResponse.json({success:true,message:error.message,},{status:500})
   }
}