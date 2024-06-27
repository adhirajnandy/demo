import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery } from "../slices/ordersApiSlice";
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const OrderScreen = () => {
    const { id: orderId } = useParams();

    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery();
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'USD',
                    }
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            }
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPayPalScript();
                }
            }
        }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

    const onApprove = (data, actions) => {
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({ orderId, details });
                refetch();
                toast.success('Payment Successful')
            } catch (err) {
                toast.error(err?.data?.message || err.message);
            }
        });
    }

    const onError = (err) => {
        toast.error(err.message);
    }

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice,
                    },
                },
            ],
        }).then((orderId) => {
            return orderId;
        });
    }

    return (
        isLoading ? (<Loader />) : error ? (<Message variant="danger" />) : (
            <>
                <h1 className="mb-4 fw-bolder">Order: {order._id}</h1>
                <Row>
                    <Col md={8}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2 className="fw-bolder">Shipping</h2>
                                    <p><strong>Name:</strong> {order.user.name}</p>
                                    <p><strong>Email:</strong> {order.user.email}</p>
                                    <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                                    {order.isDelivered ? (
                                        <Message variant="success">Delivered on {order.isDeliveredAt}</Message>
                                    ) : (
                                        <Message variant="danger">Not Delivered</Message>
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h2 className="fw-bolder">Payment Method</h2>
                                    <p><strong>Method:</strong> {order.paymentMethod}</p>
                                    {order.isPaid ? (
                                        <Message variant="success">Paid on {order.paidAt}</Message>
                                    ) : (
                                        <Message variant="danger">Not Paid</Message>
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h2 className="fw-bolder">Order Items</h2>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index} rounded>
                                            <Row className="align-items-center">
                                                <Col xs={3} md={2}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col xs={5} md={4}>
                                                    {item.qty} x ${item.price} = ${item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2 className="fw-bolder">Order Summary</h2>
                                    <Row>
                                        <Col className="fw-bolder">Items:</Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col className="fw-bolder">Shipping:</Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col className="fw-bolder">Tax:</Col>
                                        <Col>${order.taxPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col className="fw-bolder">Total:</Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPay || isPending ? <Loader /> : (
                                            <PayPalButtons
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onError={onError}
                                            />
                                        )}
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </>
        )
    )
}

export default OrderScreen;
