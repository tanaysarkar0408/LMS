# LMS Student & Educator Frontend

## Overview
This is the frontend for a Learning Management System (LMS) built using **React**, **Tailwind CSS**, and **Vite**. It provides interfaces for both students and educators to interact with the platform. Students can access educational resources, view courses, and manage enrollments, while educators can create courses, manage their content, and view enrolled students. The project uses React Router for navigation and is styled with Tailwind CSS for a modern, responsive design.

## Features
- **Student Features**:
  - View and enroll in courses
  - Access course details and sections
  - Manage student enrollments
- **Educator Features**:
  - Create and add new courses
  - View and manage their own courses
  - Access a dashboard for educator-specific actions
  - View students enrolled in their courses
- **General Features**:
  - Responsive design with Tailwind CSS
  - Client-side routing with React Router

## Tech Stack
- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Fast frontend build tool
- **React Router**: For navigation and routing

## Prerequisites
Before setting up the project, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or Yarn
- Git

## Installation
1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd lms-student-frontend
   ```

2. **Install Dependencies**
   Using npm:
   ```bash
   npm install
   ```
   Or using Yarn:
   ```bash
   yarn install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Or with Yarn:
   ```bash
   yarn dev
   ```
   The app will be available at `http://localhost:5173` (or another port if specified).

## Project Structure
- **`/src`**: Main source directory
  - **`/assets`**: Static assets like images and fonts
  - **`/components`**: Reusable React components
    - `CallToAction.jsx`
    - `Companies.jsx`
    - `CourseCard.jsx`
    - `CourseSection.jsx`
    - `Footer.jsx`
    - `Hero.jsx`
    - `Loading.jsx`
    - `NavBar.jsx`
    - `Rating.jsx`
    - `SearchBar.jsx`
    - `TestimonialsSections.jsx`
  - **`/context`**: React context for state management
    - `AppContext.jsx`
  - **`/pages`**: Page components for routing
    - **`/educator`**: Educator-specific pages
      - `AddCourse.jsx`
      - `CourseDetails.jsx`
      - `CoursesList.jsx`
      - `Dashboard.jsx`
      - `Educator.jsx`
      - `Home.jsx`
      - `MyCourses.jsx`
      - `MyEnrollments.jsx`
      - `StudentsEnrolled.jsx`
    - **`/student`**: Student-specific pages
      - `CoursesList.jsx`
      - `Home.jsx`
      - `MyCourses.jsx`
      - `MyEnrollments.jsx`
  - `App.css`: Global styles
  - `App.jsx`: Main app component with routing setup
  - `index.css`: Tailwind CSS imports and base styles
  - `main.jsx`: Entry point for the React app

## Routing
The app uses React Router for navigation. Key routes include:
- `/`: Home page
- `/course-list`: List of available courses
- `/course/:id`: Course details page
- `/my-enrollments`: Student enrollments
- `/educator`: Educator dashboard
- `/educator/add-course`: Add a new course (educator)
- `/educator/dashboard`: Educator dashboard
- `/educator/students-enrolled`: View enrolled students (educator)
- `/my-courses`: Student's enrolled courses or educator's created courses
- `/student-enrolled`: List of enrolled students (educator)

## Usage
- **Student Interface**:
  - **Home Page**: Access the main landing page with a hero section and featured courses.
  - **Courses**: Browse and view course details, including sections and ratings.
  - **Enrollments**: Manage your enrollments and view enrolled courses.
- **Educator Interface**:
  - **Dashboard**: Access the educator dashboard for an overview.
  - **Add Course**: Create and publish new courses.
  - **My Courses**: View and manage courses you've created.
  - **Students Enrolled**: See the list of students enrolled in your courses.

## Available Scripts
- `npm run dev`: Start the development server
- `npm run build`: Build the app for production
- `npm run preview`: Preview the production build locally

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a pull request.

## License
This project is licensed under the MIT License.