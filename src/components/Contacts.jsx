
'use client'
import React, { useEffect, useState } from 'react'
import Loader from './Loader'
function Contacts() {
    const [loading, setLoading] = useState(true)
    const [contact, setContact] = useState([])
    const [searched, setSearched] = useState([])
    const userId = JSON.parse(localStorage.getItem('User'))._id
    useEffect(() => {
        const getUser = async () => {
            try {
                const result = await fetch( searched ==''?`http://localhost:3000/api/recomend?userId=${userId}`:`http://localhost:3000/api/getSearch?searched=${searched}`)
                const data = await result.json()
                setContact(data.result)
                setLoading(false)
            } catch (error) {
                console.log(error.message)
            }
        }
        getUser();
    }, [searched])

    const handleRequest = async(dat)=>{
        const data={
            userId,
            requested:dat,
        };
        const res = await fetch(`http://localhost:3000/api/sendRequest`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })

        const result = await res.json();
        console.log(result)
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
                <button>Create group</button>
            </div>
        </div>
    )
}

export default Contacts