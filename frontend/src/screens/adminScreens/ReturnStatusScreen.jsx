import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useApproveReturnMutation, useRejectReturnMutation } from '../../slices/ordersApiSlice';
import { useGetOrderDetailsQuery } from '../../slices/ordersApiSlice';
import { useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const ReturnStatusScreen = () => {
    const { id: orderId } = useParams();

    const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId);

    const [loadingApprove, setLoadingApprove] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);

    const [approveReturn] = useApproveReturnMutation(); // Hook for approving return
    const [rejectReturn] = useRejectReturnMutation(); // Hook for rejecting return

    const handleApprove = async () => {
        try {
            setLoadingApprove(true);
            await approveReturn(orderId);
            toast.success('Return Approved');
            refetch();
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setLoadingApprove(false);
        }
    };

    const handleReject = async () => {
        try {
            setLoadingReject(true);
            await rejectReturn(orderId);
            toast.success('Return Rejected');
            refetch();
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setLoadingReject(false);
        }
    };

    if (isLoading) {
        return <Loader />; // Show loading spinner while fetching data
    }

    if (error) {
        return <div>Error: {error.message}</div>; // Show error message if fetch fails
    }

    return (
        <div className="my-4">
            <h2 className="mb-4 fw-bolder">Return Status Update</h2>
            <Card>
                <Card.Body>
                    <Card.Title>
                        {/* <span className='mb-4'>Return Status: {order ? order.returnStatus : 'Loading...'}</span> */}
                        <Message>Remarks: {order.returnReason}</Message>
                    </Card.Title>

                    <Button
                        type='button'
                        variant='success'
                        disabled={order ? order.returnStatus !== 'pending' : true}
                        onClick={handleApprove}
                        className='me-2'
                    >
                        {loadingApprove ? 'Approving...' : 'Approve Return'}
                    </Button>
                    <Button
                        type='button'
                        variant='danger'
                        disabled={order ? order.returnStatus !== 'pending' : true}
                        onClick={handleReject}
                    >
                        {loadingReject ? 'Rejecting...' : 'Reject Return'}
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ReturnStatusScreen;
