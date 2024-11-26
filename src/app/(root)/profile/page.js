
'use client';
import React, { useEffect, useState } from 'react'
import './profile.css'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useForm } from 'react-hook-form';
import { CldUploadButton } from 'next-cloudinary';
import Loader from '@/components/Loader';
import { BASE_URL } from '@/utils/constants';
import { signIn, useSession } from 'next-auth/react';

function Profie() {

    const { register, handleSubmit, watch, setValue } = useForm()
    const [user,setUser] = useState()
    const [loader, setLoader] = useState(true)
    
    const session = useSession()
    const data = session?.data?.user
    useEffect(()=>{
        if(data){
            setUser(data)
            setLoader(false)
        }
    },[data,user])
    const uploadPhoto = async (result) => {
        setValue('profileImg', result?.info?.secure_url)
    }
    const updateProfile = async (data) => {
        if(!user) return null
        data.userId = user.id
        try {
            const post = await fetch(`${BASE_URL}/api/updateUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const result = await post.json()
            if (result) {
                data = '';
                setUser(result.updatedUser)
               await signIn('credentials',{redirect:false})

            }
        } catch (error) {
            console.log(error)
        }
    }
    return loader ? (
        <Loader />
    ) : (
        <main className='profile'>
            <div className='profile-content'>
                <h2 >Edit Profile</h2>
                <form className='profile-content'
                    onSubmit={handleSubmit(updateProfile)}
                >
                    <div className='profile-pic'>
                        <img
                            src={watch('profileImg') || user?.avatar || '/assets/defaultImg.jpg'} alt='profile image'
                        ></img>
                    </div>
                    <div className='change-pic'>
                        <CldUploadButton options={{ maxFiles: 1 }} onSuccess={uploadPhoto} uploadPreset='rxdfhyfi'>
                            <label htmlFor='image'>Change</label>
                        </CldUploadButton>
                    </div>
                    <div className='profile-user'>
                        <input
                            placeholder={user?.userName}
                            {...register('userName')}
                        />
                        <PersonOutlineIcon sx={{ color: 'gray' }} />
                    </div>
                    <div className='profile-user'>
                        <input
                            placeholder={user?.fullName}
                            {...register('fullName')}
                        />
                        <PersonOutlineIcon sx={{ color: 'gray' }} />
                    </div>
                    <div className='profile-user' id='button'>
                        <button type='submit'>Save Changes</button>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default Profie