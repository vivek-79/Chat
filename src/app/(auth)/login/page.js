


'use client'
import React, { useState } from 'react'
import '../register/register.css'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import MailIcon from '@mui/icons-material/Mail';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {signIn} from 'next-auth/react'

function Page() {

    const router = useRouter()
    const { register, handleSubmit } = useForm()
    const [error, seterror] = useState('')

    const handleRegister = async (data) => {
        seterror('')
        console.log(data)
        console.log('hii')
        try {
            const register = await signIn("credentials",{
                ...data,
                redirect:false
            })
            if(register.ok){
                router.push('chats')
            }
            else{
                seterror('Invalid Email or Password')
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
                        {...register('email',{
                            required: "Email is required",
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: "Please enter a valid email address",
                            },
                          })}
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