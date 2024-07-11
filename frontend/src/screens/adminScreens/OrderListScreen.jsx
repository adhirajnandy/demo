import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaTimesCircle, FaCheckCircle, FaDownload } from 'react-icons/fa';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify'; 
import axios from 'axios';


const OrderListScreen = () => {

  const {data : orders, isLoading, error} = useGetOrdersQuery();

  const downloadCsvHandler = async () => {
    try {
      const response = await axios.get(`/api/orders/export/csv`, {
        responseType: 'blob', // Set the response type to Blob
      });

      // Create a Blob object from the CSV data
      const blob = new Blob([response.data], { type: 'text/csv' });

      // Create a URL for the Blob object
      const url = window.URL.createObjectURL(blob);

      // Create an anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orders.csv'; // Set the file name for download
      document.body.appendChild(a);
      a.click(); // Programmatically click the anchor element to trigger the download
      document.body.removeChild(a); // Clean up: remove the anchor element from the document

      toast.success('Orders exported successfully.');
    } catch (err) {
      toast.error( 'Failed to export orders.');
    }
  };


  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1 className='fw-bolder'>Orders</h1>
        </Col>
        <Col className='text-end'>
          <Button className='btn-sm m-3 fw-semibold' onClick={downloadCsvHandler}>
              <FaDownload/> Export Orders
          </Button>
        </Col>

      </Row>
      
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
                <th>CANCELLATION STATUS</th>
                <th>RETURN INITIATED</th>
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
                    {order.isCancelled ? (
                    <FaCheckCircle style={{color:'green'}}/>
                  ) : (
                    <FaTimesCircle style={{color:'red'}}/>
                  )}
                  </td>
                  <td className='fw-semibold'>
                    {order.isReturned ? (
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