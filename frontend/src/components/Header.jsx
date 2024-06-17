import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaShoppingCart} from 'react-icons/fa';
import { VscAccount } from "react-icons/vsc";
import { BsBackpack } from "react-icons/bs";
import { LinkContainer } from 'react-router-bootstrap'

const Header = () => {
  return (
    <div>
        <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
            <Container>
                <LinkContainer to='/'>
                    <Navbar.Brand >
                        <BsBackpack size={30}/> <span className="fw-bold">EasyShop</span>
                    </Navbar.Brand>
                </LinkContainer>
                
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='ms-auto'>
                        <LinkContainer to='/cart'>
                            <Nav.Link>
                                <FaShoppingCart size={25} /> Cart
                            </Nav.Link>
                        </LinkContainer>
                        
                        <LinkContainer to='/login'>
                            <Nav.Link>
                                <VscAccount size={25}/> Sign In
                            </Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </div>
  )
}

export default Header