import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';

const UserEditScreen = () => {
    const { id: userId } = useParams();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const { data: user, isLoading, refetch, error } = useGetUserDetailsQuery(userId);

    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    }, [user]);

    const submitHandler = async(e) => {
        try {
            await updateUser({userId, name, email, isAdmin});
            toast.success('User updated successfully');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <Link to="/admin/userlist" className='btn btn-secondary my-3 text-white fw-semibold'>
                Go Back
            </Link>

            <FormContainer>
                <h1 className='fw-semibold'>Edit User Details: </h1>
                {loadingUpdate && <Loader />}
                {isLoading ? (<Loader />) : error ? (<Message variant='danger'>{error?.data?.message}</Message>) : (
                    <Form onSubmit={ submitHandler }>
                        <Form.Group controlId='name' className='my-2'>
                            <Form.Label className='fw-semibold'>Name:</Form.Label>
                            <Form.Control
                                type='name'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId='email' className='my-2'>
                            <Form.Label className='fw-semibold'>Email:</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId='isAdmin' className='my-2'>

                            <Form.Check
                                type='checkbox'
                                label='Is Admin?'
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            ></Form.Check>

                        </Form.Group>
                        <Button
                            type='submit'
                            variant='primary'
                            className='my-2'
                        >
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    );
};

export default UserEditScreen;
