import React from 'react';
import { useParams } from 'react-router-dom';
import products from '../products';
import { Link } from 'react-router-dom';
import {Row, Col, Image, ListGroup, Card, Button, ListGroupItem} from 'react-bootstrap';
import Rating from '../components/Rating';

const ProductScreen = () => {
    const{id:productId}= useParams();
    const product = products.find((p) => p._id === productId);
    
  return (
    <>
        <Link className='btn btn-secondary my-3 text-white fw-semibold ' to='/'>
            Go Back
        </Link>

        <Row>
            <Col md={5}>
                <Image src={product.image} alt={product.name} fluid/>
            </Col>
            <Col md={4}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h3>{product.name}</h3>
                    </ListGroup.Item>
                    <ListGroup.Item style={{ fontSize: '1.5rem' }}>
                        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                    </ListGroup.Item>
                    <ListGroup.Item className='fw-bold h5'>
                        Price:  &#8377; {product.price}
                    </ListGroup.Item>
                    <ListGroup.Item className='fs-5'>
                        <span className='fw-medium'>Description:</span> {product.description}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
                
            <Col md={3}>
                <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <Row>
                                    <Col className='fw-medium'>Price: </Col>
                                    <Col>
                                        <div className='fw-bold'>&#8377;{product.price}</div>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col className='fw-medium'>Status: </Col>
                                    <Col>
                                        <div className=' fw-bold'>{product.countInStock >0 ? 'In Stock' : 'Out of Stock!'}</div>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button className='btn-block' type='button' disabled={product.countInStock === 0}>
                                    <span className='fw-medium'>Add to Cart</span>
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                </Card>
            </Col>

        </Row>
    </>
  )
}

export default ProductScreen