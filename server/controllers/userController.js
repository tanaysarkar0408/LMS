import Stripe from "stripe";
import Course from "../models/Course.js";
import Purchase from "../models/purchase.js";
import User from "../models/user.js";
import { courseProgress } from "../models/CourseProgress.js";
import mongoose from 'mongoose';

export const getUserData = async (req,res) => {
    try {
        const userId = req.auth.userId;
        const user = await User.findById(userId);

        if(!user){
            return res.json({success : false,message : "User not found"})
        }


        res.json({success : true,user})
    } catch (error) {
        res.json({success : false,message : error.message})
    }
}

//User enrolled courses with lecure links

export const userEnrolledCourses = async (req,res) => {
    try {
        const userId = req.auth.userId;
        const userData = await User.findById(userId).populate("enrolledCourses")

        if(!userData){
            return res.json({success : false,message : "User not found"})
        }

        res.json({success : true,enrolledCourses : userData.enrolledCourses})
    } catch (error) {
        res.json({success : false,message : error.message})
    }
}

export const purchaseCourse = async (req,res) => {
    try {
        const {courseId} = req.body;
        const {origin} = req.headers;
        const userId = req.auth.userId;
        const userData = await User.findById(userId);

        const courseData = await Course.findById(courseId);

        if(!userData ||!courseData){
            console.log('User Data:', userData ? 'Found' : 'Not found');
            console.log('Course Data:', courseData ? 'Found' : 'Not found');
            return res.json({success : false,message : "Data not found"})
        }
        

        if (!courseData.coursePrice || typeof courseData.coursePrice !== 'number' || 
            !courseData.discount || typeof courseData.discount !== 'number' || 
            courseData.discount < 0 || courseData.discount > 100) {
            return res.json({success: false, message: "Invalid course price or discount values"});
        }

        const amount = Number(courseData.coursePrice - (courseData.discount * courseData.coursePrice / 100)).toFixed(2);
        
        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: Number(amount)  // Convert back to number for MongoDB
        };

        const newPurchase = await Purchase.create(purchaseData);

        //Stripe gateway initialize

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

        const currency = process.env.CURRENCY.toLowerCase(); 
        
        
        // Creating line items for stripe

        const line_items = [
            {
                price_data : {
                    currency,
                    product_data : {
                        name : courseData.courseTitle
                    },
                    unit_amount : Math.floor(Number(newPurchase.amount) * 100)  // Ensure we're using a number here
                },
                quantity : 1
            }
        ]

        const session = await stripeInstance.checkout.sessions.create({ 
            success_url : `${origin}/loading/my-enrollments`,
            cancel_url : `${origin}/`,
            line_items: line_items,
            mode : 'payment',
            metadata : {
                purchaseId : newPurchase._id.toString()
            }
            
        })

        res.json({success : true,sessionUrl : session.url})
            
    } catch (error) {
        res.json({success : false,message : error.message})
    }
}

//Update User course progress

export const updateUserCourseProgress = async (req,res)=>{
    try {
        const userId = req.auth.userId;
        const {courseId,lectureId} = req.body;

        const progressData = await courseProgress.findOne({userId,courseId});

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success : true,message : "Lecture already completed"})
            }

            progressData.lectureCompleted.push(lectureId);
            await progressData.save();
        }else{
            await courseProgress.create({
                userId,
                courseId,
                lectureCompleted : [lectureId]
            })
        }
        res.json({success : true,message : "Progress Updated"})
        
    } catch (error) {
        res.json({success : false,message : error.message})
    }
}

//Get user course progress

export const getUserCourseProgress = async (req,res)=>{
    try {
        const userId = req.auth.userId;
        const {courseId} = req.body;
        const progressData = await courseProgress.findOne({userId,courseId});
        res.json({success : true,progressData})
    } catch (error) {
        res.json({success : false,message : error.message})
    }
}

//Add user ratings to course

export const addUserRating = async (req,res)=>{

    const userId = req.auth.userId;
        const {courseId,rating} = req.body;

        if(!courseId || !userId || !rating || rating < 1 || rating > 5){
            return res.json({success : false,message : "Invalid Details"})
        }
    try {
        
        const course = await Course.findById(courseId);

        if(!course){
            return res.json({success : false,message : "Course not found"})
        }

        const user = await User.findById(userId);

        if(!user || !user.enrolledCourses.includes(courseId)){
            return res.json({success : false,message : "User has not enrolled in this course"})
        }

        const existingRatingIndex = course.courseRatings.findIndex((r)=>r.userId === userId);

        if(existingRatingIndex > -1){
            course.courseRatings[existingRatingIndex].rating = rating;
        }else{
            course.courseRatings.push({userId,rating})
        }

        await course.save();

        return res.json({success : true,message : "Rating added successfully"})
       
    } catch (error) {
        return res.json({success : false,message : error.message})
    }
}