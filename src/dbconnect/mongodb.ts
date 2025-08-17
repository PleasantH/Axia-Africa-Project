import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const mongoUrl = process.env.MONGODB_URL;
        
        if (!mongoUrl) {
            throw new Error('MONGODB_URL is not defined in environment variables');
        }

        const conn = await mongoose.connect(mongoUrl, {});

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        
        // Exit process with failure
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
    console.error('Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

// Handle app termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (error) {
        console.error('Error during MongoDB disconnection:', error);
        process.exit(1);
    }
});

export default connectDB;