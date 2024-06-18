import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import { VscAccount } from "react-icons/vsc";
import { BsBackpack } from "react-icons/bs";
import { LinkContainer } from 'react-router-bootstrap';

const Header = () => {
  return (
    <div>
      <Navbar style={{ background: 'linear-gradient(to right, #333333, #1a1a1a)' }} variant='dark' expand='md' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand className="d-flex align-items-center">
              <BsBackpack size={30} style={{ color: '#ffffff' }} /> <span className="fw-bold ms-2" style={{ color: '#ffffff' }}>EasyShop</span>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav' className='justify-content-end'>
            <Nav className='align-items-center'>
              <LinkContainer to='/cart'>
                <Nav.Link className="d-flex align-items-center text-light">
                  <FaShoppingCart size={25} style={{ color: '#ffffff' }} /> <span className="ms-1">Cart</span>
                </Nav.Link>
              </LinkContainer>

              <LinkContainer to='/login'>
                <Nav.Link className="d-flex align-items-center text-light ms-3">
                  <VscAccount size={25} style={{ color: '#ffffff' }} /> <span className="ms-1">Sign In</span>
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
