import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUpload } from 'react-icons/fa';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '../../slices/productsApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Paginate from '../../components/Paginate';
import { useUploadProductMutation } from '../../slices/productsApiSlice';

const ProductListScreen = () => {

    const {pageNumber} = useParams();

    const {data, isLoading, error, refetch} = useGetProductsQuery({pageNumber});

    const [createProduct, {isLoading: loadingCreate}] = useCreateProductMutation();

    const [deleteProduct, {isLoading: loadingDelete}] = useDeleteProductMutation();

    const [uploadProduct, {isLoading: loadingUpload}] = useUploadProductMutation();

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

    const deleteHandler = async(id) => {
        if(window.confirm('Are you sure, you want to delete?')){
            try {
                await deleteProduct(id);
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    };

    const uploadProductHandler = async(e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('csvFile', file);

        try {
            await uploadProduct(formData);
            refetch();
            toast.success('Product Uploaded');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to Upload Product')
        }
    }


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
        {loadingDelete && <Loader/>}
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
                            {data.products.map((product) => (
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
                <Row className='justify-content-center'>
                    <h3 className='fw-semibold' >Uplaod Products </h3>
                    <Form.Group controlId='csvFile' className='mb-5'>
                        <Form.Control type='file' label='Choose CSV' onChange={uploadProductHandler} />
                    </Form.Group>

                </Row>
                <Row className='justify-content-center'>
                    <Col xs='auto'>
                        <Paginate
                            pages={data.pages}
                            page={data.page}
                            isAdmin={true}
                        />
                    </Col>
                </Row>
            </>
        )}
    </>
  )
}

export default ProductListScreen