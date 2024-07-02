import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Tab } from 'react-bootstrap';
import { FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';


const OrderListScreen = () => {

  const {data : orders, isLoading, error} = useGetOrdersQuery();


  return (
    <>
      <h1 className='fw-bolder'>Orders</h1>
      {isLoading ? <Loader /> : error ? <Message variant= 'danger'>{error?.data?.message}</Message> : 
        (
          <Table bordered hover responsive className='table-sm custom-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ORDER DETAILS</th>

              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className='fw-semibold'>{order._id}</td>
                  <td className='fw-semibold'>{order.user && order.user.name}</td>
                  <td className='fw-semibold'>{order.createdAt.substring(0,10)}</td>
                  <td className='fw-semibold'>${order.totalPrice}</td>
                  <td className='fw-semibold'>
                    {order.isPaid ? (
                    <FaCheckCircle style={{color:'green'}}/>
                  ) : (
                    <FaTimesCircle style={{color:'red'}}/>
                  )}
                  </td >
                  <td className='fw-semibold'>
                    {order.isDelivered ? (
                    <FaCheckCircle style={{color:'green'}}/>
                  ) : (
                    <FaTimesCircle style={{color:'red'}}/>
                  )}
                  </td>
                  <td className='fw-semibold'>
                    
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant='primary' className='fw-semibold'>Details</Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )
      }
    </>
  )
}

export default OrderListScreen;