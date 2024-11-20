import { dbConnect } from "@/lib/dbConnect"
import { pusherServer } from "@/lib/pusher";
import { Chat } from "@/models/Chat.model";
import { Message } from "@/models/Message";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";


export const POST = async (req, res) => {
    try {

        await dbConnect();
        const body = await req.json();
        const { chatId, senderId, text, photo } = body

        const message = await Message.create({
            chat: chatId,
            sender: senderId,
            text,
            photo,
            seenBy: [senderId]
        })
        await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { messages: message._id },
                $set: {
                    lastMessageAt: message.createdAt,
                    lastMessage: message._id
                }
            }
        )
        
        const updatedChat = await Chat.findById(chatId).populate({
            path: 'messages',
            model: Message,
            populate: { path: 'sender', model: User }
        }).populate({
            path: 'members',
            model: User,
        }).populate({
            path:'lastMessage', model:Message
        })
        const lastMessage=updatedChat?.messages[updatedChat.messages.length-1]
        //for chat page
        await pusherServer.trigger(chatId,"new-message",updatedChat?.messages[updatedChat.messages.length-1])

        //for chat list

        for (const member of updatedChat?.members || []) {
            try {
                await pusherServer.trigger(member._id.toString(), "update-chat", {
                    id: chatId,
                    messages: [lastMessage],
                });
                console.log(`Notification sent to member: ${member._id}`);
            } catch (error) {
                console.error(`Error notifying member ${member._id}:`, error.message);
            }
        }
        return NextResponse.json({ success: true}, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: 'Failed to send message' }, { status: 500 })
    }
}
export const GET = async (req, res) => {
    try {

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const chatId = searchParams.get('chatId')

        const updatedChat = await Chat.findById(
            chatId
        ).populate({
            path: 'messages',
            model: Message,
            populate: { path: 'seenBy sender', model: User }
        }).populate({
            path: 'members',
            model: User
        })

        return NextResponse.json({ success: true, updatedChat }, { status: 200 })
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ success: false, message: 'Failed to send message' }, { status: 500 })
    }
}