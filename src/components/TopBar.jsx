
'use client'
import React from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import './comps.css'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';


function TopBar() {
    const pathname = usePathname()
  return (
    <div className='top-bar'>
        <div className='top-bar-left'>
            <p>Connect</p>
        </div>
        <div className='top-bar-right'>
        <Link href='/chats'><p  className={`${pathname ==='/chats'? 'top-bar-active':''}`}>Chats</p></Link>
            <Link href='/contact'><p  className={`${pathname ==='/contact'? 'top-bar-active':''}`}>Contact</p></Link>
            <Link href='/'><LogoutIcon sx={{color:'gray'}}/></Link>
            <Link href='/profile'><div className='top-bar-profile'>
             <Image src="/assets/defaultImg.jpg" width={30} height={30} />
            </div></Link>
        </div>
    </div>
  )
}

export default TopBar