import React from 'react'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <main className='flex flex-center items-center justify-center min-h-screen w-full bg-gradient-to-br from-black-900 via-gray-900 to-black'>
        {children}
    </main>
  )
}

export default Layout