import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets.js'
import {UserButton, useUser} from '@clerk/clerk-react'
import { useContext } from 'react'
import { AppContext } from '../../Context/AppContext'

const Navbar = () => {

  const educatorData = dummyEducatorData;
  const {user} = useUser()
  const {navigate} = useContext(AppContext)

  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      
       <h1 onClick={()=>{
        navigate('/')
        scrollTo(0,0)
      }} className="font-semi-bold w-28 lg:w-32 cursor-pointer">
        L M S by TANAY
      </h1>
      <div className='flex items-center gap-5 text-gray-500 relative'>
        <p>Hi! {user ? user.fullName : 'Developers'}</p>
        {user ? <UserButton /> : <img className='max-w-8' src={assets.profile_img} />}
      </div>
    </div>
  )
}

export default Navbar