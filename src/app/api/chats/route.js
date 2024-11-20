

import { Chat } from "@/models/Chat.model"
import { User } from "@/models/user.model"
import mongoose from "mongoose"
import { NextResponse } from "next/server"


export const POST = async (req, res) => {

    const { userId, decision, requestedId } = await req.json()

    if ([userId, decision, requestedId].some((field) => (
        field.trim() === ''
    ))) {
        throw new Error('Missing information')
    }
    try {
        if (decision == 'accept') {

            const existChat = await Chat.findOne({
                members: {
                    $all: [
                        userId,
                        requestedId
                    ]
                }
            })
            if (existChat) {
                return NextResponse.json({ success: true, message: 'Chat alredy exist' })
            }
            else {
                await User.findByIdAndUpdate(userId,{
                    $push:{friends:requestedId}
                })

                await User.findByIdAndUpdate(requestedId,
                    {
                        $push:{friends:userId}
                    }
                )
                const newChat = new Chat({
                    members: [userId, requestedId]
                })

                await newChat.save()

                if (newChat) {
                    await User.findByIdAndUpdate(
                        userId,
                        {
                            $push: {
                                chats: newChat._id
                            }
                        }
                    )

                    await User.findByIdAndUpdate(
                        requestedId,
                        {
                            $push: {
                                chats: newChat._id
                            }
                        }
                    )
                    await User.findByIdAndUpdate(
                        userId,
                        {
                            $pull: { requests: requestedId }
                        }
                    )
                    const user = await User.findById(userId)
                    const requests = user.requests

                    const data = {
                        newChat,
                        requests
                    }
                    return NextResponse.json({ success: true, message: 'New chat created', data }, { status: 201 })
                }
                else {
                    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
                }
            }

        }
        else {

            await User.findByIdAndUpdate(
                userId,
                {
                    $pull: { requests: requestedId }
                }
            )
            const user = await User.findById(userId)
            const requests = user.requests
            return NextResponse.json({ success: true, message: 'Request deleted', requests }, { status: 201 })
        }
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
    }
}

export const GET = async (req, res) => {

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
        return NextResponse.json({ success: false, message: 'User Id not found' }, { status: 400 })
    }

    try {
        const chat = await User.aggregate([
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup:{
                    from:'chats',
                    localField:'chats',
                    foreignField:'_id',
                    as:'chats',
                    pipeline:[
                        {
                            $lookup:{
                                from:'users',
                                localField:'members',
                                foreignField:'_id',
                                as:'members',
                                pipeline:[
                                    {
                                        $project:{
                                            fullName:1,
                                            avatar:1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $lookup:{
                                from:'messages',
                                localField:'lastMessage',
                                foreignField:'_id',
                                as:'lastMessage'
                            }
                        }
                    ]
                }
            },{
                $project:{
                    chats:1
                }
            }
        ])
        return NextResponse.json({ success: true, message: 'Chats retrieved successfully', chat });
    } catch (error) {
        console.error(error.message);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}