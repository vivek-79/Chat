import { NextResponse } from "next/server"


export const POST = async(req,res)=>{

    const {userId,decision,requestedId} = await req.json()
    console.log(userId,decision,requestedId)

    if([userId,decision,requestedId].some((field)=>(
        field.trim() ===''
    ))){
        throw new Error('Missing information')
    }
    if(decision =='accept'){
        console.log('accept')
        
    }
    else{
        console.log('reject')
    }
    return NextResponse.json({success:true,message:'Fetched successfully'})
}