import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database connected"));
        mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
        
        await mongoose.connect(`${process.env.MONGODB_URI}/lms`);
        console.log("Successfully connected to MongoDB");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process with failure code
    }
};

export default connectDB;