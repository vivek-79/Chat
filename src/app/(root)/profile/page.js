
'use client';
import React, { useEffect, useState } from 'react'
import './profile.css'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useForm } from 'react-hook-form';
import { CldUploadButton } from 'next-cloudinary';
import Loader from '@/components/Loader';

function Profie() {

    const { register, handleSubmit, watch, setValue } = useForm()
    const [img, setImg] = useState('')
    const [loader, setLoader] = useState(true)
    const [user, setUser] = useState(null)
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const storedUser = JSON.parse(localStorage.getItem('User'));
            if (storedUser) {
                setUser(storedUser);
            }
        }
        setLoader(false)
    }, [])
    const uploadPhoto = async (result) => {
        setValue('profileImg', result?.info?.secure_url)
        setImg(result?.info?.secure_url)
    }
    const updateProfile = async (data) => {
        if(!user) return null
        data.userId = user._id
        try {
            const post = await fetch('http://localhost:3000/api/updateUser', {
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
                if (isClient) {
                    localStorage.removeItem("User");
                    localStorage.setItem("User", JSON.stringify(result.updatedUser))
                }

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