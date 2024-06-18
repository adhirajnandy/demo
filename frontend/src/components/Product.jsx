import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded product-card' style={{ 
      background: 'rgba(51, 51, 51, 0.8)', /* Adjust the alpha value to control transparency */
      color: '#ffffff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s ease-in-out'
    }}>
      <Link to={`/product/${product._id}`} className="text-decoration-none text-white">
        <Card.Img src={product.image} variant='top' className='product-image' />
        <Card.Body>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
          <Card.Text as='div' className='mb-2'>
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          </Card.Text>
          <Card.Text as='h3'>
            &#8377; {product.price}
          </Card.Text>
        </Card.Body>
      </Link>
    </Card>
  )
}

export default Product;
