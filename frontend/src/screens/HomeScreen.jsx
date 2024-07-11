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
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: Number.MAX_SAFE_INTEGER
  });
  const { data, isLoading, error } = useGetProductsQuery({
    pageNumber,
    keyword,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
  });

  // Define price range options
  const priceRangeOptions = [
    { label: 'Price', value: { min: 0, max: Number.MAX_SAFE_INTEGER } },
    { label: 'Under $25', value: { min: 0, max: 25 } },
    { label: '$25 to $50', value: { min: 25, max: 50 } },
    { label: '$50 to $100', value: { min: 50, max: 100 } },
    { label: '$100 to $200', value: { min: 100, max: 200 } },
    { label: 'Over $200', value: { min: 200, max: Number.MAX_SAFE_INTEGER } },
  ];

  const handlePriceRangeChange = (selectedRange) => {
    setPriceRange(selectedRange);
  };

  return (
    <>
      {!keyword && <ProductCarousel />}
      <Row className="justify-content-center">
        <Col md={3} className="filters-section p-3 rounded">
          <Card className='py-2 pb-2 px-2'>
            <h5 className="fw-bold mb-4">Filters</h5>
            <Form>
              <Form.Select
                value={`${priceRange.min}-${priceRange.max}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-');
                  handlePriceRangeChange({ min: parseInt(min), max: parseInt(max) });
                }}
                aria-label="Price Range"
                className="mb-2"
              >
                {priceRangeOptions.map((option, index) => (
                  <option key={index} value={`${option.value.min}-${option.value.max}`}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form>
          </Card>
        </Col>
        <Col md={9} className="products-section">
          <h2 className='fw-semibold'>Latest Products</h2>
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
                    minPrice={priceRange.min}
                    maxPrice={priceRange.max}
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
