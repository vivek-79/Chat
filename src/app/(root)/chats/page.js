

import React from 'react'
import './chat.css'
import ChatList from '@/components/ChatList'
import Contacts from '@/components/Contacts'
function page() {
  return (
    <div className='chats-page'>
        <div className='chat-page-left'><ChatList/></div>
        <div className='chat-page-right'><Contacts/></div>
    </div>
  )
}

export default page