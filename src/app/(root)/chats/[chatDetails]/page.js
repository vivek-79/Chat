
'use client'
import ChatList from '@/components/ChatList'
import Loader from '@/components/Loader'
import React, { useEffect, useState } from 'react'
import '../chat.css'
import ChatDetail from '@/components/ChatDetail'

function Page({params}) {

  const chatId = params.chatDetails
  const [detail,setDetail] = useState()
  const [loading,setLoading]= useState(true)

  useEffect(()=>{

    const getChat = async()=>{

      const res = await fetch(`http://localhost:3000/api/chatDetails?chatId=${chatId}`)

      const result = await res.json()
      setDetail(result?.res)
      setLoading(false)
    }

    getChat();
  },[])
  return loading ? <Loader/>: (
    <div className='chats-detail'>
    <div className='chats-detail-left'><ChatList chatId={chatId}/></div>
    <div  className='chats-detail-right'> <ChatDetail detail={detail}/></div>
    <div className='small-screen'> <ChatDetail detail={detail}/></div>
</div>
  )
}

export default Page