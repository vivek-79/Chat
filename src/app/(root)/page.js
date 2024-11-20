'use client'
import { useRouter } from 'next/navigation';
import React from 'react'
import { useSelector } from 'react-redux';
function Page() {
    const userId = useSelector((state)=>state.auth.userData)
    const router = useRouter();
    router.push('/chats')
  return (
    <div>page</div>
  )
}

export default Page