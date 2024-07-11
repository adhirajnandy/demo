import React from 'react';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useState, useEffect } from 'react';
import { Table, Form, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { FaTimesCircle, FaCheckCircle } from 'react-icons/fa';

const ProfileScreen = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

    const { data: orders, isLoading, error } = useGetMyOrdersQuery();

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo, userInfo.name, userInfo.email]);

    const submitHandler  = async (e) => {
        e.preventDefault() ;
        if(password !== confirmPassword){
            toast.error('Password donot match');
        }
        else{
            try {
                const res = await updateProfile({_id:userInfo._id, name, email, password}).unwrap();
                dispatch(setCredentials(res));
                toast.success('Profile Updated');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    }

  return (
    <Row>
        <Col md={3}>
            <h2 className='fw-bolder'>User Profile</h2>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-2'>
                    <Form.Label className='fw-semibold'>Name</Form.Label>
                    <Form.Control
                        type='name'
                        placeholder='Enter name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='email' className='my-2'>
                    <Form.Label className='fw-semibold'>Email address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='password' className='my-2'>
                    <Form.Label className='fw-semibold'>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='confirmPassword' className='my-2'>
                    <Form.Label className='fw-semibold'>Confirm password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Confirm password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' className='my-2 fw-semibold'>Update</Button>
                {loadingUpdateProfile && <Loader/>}
            </Form>
        </Col>
        <Col md={9}>
            <h2 className='fw-bolder'>My Orders</h2>
            {isLoading ? <Loader /> : error ? (<Message variant='danger'>{error?.data.message || error.error}</Message>): (
                <Table striped bordered hover responsive className='table-sm custom-table'>  
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>CANCELLED</th>
                            <th>RETURN</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map ((order) => (
                            <tr key={order._id}>
                                <td className='fw-semibold'>{order._id}</td>
                                <td className='fw-semibold'>{order.createdAt.substring(0,10)}</td>
                                <td className='fw-semibold'>${order.totalPrice}</td>
                                <td >
                                    {order.isPaid ? (
                                        <FaCheckCircle style={{color: 'green'}}/>
                                    ) : (
                                        <FaTimesCircle style={{color: 'red'}}/>
                                    )}
                                </td>
                                <td>
                                    {order.isCancelled ? (
                                        <FaCheckCircle style={{color: 'green'}}/>
                                    ) : (
                                        <FaTimesCircle style={{color: 'red'}}/>
                                    )}
                                </td>
                                <td>
                                    {order.isReturned ? (
                                        <FaCheckCircle style={{color: 'green'}}/>
                                    ) : (
                                        <FaTimesCircle style={{color: 'red'}}/>
                                    )}
                                </td>
                                <td>
                                    {order.isDelivered ? (
                                        <FaCheckCircle style={{color: 'green'}}/>
                                    ) : (
                                        <FaTimesCircle style={{color: 'red'}}/>
                                    )}
                                </td>
                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button className='btn-sm fw-semibold' variant='primary'>
                                            Details
                                        </Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                
                </Table>
            )}
        </Col>
    </Row>
  )
}

export default ProfileScreen