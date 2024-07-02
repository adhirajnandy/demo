import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTrash, FaTimesCircle, FaEdit, FaCheck, FaCheckCircle } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';


const UserListScreen = () => {

  const {data : users, refetch, isLoading, error} = useGetUsersQuery();

  const [deleteUser , { isLoading : loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async(id) => {
    if(window.confirm('Are you sure, you want to delete the user')){
        try {
            await deleteUser(id);
            toast.success('User Deleted')
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }
  }


  return (
    <>
      <h1 className='fw-bolder'>Users</h1>
      {loadingDelete && <Loader/>}
      {isLoading ? <Loader /> : error ? <Message variant= 'danger'>{error?.data?.message}</Message> : 
        (
          <Table bordered hover responsive className='table-sm custom-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th></th>

              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className='fw-semibold'>{user._id}</td>
                  <td className='fw-semibold'>{user.name}</td>
                  <td className='fw-semibold'><a href={`mailto:${user.email}`}>{user.email}</a></td>
                  <td className='fw-semibold'>
                    {user.isAdmin ? (
                    <FaCheckCircle style={{color:'green'}}/>
                  ) : (
                    <FaTimesCircle style={{color:'red'}}/>
                  )}
                  </td >
                  <td className='fw-semibold'>
                    
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant='primary' className='fw-semibold btn-sm mx-2'>
                        <FaEdit/>
                      </Button>
                    </LinkContainer>
                    <Button
                        variant='danger'
                        className='btn-sm '
                        onClick={() => deleteHandler(user._id)}
                    >
                        <FaTrash style={{color: 'wheat'}}/>
                    </Button>
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

export default UserListScreen;