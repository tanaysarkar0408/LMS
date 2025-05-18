import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js';

// Initialize Express app
const app = express();

//connect to the mongodb database
await connectDB();

// Middleware
app.use(cors());

//  routes
app.get('/', (req, res) => {res.send("API Working")})
app.post('/clerk',express.json(), clerkWebhooks)


// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});