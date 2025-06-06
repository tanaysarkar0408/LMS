import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './Pages/Student/Home.jsx'
import CoursesList from './Pages/Student/CoursesList.jsx'
import CourseDetails from './Pages/Student/CourseDetails.jsx'
import MyEnrollments from './Pages/Student/MyEnrollments.jsx'
import Player from './Pages/Student/Player.jsx'
import Loading from './Components/Student/Loading.jsx'
import Educator from './Pages/educator/Educator.jsx'
import Dashboard from './Pages/educator/Dashboard.jsx'
import AddCouse from './Pages/educator/AddCouse.jsx'
import MyCourses from './Pages/educator/MyCourses.jsx'
import StudentsEnrolled from './Pages/educator/StudentsEnrolled.jsx'
import NavBar from './Components/Student/NavBar.jsx'
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";

const App = () => {

  const isEducatorRoute = useMatch('/educator/*')

  return (
    <div className='text-default min-h-screen bg-white'>
       <ToastContainer />
      {!isEducatorRoute && <NavBar />}
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/course-list' element={<CoursesList />} />
        <Route path='/course-list/:input' element={<CoursesList />} />
        <Route path='/course/:id' element={<CourseDetails />} />
        <Route path='/my-enrollments' element={<MyEnrollments />} />
        <Route path='/player/:courseId' element={<Player />} />
        <Route path='/loading/:path' element={<Loading />} />


        <Route path='/educator' element={<Educator />}>
          <Route path='/educator' element={<Dashboard/>}/>
          <Route path='add-course' element={<AddCouse />}/>
          <Route path='my-courses' element={<MyCourses />}/>
          <Route path='student-enrolled' element={<StudentsEnrolled/>}/>

        </Route>
      </Routes>
    </div>
  )
}

export default App