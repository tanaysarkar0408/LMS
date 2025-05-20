import {clerkClient } from "@clerk/express"
import Course from "../models/course.js";
import cloudinary from "../configs/cloudinary.js";
import Purchase from "../models/purchase.js";

// API controller function to update role to educator
export const updateRoleToEducator = async (req,res) => { 
try {
    const userId = req.auth.userId;
    
    await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata :{
            role : "educator",
        }
    })

    res.json({
        success : true,
        message : "You can publish a course now"
    })
} catch (error) {
    res.json({
        success : false,
        message : error.message
    })
}
}

// API controller function to add course
export const addCourse = async (req,res) => {
    try {
        const {courseData} = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if (!imageFile || !imageFile.path) {
            return res.json({
                success: false,
                message: "No valid image file provided"
            });
        }
        
        const parsedCourseData =await JSON.parse(courseData);
        parsedCourseData.educator = educatorId;
        const newCourse = await Course.create(parsedCourseData);
        
        try {
            const imageUpload = await cloudinary.v2.uploader.upload(imageFile.path);
            newCourse.courseThumbnail = imageUpload.secure_url;
            await newCourse.save();
        } catch (uploadError) {
            console.error("Cloudinary upload error:", uploadError);
            // Continue without thumbnail if upload fails
        }

        res.json({success : true,message : "Course added successfully"})
        
    } catch (error) {
        res.json({success : false,message : error.message})
    }
}


// Get educator courses
export const getEducatorCourses = async (req,res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator});
        res.json({success : true,courses})
    } catch (error) {
        res.json({success : false,message : error.message})
    }
}

//Get Educator dashboard data (Total earnings, total students,total courses)

export const educatorDashboardData = async (req,res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator});
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);
        const purchases = await Purchase.find({courseId : {$in : courseIds},status : "completed"});
        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        const enrolledStudentsData = [];
        for(const course of courses){
            const students = await User.find({
                _id : {$in : course.enrolledStudents}
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle : course.courseTitle,
                    student
                })
            })
        }
        
        res.json({success : true,dashboardData : {
            totalEarnings,
            enrolledStudentsData,
            totalCourses
        }})  
    } catch (error) {
        res.json({success : false,message : error.message})
    }
}


// Get Enrolled students data with purchase data

export const getEnrolledStudentsData = async (req,res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator});
        const courseIds = courses.map(course => course._id);
        const purchases = await Purchase.find({
            courseId : {$in : courseIds},
            status : "completed"}).populate("userId","name imageUrl").populate('courseId','courseTitle');
        const enrolledStudentsData = purchases.map(purchase => ({
            student : purchase.userId,
            courseTitle : purchase.courseId.courseTitle,
            purchaseDate : purchase.createdAt
        }));
        res.json({success : true,courses})


    } catch (error) {
        res.json({success : false,message : error.message})
    }
}


