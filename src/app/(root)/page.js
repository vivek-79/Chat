'use client'
import { useRouter } from 'next/navigation';
import React from 'react'
function Page() {
    const router = useRouter();
    router.push('/chats')
  return (
    <div>page</div>
  )
}

export default Page