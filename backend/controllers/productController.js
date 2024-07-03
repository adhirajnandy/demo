import asyncHandler from "../middleware/asyncHandler.js";
import Product  from "../models/productModel.js";


// Fetching all products from the database 
const getProducts = asyncHandler(async (req,res) => {
    const pageSize = 4; //Limiting the number of products that are shown in the home page
    const page = Number(req.query.pageNumber) || 1; //fetching the page number from the query
    const count = await Product.countDocuments(); // To provide us the total number of Products
    const products = await Product.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1));
    res.json({products, page, pages: Math.ceil(count / pageSize)});//passing an object consisting of three things that is the products, page and the total number of pages that are required
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

// Delete a Product
// route - DELETE /api/products/:id
// access - Private/Admin

const deleteProduct = asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id);

    if(product) {
        await product.deleteOne({_id: product._id});
        res.status(200).json({message: 'Product Deleted'});
    }
    else{
        res.status(404);
        throw new Error('Resource not found');
    }
});

// Create a new revies
// route - POST /api/products/:id/reviews
// access - Private

const createProductReview = asyncHandler(async (req,res) => {

    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if(product) {
        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0)/ product.reviews.length;
        
        await product.save();
        res.status(201).json({ message: 'Review Added' });
    }
    else{
        res.status(404);
        throw new Error('Resource not found');
    }
});

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview };