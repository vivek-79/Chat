
'use client'
import { PersonAddAlt1 } from '@mui/icons-material'
import React, { useState } from 'react'
import Image from 'next/image'

function ChatList() {

  const [showRequests,setShowRequests] = useState(false)
  const[requests,setRequests] =useState([])
  const userId = JSON.parse(localStorage.getItem('User'))._id
  const handleShowrequests = async()=>{
    setShowRequests(true)
    const res = await fetch(`http://localhost:3000/api/sendRequest?userId=${userId}`)
    const data= await res.json();
    console.log(data?.result[0]?.requests)
    setRequests(data?.result[0]?.requests)
  }

  const handleChoice = async(decision,requestedId)=>{
    console.log(decision,requestedId)

    const data ={
      userId,
      decision,
      requestedId
    }
    const res = await fetch(`http://localhost:3000/api/response`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(data)
    })

    const result=await res.json()
    console.log(result)
  }
  return (
    <div className='chat-list'>
      <input placeholder='Search...' />
      <div className='add-icon'>
        <PersonAddAlt1 onClick={handleShowrequests} />
      </div>
      {showRequests && <div className='requests'>
        <p onClick={()=>setShowRequests(false)}>x</p>
        {requests && requests.map((item)=>(
          <div className='each-request' key={item._id}>
            <Image src={item.avatar}
              height={30}
              width={30}
              style={{borderRadius:'50%'}}
            />
            <p>{item.userName}</p>
            <div className='each-req-btn'>
              <button onClick={()=>handleChoice('accept',item._id)}>Accept</button>
              <button onClick={()=>handleChoice('reject',item._id)}>Reject</button>
            </div>
          </div> 
        ))}
      </div> }
    </div>
  )
}

export default ChatList