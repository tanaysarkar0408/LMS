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
    event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)

}
  catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':{   
        console.log('Received payment_intent.succeeded event');
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        console.log('Payment Intent ID:', paymentIntentId);
        
        try {
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent : paymentIntentId
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
            
            res.status(200).json({ message: 'Payment processed successfully' });
            
        } catch (error) {
            console.error('Error processing payment:', error);
            res.status(500).json({ error: error.message });
        }
        break;
    }
      
    case 'payment_intent.payment_failed':{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent : paymentIntentId
    })

    const {purchaseId} = session.data[0].metadata;

    const purchaseData = await Purchase.findById(purchaseId)

    purchaseData.status = "failed"
    await purchaseData.save()

    break;
    }
    // ... handle other event types
    default:
        console.log(`Unhandled event type ${event.type}`);
      break;
  }

  // Return a response to acknowledge receipt of the event
  res.json({received: true});


}