import React from 'react'
import {Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

const CheckoutSteps = ({step1, step2, step3, step4}) => {
  return (
        <Nav className='justify-content-center mb-4'>
            <Nav.Item>
                {step1 ? (
                    <LinkContainer to='/login'>
                        <Nav.Link className='nav-link-custom'>Sign In</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled className='nav-link-disabled'>Sign In</Nav.Link>
                )}
            </Nav.Item>
            <Nav.Item>
                {step2 ? (
                    <LinkContainer to='/shipping'>
                        <Nav.Link className='nav-link-custom'>Shipping</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled className='nav-link-disabled'>Shipping</Nav.Link>
                )}
            </Nav.Item>
            <Nav.Item>
                {step3 ? (
                    <LinkContainer to='/payment'>
                        <Nav.Link className='nav-link-custom'>Payment</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled className='nav-link-disabled'>Payment</Nav.Link>
                )}
            </Nav.Item>
            <Nav.Item>
                {step4 ? (
                    <LinkContainer to='/placeorder'>
                        <Nav.Link className='nav-link-custom'>Place Order</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled className='nav-link-disabled'>Place Order</Nav.Link>
                )}
            </Nav.Item>
        </Nav>
  )
}

export default CheckoutSteps