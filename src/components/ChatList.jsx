
'use client'
import { PersonAddAlt1 } from '@mui/icons-material'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Loader from './Loader'
import ChatBox from './ChatBox'
import { pusherClient } from '@/lib/pusher'
import { useRouter } from 'next/navigation'
import { BASE_URL } from '@/utils/constants'
import { useSession } from 'next-auth/react'


function ChatList({ chatId }) {

  const [showRequests, setShowRequests] = useState(false)
  const [requests, setRequests] = useState([])
  const [contact, setContact] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const sesseion = useSession()
  const userId = sesseion?.data?.user.id
  const handleShowrequests = async () => {
    setShowRequests(true)
    const res = await fetch(`${BASE_URL}/api/sendRequest?userId=${userId}`)
    const data = await res.json();
    setRequests(data?.result[0]?.requests)
  }

  const handleChoice = async (decision, requestedId) => {
    setShowRequests(false)

    const data = {
      userId,
      decision,
      requestedId
    }
     await fetch(`${BASE_URL}/api/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }

  useEffect(() => {
    setLoading(true)
    const chatContact = async () => {
      const res = await fetch(`${BASE_URL}/api/chats?userId=${userId}`)
      const data = await res.json()
      setContact(data?.chat?.[0]?.chats || [])
      setLoading(false)
    }
    chatContact()
  }, [showRequests,userId])

  useEffect(() => {
    if (userId) {
      pusherClient.subscribe(userId)
      const handleChatUpdate = async (updatedChat) => {
        console.log(updatedChat)
        setContact((prevContact) => {
          return prevContact.map((contact) => {
            if (contact._id === updatedChat.id) {
              return {
                ...contact,
                messages: updatedChat.messages
                  ? [...contact.messages, updatedChat.messages[0]._id]
                  : contact.messages,
                lastMessage: updatedChat.messages?.[0] || contact.lastMessage,
              };
            }
            return contact;
          });
        });
      };
      pusherClient.bind("update-chat", handleChatUpdate)
      return () => {
        pusherClient.unbind('update-chat', handleChatUpdate);
        pusherClient.unsubscribe(userId);
      };

    }
  }, [userId])
  console.log(contact)
  return loading ? <Loader /> : (
    <div className='chat-list'>
      <input placeholder='Search...' />
      <div className="chat-list-contact">
        {[
  ...contact?.filter((item) => {
    return (
      !item.lastMessage?.[0] ||
      item.lastMessage[0].seenBy.some((user) => user._id === userId)
    );
  }),
  ...contact?.filter((item) => {
    return (
      item.lastMessage?.[0] &&
      !item.lastMessage[0].seenBy.some((user) => user._id === userId)
    );
  }),
].map((item) => (
          <ChatBox
            isGroup={item.isGroup}
            name={item.name || ''}
            groupPhoto={item.groupPhoto || ''}
            key={item._id}
            members={item.members}
            userId={userId}
            chatsId={item._id}
            chatId={chatId}
            messageId={item.messages[item.messages.length - 1]}
          />
        ))}
      </div>

      <div className={requests.length > 0 ? "add-icon" : "add-icon-req"}>
        <PersonAddAlt1 onClick={handleShowrequests} />
      </div>
      {showRequests && <div className='requests'>
        <p onClick={() => setShowRequests(false)}>x</p>
        {requests && requests.map((item) => (
          <div className='each-request' key={item._id}>
            <Image src={item.avatar || '/assets/defaultImg.jpg'}
              height={30}
              width={30}
              style={{ borderRadius: '50%' }}
            />
            <p>{item.userName}</p>
            <div className='each-req-btn'>
              <button onClick={() => handleChoice('accept', item._id)}>Accept</button>
              <button onClick={() => handleChoice('reject', item._id)}>Reject</button>
            </div>
          </div>
        ))}
      </div>}
    </div>
  )
}

export default ChatList