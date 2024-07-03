import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import Rating from '../components/Rating';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useState } from 'react';
import { addToCart } from '../slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProductScreen = () => {
  
  const { id: productId } = useParams(); 

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty,setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const {data: product, isLoading, refetch, error} = useGetProductDetailsQuery(productId);

  const [createReview, {isLoading: loadingProductReview}] = useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = () => {
    dispatch(addToCart({...product,qty}));
    navigate('/cart');
  }

  const submitHandler = async(e) => {
    e.preventDefault();
    
    try {
      await createReview({
        productId,
        rating,
        comment
      }).unwrap();
      refetch();
      toast.success('Review Submitted');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  return (
    <>
      <Link className='btn btn-secondary my-3 text-white fw-semibold' to='/'>
        Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
            {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row>
            <Col md={5}>
              <div className='product-image-container border rounded '>
                <Image src={product.image} alt={product.name} fluid className='product-image' />
              </div>
            </Col>
            <Col md={4}>
              <ListGroup variant='flush'>
                <ListGroup.Item className='border rounded'>
                  <h3 className='fw-bolder'>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item className='border rounded my-1'>
                  <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </ListGroup.Item>
                <ListGroup.Item className='fw-bold h5 border rounded'>
                  Price: $ {product.price}
                </ListGroup.Item>
                <ListGroup.Item className='border rounded'>
                  <div className="fw-bolder">Description:</div>
                  <div>{product.description}</div>
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card className='border rounded p-3'>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col className="fw-bolder">Price:</Col>
                      <Col>
                        <div className='fw-bold'>$ {product.price}</div>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col className="fw-bolder">Status:</Col>
                      <Col>
                        <div className={product.countInStock > 0 ? 'fw-bold text-success' : 'fw-bold text-danger'}>
                          {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                        </div>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col className="fw-bolder">
                          Qty: 
                        </Col>
                        <Col>
                          <Form.Control 
                            as='select'
                            value={qty}
                            onChange = {(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map((x) => (
                              <option key={x+1} value={x+1}>
                                {x+1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button className='btn-block' type='button' disabled={product.countInStock === 0} onClick= {addToCartHandler}>
                      <span className='fw-medium'>Add to Cart</span>
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className='review'>
            <Col md={6}>

                  <h2 className='fw-bolder rounded border-dark-subtle'>Reviews</h2>
                  {product.reviews.length === 0 && <Message>No Reviews</Message>}
                  <ListGroup variant='flush'>
                    {product.reviews.map(review => (
                      <ListGroup.Item key={review._id}>
                        <strong>{review.name}</strong>
                        <Rating value={review.rating} />
                        <p>{review.createdAt.substring(0,10)}</p>
                        <p>{review.comment}</p>
                      </ListGroup.Item>
                    ))}
                    <ListGroup.Item className='border-dark-subtle'>
                      <h2 className='rounded-2 fw-bolder border-dark-subtle'>Write a Customer Review</h2>

                      {loadingProductReview && <Loader/>}

                      {userInfo ? (
                        <Form onSubmit={ submitHandler } className='rounded '>
                          <Form.Group controlId='rating' className='my-2'>
                            <Form.Label>Rating: </Form.Label>
                            <Form.Control
                              as='select'
                              value={rating}
                              onChange={(e) => setRating(Number(e.target.value))}
                            >
                              <option value="">Select...</option>
                              <option value="1">1 - Poor</option>
                              <option value="2">2 - Fair</option>
                              <option value="3">3 - Good</option>
                              <option value="4">4 - Very Good</option>
                              <option value="5">5 - Excellent</option>

                            </Form.Control>
                          </Form.Group>
                          <Form.Group
                            controlId='comment'
                            className='my-2'
                          >
                              <Form.Label>Comment: </Form.Label>
                              <Form.Control
                                as='textarea'
                                row='3'
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                            <Button
                              disabled={loadingProductReview}
                              type='submit'
                              variant='primary'
                            >
                              Submit
                            </Button>
                        </Form>
                      ) : (
                        <Message>
                          Please <Link to='/login'>sign in</Link> to write a review{' '}
                        </Message>
                      )}
                    </ListGroup.Item>
                  </ListGroup>

            </Col>

          </Row>
        </>
      )}
      
    </>
  );
}

export default ProductScreen;
