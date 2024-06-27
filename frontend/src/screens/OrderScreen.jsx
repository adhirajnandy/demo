import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Form, Button, Card } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetOrderDetailsQuery } from "../slices/ordersApiSlice";

import React from 'react'

const OrderScreen = () => {
    const {id: orderId} = useParams();

    const {data: order, refetch, isLoading, error} = useGetOrderDetailsQuery(orderId);
    
    return (
        isLoading ? (<Loader/> ) : error ? (<Message variant="danger"/>) : (
            <>
                <h1>Order: {order._id}</h1>
                <Row>
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name: </strong> { order.user.name }
                                </p>
                                <p>
                                    <strong>Email: </strong> { order.user.email }
                                </p>
                                <p>
                                    <strong>Address: </strong>{ order.shippingAddress.address }, {order.shippingAddress.city}{' '}{order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                </p>
                                { order.isDelivered ? (
                                    <Message variant="success">
                                        Delivered on {order.isDeliveredAt}
                                    </Message>
                                ) : (
                                    <Message variant="danger"> 
                                        Not Delivered
                                    </Message>
                                ) }
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method: </strong> { order.paymentMethod }  
                                </p>
                                { order.isPaid ? (
                                    <Message variant="success">
                                        Paid on {order.isPaidAt}
                                    </Message>
                                ) : (
                                    <Message variant="danger"> 
                                        Not Paid
                                    </Message>
                                ) }

                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded/>
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item.product}`}>
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} x &#8377; {item.price} = &#8377; {item.qty * item.price}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>Order Summary: </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items: </Col>
                                        <Col>&#8377; {order.itemsPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Shipping: </Col>
                                        <Col>&#8377; {order.shippingPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Tax: </Col>
                                        <Col>&#8377; {order.taxPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Total: </Col>
                                        <Col>&#8377; {order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {/* PAY ORDER PLACEHOLDER
                                MARK AS DELIVERED PLACE HOLDER */}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </>
        )

    )
}

export default OrderScreen