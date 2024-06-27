import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';


const port = process.env.PORT || 5000;
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

//for making connection to MongoDB
connectDB();

const app = express();

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//These two lines of code allows us to get the body data that we send while user authorization 
//that is email and password that we send while authenticating the user

//cookie parser middleware
app.use(cookieParser());

app.get('/',(req,res) => {
    res.send('api is running');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) => res.send({clientId: process.env.PAYPAL_CLIENT_ID}) );

app.use(notFound);
app.use(errorHandler);


app.listen(port, () => console.log(`Server running on ${port}`))