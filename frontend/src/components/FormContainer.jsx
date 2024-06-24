import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai'; // Import icons for username and password fields

const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className='justify-content-md-center mt-5'>
        <Col xs={12} md={6}>
          <Card className='shadow-lg'>
            <Card.Body>
              {children}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default FormContainer;
