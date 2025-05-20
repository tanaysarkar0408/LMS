import { Webhook } from "svix";
import User from "../models/user.js";
import Stripe from "stripe";
import Purchase from "../models/purchase.js";
import Course from "../models/Course.js";

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

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];
    const rawBody = request.body;
    
    // Check if webhook secret is configured
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error('Stripe webhook secret is not configured');
        return response.status(500).json({ error: 'Stripe webhook secret is not configured' });
    }
    
    try {
        // Verify the webhook signature
        const event = Stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        console.log('Received Stripe webhook event:', event.type);

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                console.log('Received payment_intent.succeeded event');
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;
                console.log('Payment Intent ID:', paymentIntentId);
                
                try {
                    const session = await stripeInstance.checkout.sessions.list({
                        payment_intent: paymentIntentId
                    });
                    console.log('Found sessions:', session.data.length);

                    const {purchaseId} = session.data[0].metadata;
                    console.log('Purchase ID from metadata:', purchaseId);
                    
                    const purchaseData = await Purchase.findById(purchaseId);
                    console.log('Found purchase data:', purchaseData);
                    
                    const userData = await User.findById(purchaseData.userId);
                    console.log('Found user data:', userData);
                    
                    const courseData = await Course.findById(purchaseData.courseId.toString());
                    console.log('Found course data:', courseData);
                    
                    courseData.enrolledStudents.push(userData);
                    console.log('Adding user to enrolled students');
                    await courseData.save();
                    console.log('Course data saved');
                    
                    userData.enrolledCourses.push(courseData._id);
                    console.log('Adding course to user enrolled courses');
                    await userData.save();
                    console.log('User data saved');

                    purchaseData.status = "completed";
                    console.log('Updating purchase status to completed');
                    await purchaseData.save();
                    console.log('Purchase data saved');
                    
                    response.status(200).json({ message: 'Payment processed successfully' });
                    
                } catch (error) {
                    console.error('Error processing payment:', error);
                    response.status(500).json({ error: error.message });
                }
                break;
            
            case 'payment_intent.payment_failed':
                console.log('Received payment_intent.payment_failed event');
                const failedPaymentIntent = event.data.object;
                const failedPaymentIntentId = failedPaymentIntent.id;

                try {
                    const session = await stripeInstance.checkout.sessions.list({
                        payment_intent: failedPaymentIntentId
                    });

                    const {purchaseId} = session.data[0].metadata;
                    const purchaseData = await Purchase.findById(purchaseId);

                    purchaseData.status = "failed";
                    await purchaseData.save();
                    
                    response.status(200).json({ message: 'Payment failed' });
                    
                } catch (error) {
                    console.error('Error handling failed payment:', error);
                    response.status(500).json({ error: error.message });
                }
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
                response.status(200).json({ message: 'Unhandled event type' });
                break;
        }
    } catch (err) {
        console.error('Error verifying webhook signature:', err);
        response.status(400).json({ error: 'Invalid webhook signature' });
    }
};