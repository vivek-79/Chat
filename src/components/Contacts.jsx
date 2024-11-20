
'use client'
import React, { useEffect, useState } from 'react'
import Loader from './Loader'
import { useRouter } from 'next/navigation'
import { BASE_URL } from '@/utils/constants'
function Contacts() {
    const [loading, setLoading] = useState(true)
    const [contact, setContact] = useState([])
    const [searched, setSearched] = useState([])
    const router = useRouter()
    const [userId, setUserId] = useState(null)
    useEffect(()=>{
        if (typeof window !== 'undefined') {
            const storedUser = JSON.parse(localStorage.getItem('User'));
            if (storedUser) {
              setUserId(storedUser?._id);
            }
          }
    },[])
    
    useEffect(() => {
        const getUser = async () => {
            try {
                const result = await fetch( searched ==''?`${BASE_URL}/api/recomend?userId=${userId}`:`http://${BASE_URL}/api/getSearch?searched=${searched}`)
                const data = await result.json()
                setContact(data.result)
                setLoading(false)
            } catch (error) {
                console.log(error.message)
            }
        }
        getUser();
    }, [searched,userId])

    const handleRequest = async(dat)=>{
        const data={
            userId,
            requested:dat,
        };
        const res = await fetch(`${BASE_URL}/api/sendRequest`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })

        const result = await res.json();
        if(result.success){
            alert('Request send')
        }
    }

    return loading ? <Loader /> : (
        <div className='create-chat-cont'>
            <input onInput={(e) => setSearched(e.target.value)} placeholder='Search people...' />
            <div className='contact-bar'>
                {contact && contact.map((item, ind) => (
                    <div className='each-user' key={item._id}>
                        <div className='each-user-avatar'><img src={item.avatar || '/assets/defaultImg.jpg'} alt="user-pic" /></div>
                        <div><p>{item.userName}</p></div>
                        <div className='each-user-btns'>
                            <button onClick={()=>handleRequest(item._id)}>Request</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className='create-group'>
                <button style={{cursor:'pointer'}} onClick={()=>router.push('/group')}>Create group</button>
            </div>
        </div>
    )
}

export default Contacts