import asyncHandler from "../middleware/asyncHandler.js";
import Product  from "../models/productModel.js";


// Fetching all products from the database 
const getProducts = asyncHandler(async (req,res) => {
    const products = await Product.find({});
    res.json(products);
});

//Fetching products by Id
const getProductById = asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id);

    if(product){
        return res.json(product);
    }else{
        res.status(404);
        throw new Error('Product Not Found');
    }
});

// Create a Product
// route - POST /api/products
// access - Private/Admin

const createProduct = asyncHandler(async (req,res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample Brand',
        category: 'sample',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample Description',
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// Update a Product
// route - PUT /api/products/:id
// access - Private/Admin

const updateProduct = asyncHandler(async (req,res) => {
    const {name, price, description, image, brand, category, countInStock} = req.body;
    const product = await Product.findById(req.params.id);

    if(product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    }
    else{
        res.status(404);
        throw new Error('Resource not found');
    }
});

export { getProducts, getProductById, createProduct, updateProduct};