import Stripe from "stripe";
import Course from "../models/Course.js";
import Purchase from "../models/purchase.js";
import User from "../models/user.js";

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
                    unit_amount : Math.floor(Number(amount) * 100)  // Ensure we're using a number here
                },
                quantity : 1
            }
        ]

        const session = await stripeInstance.checkout.sessions.create({
            success_url : `${origin}/loading/my-enrollements`,
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