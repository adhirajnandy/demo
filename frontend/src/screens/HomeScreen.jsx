import React, { useState } from 'react';
import { Row, Col, Form, Card } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ProductCarousel from '../components/ProductCarousel';
import Paginate from '../components/Paginate';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useParams } from 'react-router-dom';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const [priceRange, setPriceRange] = useState('');
  const { data, isLoading, error } = useGetProductsQuery({
    pageNumber,
    keyword,
    minPrice: priceRange ? parseInt(priceRange.split('-')[0]) : 0,
    maxPrice: priceRange ? parseInt(priceRange.split('-')[1]) : Number.MAX_SAFE_INTEGER,
  });

  // Define price range options
  const priceRangeOptions = [
    { label: 'Any Price', value: '' },
    { label: 'Under $25', value: '0-25' },
    { label: '$25 to $50', value: '25-50' },
    { label: '$50 to $100', value: '50-100' },
    { label: '$100 to $200', value: '100-200' },
    { label: 'Over $200', value: '200-1000000' },
  ];

  return (
    <>
      {!keyword && <ProductCarousel />}
      <Row className="justify-content-center">
        <Col md={3} className="filters-section p-3 rounded">
         <Card className=' py-2 pb-2 px-2'>

         <h5 className="fw-bold mb-4">Filters</h5>
          <Form>
            {priceRangeOptions.map((option, index) => (
              <Form.Check
                key={index}
                type="checkbox"
                id={`priceRange-${index}`}
                label={option.label}
                value={option.value}
                checked={priceRange === option.value}
                onChange={() => setPriceRange(option.value)}
                className="mb-2"
              />
            ))}
          </Form>
         </Card>
        </Col>
        <Col md={9} className="products-section">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <>
              <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {data.products.map((product) => (
                  <Col key={product._id}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              <Row className="justify-content-center mt-4">
                <Col xs="auto">
                  <Paginate
                    pages={data.pages}
                    page={data.page}
                    keyword={keyword || ''}
                    minPrice={priceRange ? parseInt(priceRange.split('-')[0]) : 0}
                    maxPrice={priceRange ? parseInt(priceRange.split('-')[1]) : Number.MAX_SAFE_INTEGER}
                  />
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default HomeScreen;
