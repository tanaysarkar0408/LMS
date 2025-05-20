import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';

// Initialize Express app
const app = express()

//connect to the mongodb database
await connectDB()
await connectCloudinary()

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(clerkMiddleware())

// API routes
app.get('/', (req, res) => {res.send("API Working")})
app.post('/clerk', clerkWebhooks)
app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)    
app.use('/api/user', userRouter)
app.post('/stripe', express.raw({type : 'application/json'}), stripeWebhooks)

// Handle any other routes
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(400).json({ error: 'Bad Request' });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});