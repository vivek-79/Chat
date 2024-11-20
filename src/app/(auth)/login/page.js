


'use client'
import React, { useState } from 'react'
import '../register/register.css'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import MailIcon from '@mui/icons-material/Mail';
import LockOpenIcon from '@mui/icons-material/LockOpen';

function Page() {

    const router = useRouter()
    const { register, handleSubmit } = useForm()
    const [error, seterror] = useState('')

    const handleRegister = async (data) => {
        seterror('')
        try {
            const register = await fetch('http://localhost:3000/api/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            })

            const result = await register.json()
            if (!result.success) {
                seterror(result.message)
            }
            else {
                localStorage.setItem("User",JSON.stringify(result.loggedInUser));
                router.push('/chats')
               
            }
        } catch (error) {
            seterror(error.message)
        }
    }
    return (
        <div className='register'>
            <form className='register-form'
                onSubmit={handleSubmit(handleRegister)}
            >
                <div className='form-comp' id='header'>
                    <h2>Login</h2>
                </div>
                <div className='form-comp'>
                    <input type='text'
                    placeholder='Email'
                        required
                        {...register('email')}
                    />
                    <MailIcon sx={{color:'gray'}}/>
                </div>
                <div className='form-comp'>
                    <input type='password'
                    placeholder='Password'
                        required
                        {...register('password')}
                    />
                    <LockOpenIcon sx={{color:'gray'}}/>
                </div>
                {error && <p className='error'>{error}</p>}
                <div className='form-comp' id='button'>
                    <button type='submit'>Submit</button>
                </div>
                <p>Don&apos;t have account ?| <Link href='/register'>Signup</Link></p>
            </form>
        </div>
    )
}

export default Page