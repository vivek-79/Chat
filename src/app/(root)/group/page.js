
'use client'
import React, { useEffect, useState } from 'react'
import './group.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
function Page() {

    const [friend, setFriend] = useState([])
    const [groupName, setGroupName] = useState('')
    const [groupPic,setGroupPic] = useState('')
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const [newGroup,setNewGroup] = useState([])
    const router = useRouter()
    const [userId, setUserId] = useState(null)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsClient(true);
            const storedUser = JSON.parse(localStorage.getItem('User'));
            if (storedUser) {
                setUserId(storedUser._id);
            }
        }
    }, [])
    useEffect(() => {
        const getUser = async () => {
            const res = await fetch(`http://localhost:3000/api/getUser?userId=${userId}`)
            const result = await res.json();
            setFriend(result?.user?.[0]?.friends)
        }
        getUser();
    }, [userId])

    const handleAdd = (data) => {
        if (!newGroup.includes(data)) {
            setNewGroup((prev)=>[...prev,data])
        }
        else {
            setNewGroup((prev)=>prev.filter((item)=>
                item !==data
            ))
        }
    }

    const handleImg = async (e) => {

        const file = e.target.files[0]

        if (file) {
            setLoading(true)
            const url = `https://api.cloudinary.com/v1_1/dqigib5my/image/upload`;
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "rxdfhyfi");

            try {
                const response = await fetch(url, {
                    method: "POST",
                    body: formData
                });

                if (response.ok) {
                    const res = await response.json();
                    console.log("Uploaded successfully:", res);
                    setGroupPic(res?.secure_url)
                } else {
                    setError(response.statusText);
                }
            } catch (error) {
                setError( "Failed retry");
            }
        }
        setLoading(false)

    }

    const handleCreate = async()=>{
        if(newGroup.length<2){
            setError('Group atlest contain 3 members')
            return null
        }
        const data ={
            newGroup,
            groupName,
            groupPic,
            userId
        }
        try {
            setLoading(true)
            const res = await fetch(`http://localhost:3000/api/getUser`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            })
            const result = await res.json();
            if(result.success){
                router.push('/chats')
            }
            else{
                setError(result.message)
            }
        } catch (error) {
            setError(error.message)
        }
        setLoading(false)
    }
    return (
        <div className='group'>
            <div className='group-left'>
                <h3>Select</h3>
                {friend && friend.map((item) => (
                    <li key={item._id}>
                        <input type='checkbox' onChange={() => handleAdd(item._id)}></input>
                        <Image src={item.avatar || '/assets/defaultImg.jpg'} width={35} height={35} style={{ borderRadius: '50%' }} alt='group-pic'/>
                        <p>{item.fullName}</p>
                    </li>
                ))}
            </div>
            <div className='group-right'>
                <Image src={groupPic || '/assets/group.png'} height={150} width={150} style={{ borderRadius: '50%', border: '1px solid white' }} alt='group-pic' />
                {loading && <p className='upload'> Uploading...</p>}
                <p className='error'>{error}</p>
                <div className='files'>
                    <label htmlFor="imag">Add Image</label>
                    <input id="imag" type='file' onInput={(e) => handleImg(e)} />
                </div>
                <input type='text' placeholder='Group name' onInput={(e) => setGroupName(e.target.value)}></input>
                <button onClick={()=>handleCreate()}>Create Group</button>
            </div>
        </div>
    )
}

export default Page