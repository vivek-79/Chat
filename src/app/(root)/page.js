'use client'
import React from 'react'
import { useSelector } from 'react-redux';
function page() {
    const userId = useSelector((state)=>state.auth.userData)
    console.log(userId)
  return (
    <div>page</div>
  )
}

export default page