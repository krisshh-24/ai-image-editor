import React from 'react'
import Sidebar from '../../components/shared/Sidebar'
import MobileNav from '@/components/shared/MobileNav'
import { SignedIn } from '@clerk/nextjs'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <main className='flex min-h-screen w-full flex-col bg-black lg:flex-row'>
      <SignedIn>
         <Sidebar></Sidebar>
      <MobileNav></MobileNav>
      </SignedIn>
     
       <div className='flex min-h-screen w-full flex-col lg:flex-row'>
        <div className='mt-16 flex-1 overflow-auto py-8 lg:mt-0 lg:max-h-screen lg:py-10'>
            {children}
        </div>
       </div>
    </main>
  )
}

export default Layout