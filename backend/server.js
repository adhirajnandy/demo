import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';

const port = process.env.PORT || 5000;
import productRoutes from './routes/productRoutes.js'

//for making connection to MongoDB
connectDB();

const app = express();

app.get('/',(req,res) => {
    res.send('api is running');
});

app.use('/api/products', productRoutes);



app.listen(port, () => console.log(`Server running on ${port}`))