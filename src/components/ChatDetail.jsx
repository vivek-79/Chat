
'use client'
import React, { useEffect, useState ,useRef} from 'react'
import Image from 'next/image'
import { AddPhotoAlternate } from '@mui/icons-material'
import SendIcon from '@mui/icons-material/Send';
import { useForm } from 'react-hook-form';
import Loader from './Loader';
import { pusherClient } from '@/lib/pusher';
import { BASE_URL } from '@/utils/constants';
function ChatDetail({ detail }) {
    const member = detail.members
    const { register, handleSubmit, reset } = useForm()
    const chatId = detail?._id
    const userId = JSON.parse(localStorage.getItem('User'))?._id
    const [chat, setChat] = useState([])
    const [loading,setLoading] = useState(true)
    const latestMessageRef = useRef(null);
    const fetchChatMessages = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/messages?chatId=${detail._id}`);
            const result = await res.json();
            console.log(result)
            if (result.success) {
                setChat(result.updatedChat.messages); // Assuming result contains updatedChat and its messages
            }
        } catch (error) {
            console.error('Error fetching chat messages:', error.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchChatMessages();
    }, [detail._id])



    const handleMessage = async (data) => {
        const pic= data?.target?.files?.[0]
        try {
            let photo;
            if(pic){
                const url = `https://api.cloudinary.com/v1_1/dqigib5my/image/upload`;
                const formData = new FormData();
                formData.append("file", pic);
                formData.append("upload_preset", "rxdfhyfi");
            
                try {
                    const response = await fetch(url, {
                        method: "POST",
                        body: formData
                    });
            
                    if (response.ok) {
                        const res = await response.json();
                        console.log("Uploaded successfully:", res);
                        photo = res?.secure_url
                    } else {
                        console.error("Upload failed:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error:", error.message);
                }
            }
            const message = {
                text: data.text || '',
                photo: photo || '',
                senderId: userId || '',
                chatId: detail._id
            }
            if(!message.text && !message.photo){
                return null
            }
            const res = await fetch(`${BASE_URL}/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            })
            const result = await res.json()
            if (result.success) {
                reset()
            }
        } catch (error) {
            console.error("Error creating message:", error.message);
        }
    }
    useEffect(()=>{
        
    const seenBy = async()=>{

        const data = {
            chatId: detail._id,
            userId:userId
        }
        const res = await fetch (`${BASE_URL}/api/chatDetails`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(data)
        })
    }

    seenBy();
    },[chat])

    useEffect(()=>{
        pusherClient.subscribe(chatId)

        const handlePuser = async(updatedChat)=>{
            setChat((prevChat)=>[...prevChat,updatedChat])
        }
        pusherClient.bind("new-message",handlePuser)
        return () => {
            pusherClient.unbind('new-message',handlePuser);
            pusherClient.unsubscribe(chatId);
          };
    },[chatId])

    useEffect(() => {
        if (latestMessageRef.current) {
            latestMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chat]);
    console.log(chat)
    return loading ? <Loader/> : (
        <div className='chat-detail'>
            {detail.isGroup ? <div className='chat-detail-header'>
                    <Image src={detail.groupPhoto || '/assets/group.png'}
                        width={40}
                        height={40}
                        style={{ borderRadius: '50%' }}
                    />
                    <p>{detail.name}</p>
                </div>:
                member.map((item)=>(
                    item._id === userId ? null :
                    <div className='chat-detail-header' key={item._id}>
                    <Image src={item.avatar || '/assets/defaultImg.jpg'}
                        width={40}
                        height={40}
                        style={{ borderRadius: '50%' }}
                    />
                    <p>{item.fullName}</p>
                </div>
                ))
            }
            <div className='chat-detail-body'>

                {chat && chat.map((item, indx) => (
                    item.sender._id== userId || item.sender== userId?<div className= {item.text ? 'own-message':'own-message-pic'} key={item._id}>
                    {item.text ? <p>{item.text}</p> : <img src={item.photo} alt='chat-pic'/>}
                    <p className='time'>{new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                    })} {item.seenBy.length>1 && <span>✓</span>}</p>
                    </div>: <div className= {item.text ? 'Others-message':'Others-message-pic'} key={indx}>
                    {detail.isGroup && <Image id='chat-pic' src={item?.sender?.avatar || '/assets/defaultImg.jpg'} width={30} height={30} style={{borderRadius:'50%'}} alt='chat-pic'/>}
                    {item.text ? <p className='Others-message-p1'>{detail.isGroup && <span>{item?.sender?.fullName}</span>}{item.text}</p> : <img src={item.photo} alt='chat-pic'/>}
                        <p className='time'>{new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false
                        })} </p>
                    </div>
                ))}
                <div className='chat-body-lower' ref={latestMessageRef}></div>
            </div>
            <div className='chat-detail-foot'>
                <form onSubmit={handleSubmit(handleMessage)}>
                    <label htmlFor="pic"><AddPhotoAlternate /></label>
                    <input id='pic' type='file' onInput={(e)=>handleMessage(e)} />

                    <input type="text" placeholder='Write message ...' {...register('text')} />
                    <button type='submit'><SendIcon /></button>
                </form>
            </div>
        </div>
    )
}

export default ChatDetail