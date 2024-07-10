import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useReturnOrderMutation } from '../slices/ordersApiSlice';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const ReturnOrderScreen = () => {
    const [returnReason, setReturnReason] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { id: orderId } = useParams();
    const [returnOrder] = useReturnOrderMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await returnOrder({ orderId, data: { returnReason } });
            toast.success('Return Request Submitted');
            navigate('/order/:id');
            setReturnReason('');
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-4">
            <h2 className="mb-4 fw-bolder">Submit Return Request</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId='returnReason'>
                    <Form.Label>Reason for Return</Form.Label>
                    <Form.Control
                        as='textarea'
                        rows={3}
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button type='submit' variant='primary' disabled={!returnReason || loading} className='my-2'>
                    {loading ? 'Submitting...' : 'Submit'}
                </Button>
            </Form>
        </div>
    );
};

export default ReturnOrderScreen;
