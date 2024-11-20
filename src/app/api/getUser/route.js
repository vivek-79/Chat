import { dbConnect } from "@/lib/dbConnect";
import { Chat } from "@/models/Chat.model";
import { User } from "@/models/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export const GET = async (req, res) => {

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId')

    try {
        await dbConnect();

        const user = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'friends',
                    foreignField: '_id',
                    as: 'friends',
                    pipeline: [
                        {
                            $project: {
                                fullName: 1,
                                avatar: 1,
                                _id: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    friends: 1
                }
            }
        ])
        return NextResponse.json({ success: true, message: 'Successfully fetch', user })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message })
    }

}

export const POST = async (req, res) => {

    const body = await req.json()
    const { newGroup, groupName, groupPic, userId } = body

    if ([newGroup, groupName, userId].some((field) =>
        !field ||(typeof field === 'string' && field.trim().length === 0)
    )) {
        return NextResponse.json({ success: false, message: 'All fields required' }, { status: 400 })
    }
    if(newGroup.length<2){
        return NextResponse.json({ success: false, message: 'At least three nember required' }, { status: 400 })
    }
    try {
        await dbConnect();

        const group = new Chat({
            members: [...newGroup,userId],
            isGroup: true,
            name: groupName,
            groupPhoto: groupPic,
            createdBy: userId,
        })

        await group.save()

        if (group) {
            await User.updateMany(
                {_id:{$in:[...newGroup,userId]}},
                {$push:{chats:group._id}}
            )
        }
        return NextResponse.json({ success: true, message: 'Group created successfully', group }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}