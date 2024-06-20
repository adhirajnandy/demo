import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

const router = express.Router();


router.get('/', asyncHandler(async(req,res) => {

    //to fetch all the products from the products.js file
    const products = await Product.find({})
    res.json(products);
}));

router.get('/:id',asyncHandler(async(req,res) => {

    // we are using find function to find a particular product as per the product id
    // req params id will get the id from the URL
    const product = await Product.findById(req.params.id);

    if(product){
        return res.json(product);
    }

    res.status(404).json({message: 'Product not Found'});
}));



export default router;