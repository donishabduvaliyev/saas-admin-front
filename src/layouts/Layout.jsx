import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className='flex'>
        <Sidebar />
        <main>
          <Outlet />
        </main>
      </div>


    </div>
  )
}

export default Layout