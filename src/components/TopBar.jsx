
'use client'
import React, { useState } from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import './comps.css'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';


function TopBar() {
    const pathname = usePathname()
  const[user,setUser] = useState()
    useEffect(() => {
      if (typeof window !== 'undefined') {
          setIsClient(true);
          const storedUser = JSON.parse(localStorage.getItem('User'));
          if (storedUser) {
              setUser(storedUser);
          }
      }
  }, [])
    const handleLogout =()=>{
      localStorage.removeItem("User")
    }
  return (
    <div className='top-bar'>
        <div className='top-bar-left'>
            <p>Connect</p>
        </div>
        <div className='top-bar-right'>
        <Link href='/chats'><p  className={`${pathname ==='/chats'? 'top-bar-active':''}`}>Chats</p></Link>
            <Link href='/contact'><p  className={`${pathname ==='/contact'? 'top-bar-active':''}`}>Contact</p></Link>
            <Link href='/' onClick={handleLogout}><LogoutIcon sx={{color:'gray'}}/></Link>
            <Link href='/profile'><div className='top-bar-profile'>
             <Image src={user?.avatar ||"/assets/defaultImg.jpg"} width={30} height={30} />
            </div></Link>
        </div>
    </div>
  )
}

export default TopBar