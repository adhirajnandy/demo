import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import products from './data/products.js';
const port = process.env.PORT || 5000;

const app = express();

app.get('/',(req,res) => {
    res.send('api is running');
});

app.get('/api/products', (req,res) => {

    //to fetch all the products from the products.js file

    res.json(products);
})

app.get('/api/products/:id',(req,res) => {

    // we are using find function to find a particular product as per the product id

    const product = products.find((p) => p._id === req.params.id);
    res.json(product);
})

app.listen(port, () => console.log(`Server running on ${port}`))