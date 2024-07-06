import express from 'express';
import multer from 'multer';
import csvtojson from 'csvtojson';
import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js'; // Adjust the path based on your project structure

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

router.post('/', upload.single('csvFile'), asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const jsonArray = await csvtojson().fromFile(req.file.path);
        
        if (!jsonArray || jsonArray.length === 0) {
            return res.status(400).json({ error: 'CSV file is empty or invalid' });
        }

        // Map CSV data to match your schema fields
        const productsToInsert = jsonArray.map(item => ({
            user: item['User ID'], 
            name: item['Product Name'],
            image: item['Image URL'],
            brand: item['Brand'],
            category: item['Category'],
            description: item['Description'],
            reviews: [], 
            rating: parseFloat(item['Rating']), 
            numReviews: parseInt(item['Number of Reviews']), 
            price: parseFloat(item['Price']), 
            countInStock: parseInt(item['Count in Stock']), 
        }));

        const createdProducts = await Product.insertMany(productsToInsert);

        res.status(201).json({ message: `${createdProducts.length} products added` });
    } catch (err) {
        console.error('Error processing CSV:', err);
        res.status(500).json({ error: 'Failed to process CSV file' });
    }
}));

export default router;
