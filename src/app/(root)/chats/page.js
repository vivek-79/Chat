

import React from 'react'
import './chat.css'
import ChatList from '@/components/ChatList'
import Contacts from '@/components/Contacts'
function Chatpage() {
  return (
    <div className='chats-page'>
        <div className='chat-page-left'><ChatList/></div>
        <div className='mid-screen-left'>
          <h1>Have a nice day</h1>
          <h2>Start texting ...</h2>
        </div>
        <div className='chat-page-right'><Contacts/></div>
    </div>
  )
}

export default Chatpage