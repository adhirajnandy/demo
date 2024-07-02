import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';

const ProductEditScreen = () => {
    const { id: productId } = useParams();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);

    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();

    const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

    const navigate = useNavigate();

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);

    const submitHandler = async(e) => {
        e.preventDefault();
        try {
            await updateProduct({
              productId,
              name,
              price,
              image,
              brand,
              category,
              description,
              countInStock,
            }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
            toast.success('Product updated successfully');
            refetch();
            navigate('/admin/productlist');
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          }
    };

    const uploadFileHandler = async(e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return (
        <>
            <Link to="/admin/productlist" className='btn btn-secondary my-3 text-white fw-semibold'>
                Go Back
            </Link>

            <FormContainer>
                <h1 className='fw-semibold'>Edit Product Details: </h1>
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
                        <Form.Group controlId='price' className='my-2'>
                            <Form.Label className='fw-semibold'>Price:</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter price'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='image' className='my-2'>
                            <Form.Label className='fw-semibold'>Image:</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter image url'
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            ></Form.Control>
                            <Form.Control
                                type='file'
                                label='Choose file'
                                onChange={uploadFileHandler}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='brand' className='my-2'>
                            <Form.Label className='fw-semibold'>Brand:</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter brand'
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId='countInStock' className='my-2'>
                            <Form.Label className='fw-semibold'>Count In Stock:</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter stock count'
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId='category' className='my-2'>
                            <Form.Label className='fw-semibold'>Category:</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter category'
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId='description' className='my-2'>
                            <Form.Label className='fw-semibold'>Description:</Form.Label>
                            <Form.Control
                                as='textarea'  // Render as textarea for multiline input
                                rows={5}        // Number of visible rows
                                placeholder='Enter product description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
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

export default ProductEditScreen;
