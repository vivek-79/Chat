
'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'


function ChatBox({
    members ='',
    userId='',
    chatsId='',
    chatId='',
    messageId='',
    name,
    groupPhoto,
    isGroup
}
)
{
    const router = useRouter('')
    const [chat,setChat] = useState({})
    useEffect(()=>{
        const res = async()=>{
            const res = await fetch(`http://localhost:3000/api/lastMessage?messageId=${messageId}`)

            const result = await res.json();
            setChat(result?.updatedChat)
        }
        res();
    },[messageId])
  return (
    <div className='chat-box'onClick={()=>router.push(`/chats/${chatsId}`)}>
        {members.map((item)=>(
            item._id == userId ? '': 
            <div key={item._id} className={`each-chat ${chatId == chatsId ? 'active-chat':''}`}>
                <Image src={isGroup? groupPhoto ||'/assets/group.png':item.avatar || '/assets/defaultImg.jpg'} alt="chat-pic" 
                    width={30}
                    height={30}
                    style={{borderRadius:'50%'}}
                />
                <div className='each-chat-right'>
                <p>{isGroup? name:item.fullName}</p>
                {chat? <p id={chat?.sender?._id !==userId && chat?.seenBy?.length <2?'unread':'read'}>{chat?.sender?._id === userId ?chat.text|| 'image sent':chat.text || 'image received'}</p>:(<p>start chat</p>)}
                </div>
            </div>
        ))}
    </div>
  )
}

export default ChatBox