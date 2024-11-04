
'use client'
import axios from 'axios'
import React,{useEffect,useState} from 'react'

function VerifyEmail() {

    const [token,setToken] = useState('')
    const [error,setError] = useState('')

    useEffect(()=>{

        const gettoken = window.location.search;
        setToken(gettoken.split('=')[1])
    },[])

    useEffect(()=>{

      axios.post('http://localhost:3000/api/verifyemail',{token})
      .then((res)=>{
        console.log(res)
      })
      .catch((err)=>{
        console.log(err)
        setError(err.message)
      })
    },[token])
  return (
    <div>
      <h1>Get your email verified</h1>
      <h2>{error}</h2>
    </div>
  )
}

export default VerifyEmail