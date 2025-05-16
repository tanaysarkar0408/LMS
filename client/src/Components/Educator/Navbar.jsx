import React from 'react'
import { dummyEducatorData } from '../../assets/assets'
import {UserButton, useUser} from '@clerk/clerk-react'

const Navbar = () => {

  const educatorData = dummyEducatorData;
  const {user} = useUser()

  return (
    <div>
      
    </div>
  )
}

export default Navbar