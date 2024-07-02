import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useGetProductsQuery, useCreateProductMutation } from '../../slices/productsApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';


const ProductListScreen = () => {

    const {data: products , isLoading, error, refetch} = useGetProductsQuery();

    const [createProduct, {isLoading: loadingCreate}] = useCreateProductMutation();

    const createProductHandler = async() => {
        if (window.confirm('Are you sure you want to create a new Product?')) {
            try {
                await createProduct();
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    }

    const deleteHandler = () => {
        console.log('delete');
    };


  return (
    <>
        <Row className='align-items-center'>
            <Col>
                <h1 className='fw-bolder'>Products</h1>
            </Col>
            <Col className='text-end'>
                <Button className='btn-sm m-3 fw-semibold' onClick={ createProductHandler }>
                    <FaEdit/> Create Product
                </Button>
            </Col>

        </Row>
        {loadingCreate && <Loader/>}
        {isLoading ? <Loader/> : error ? <Message variant='danger'>{error?.data?.message}</Message> : (
            <>
                <Table bordered hover responsive className=' table-sm custom-table'>
                    <thead>
                       <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>IN STOCK</th>
                            <th>BRAND</th>
                            <th></th>
                        </tr> 
                    </thead>
                    <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td className='fw-semibold'>{product._id}</td>
                                    <td className='fw-semibold'>{product.name}</td>
                                    <td className='fw-semibold'>{product.price}</td>
                                    <td className='fw-semibold'>{product.category}</td>
                                    <td className='fw-semibold'>{product.countInStock}</td>
                                    <td className='fw-semibold'>{product.brand}</td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant='primary' className='btn-sm mx-2'>
                                                <FaEdit/>
                                            </Button>
                                        </LinkContainer>
                                        <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                                            
                                            <FaTrash style={{color: 'wheat'}}/>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </>
        )}
    </>
  )
}

export default ProductListScreen