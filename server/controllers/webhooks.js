import { Webhook } from "svix";
import User from "../models/user.js";
import Stripe from "stripe";
import Purchase from "../models/purchase.js";
import Course from "../models/course.js";

// API controller function to manage clerk user with database

export const clerkWebhooks = async (req,res)=>{
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body),{
            "svix-id" :req.headers['svix-id'],
        "svix-timestamp": req.headers['svix-timestamp'],
        "svix-signature": req.headers['svix-signature']
        })
        const {data,type} = req.body;

        switch (type) {
            case 'user.created':{
                const userData =  {
                    _id:data.id,
                    email : data.email_addresses[0].email_address,
                    name : data.first_name + " " + data.last_name,
                    imageUrl : data.image_url,
                }
                
                const user = await User.create(userData);
                console.log('User created:', user);
                res.json({ message: 'User created successfully', user })
                break;
            }

            case 'user.updated':{
                const userData =  {
                    email : data.email_addresses[0].email_address,
                    name : data.first_name + " " + data.last_name,
                    imageUrl : data.image_url,
                }
                
                const user = await User.findByIdAndUpdate(
                    data.id,
                    userData,
                    { new: true }
                );
                console.log('User updated:', user);
                res.json({ message: 'User updated successfully', user })
                break;
            }

            case 'user.deleted':{
                await User.findByIdAndDelete(data.id);
                res.json({message : "User deleted successfully"})
                break;
            }   


            default:
                break;
        }
        
    } catch (error) {
        res.json({
            success : false,
            message : error.message})
    }
    
}
 
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
export const stripeWebhooks = async (req,res)=>{
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log('Received Stripe webhook event:', event.type);
    } catch (err) {
        console.error('Webhook Error:', err);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            const { metadata } = session;
            
            console.log('Checkout session completed:', {
                sessionId: session.id,
                metadata: metadata,
                amount_total: session.amount_total,
                status: session.status
            });

            if (!metadata || !metadata.purchaseId) {
                console.error('Missing purchaseId in metadata');
                res.json({ received: true });
                return;
            }

            try {
                const purchaseId = metadata.purchaseId;
                const purchaseData = await Purchase.findById(purchaseId);

                if (!purchaseData) {
                    console.error('Purchase not found:', purchaseId);
                    res.json({ received: true });
                    return;
                }

                const userData = await User.findById(purchaseData.userId);
                const courseData = await Course.findById(purchaseData.courseId.toString());

                if (!userData || !courseData) {
                    console.error('User or Course not found');
                    res.json({ received: true });
                    return;
                }

                // Update course and user
                courseData.enrolledStudents.push(userData._id);
                await courseData.save();

                userData.enrolledCourses.push(courseData._id);
                await userData.save();

                // Update purchase status
                purchaseData.status = "completed";
                await purchaseData.save();

                console.log('Purchase completed successfully:', {
                    purchaseId,
                    courseId: purchaseData.courseId,
                    userId: purchaseData.userId
                });

                res.json({ received: true });
                return;
            } catch (error) {
                console.error('Error processing checkout session:', error);
                res.json({ received: true });
                return;
            }
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            console.log('Payment failed:', {
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status
            });

            try {
                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                });

                const { metadata } = session.data[0];
                if (!metadata || !metadata.purchaseId) {
                    console.error('Missing purchaseId in metadata');
                    res.json({ received: true });
                    return;
                }

                const purchaseData = await Purchase.findById(metadata.purchaseId);
                if (!purchaseData) {
                    console.error('Purchase not found');
                    res.json({ received: true });
                    return;
                }

                purchaseData.status = "failed";
                await purchaseData.save();

                console.log('Payment failed updated:', {
                    purchaseId: metadata.purchaseId,
                    paymentIntentId: paymentIntent.id
                });

                res.json({ received: true });
                return;
            } catch (error) {
                console.error('Error processing payment failed:', error);
                res.json({ received: true });
                return;
            }
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
            res.json({ received: true });
            return;
    }
}