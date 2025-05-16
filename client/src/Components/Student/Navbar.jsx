import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../Context/AppContext";

const NavBar = () => {
  const isCourseListPage = location.pathname.includes("/courses-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();
  const {navigate, isEducator} = useContext(AppContext)

  return (
    <div
      className={`flex justify-between items-center px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${
        isCourseListPage ? "bg-whiite" : "bg-cyan-100/70"
      } `}
    >
      <h1 onClick={()=>{
        navigate('/')
        scrollTo(0,0)
      }} className="font-semi-bold w-28 lg:w-32 cursor-pointer">
        L M S by TANAY
      </h1>

      {/* <img
        src={assets.logo}
        alt="Logo"
        className="w-28 lg:w-32 cursor-pointer"
      /> */}
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
              <button onClick={() => {
                navigate("/educator");
                scrollTo(0, 0);
              }} >{isEducator ? 'Educator Dashboard': 'Become Educator'}</button>
              <Link to={"/my-enrollments"}> My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
          >
            Create Account
          </button>
        )}
      </div>
      {/* For Phone screens */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
                 <button onClick={() => {
                navigate("/educator");
                scrollTo(0, 0);
              }} >{isEducator ? 'Educator Dashboard': 'Become Educator'}</button>
              <Link to={"/my-enrollments"}> My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
