import express, { Express } from 'express';
import dotenv from 'dotenv';
import { userRoutes } from './routers/userRouters';
import connectDB from './dbconnect/mongodb';
import { authRoutes } from './routers/authRouters';
import productRouter from './routers/productRouters';
import orderRouter from './routers/orderRouters';


// Load environment variables
dotenv.config();
connectDB(); // Connect to MongoDB

const app: Express = express();

// Middleware
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/', authRoutes);
app.use('/products', productRouter)
app.use('/orders', orderRouter);


// Port configuration
const PORT: number = parseInt(process.env.PORT || '3000');

// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});