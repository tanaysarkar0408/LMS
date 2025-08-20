import React from 'react'
import { assets } from '../../assets/assets.js'

const Footer = () => {
  return (
    <footer className='flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t'>
      <div className='flex items-center gap-4'>
        <h1 onClick={()=>{
        navigate('/')
        scrollTo(0,0)
      }} className="text-gray-900 text-xl font-semi-bold w-28 lg:w-36 cursor-pointer">LMS by TANAY</h1>
      <div className='hidden md:block h-7 w-px bg-gray-500/60'></div>
      <p className='py-4 text-center text-xs md:text-sm text-gray-800'>
      Copyright 2025 © TANAY SARKAR. All rights reserved.
    </p>
    </div>

    <div className='flex items-center gap-3 max-md:mt-4'>
      <a href="#">
        <img src={assets.facebook_icon} alt="Fb icon" />
      </a>
      <a href="#">
        <img src={assets.twitter_icon} alt="Twitter icon" />
      </a>
      <a href="#">
        <img src={assets.instagram_icon} alt="Insta icon" />
      </a>
    </div>
    </footer>
  )
}

export default Footer