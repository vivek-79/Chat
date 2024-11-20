

import React from 'react'
import { usePathname } from 'next/navigation';
import './comps.css'
import Link from 'next/link';
import LogoutIcon from '@mui/icons-material/Logout';

function BottomBar() {
    const pathname = usePathname()
  return (
    <div className='bottom-bar'>
        <Link href='/chats'><p  className={`${pathname ==='/chats'? 'top-bar-active':''}`}>Chats</p></Link>
            <Link href='/contact'><p  className={`${pathname ==='/contact'? 'top-bar-active':''}`}>Contact</p></Link>
            <Link href='/'><LogoutIcon sx={{color:'gray'}}/></Link>
    </div>
  )
}

export default BottomBar