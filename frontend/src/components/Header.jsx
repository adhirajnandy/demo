import React from 'react';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import { VscAccount } from "react-icons/vsc";
import { BsBackpack } from "react-icons/bs";
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation, useLogoutMutation } from '../slices/usersApiSlice';
import { removeCredentials } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';


const Header = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  //this is required to remove our http only cookie
  const [logoutApiCall] = useLogoutMutation();


  const logoutHandler = async() => {
    try {
      //since it will return us a promise we will add .unwrap onto it
      await logoutApiCall().unwrap();
      //to remove the local stuff
      dispatch(removeCredentials());
      //navigating the user to the login page
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
    
  }


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
                  {
                    cartItems.length > 0 && (
                      <Badge pill bg='success' style={{
                        marginLeft:'5px'
                      }}>
                          {cartItems.reduce((a,c) => a + c.qty,0)}
                      </Badge>
                    )
                  }
                </Nav.Link>
              </LinkContainer>
                  {userInfo ? (
                    <NavDropdown title= {userInfo.name} id='username'>
                      <LinkContainer to='/profile'>
                        <NavDropdown.Item>Profile</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Item onClick={logoutHandler}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  ) : (<LinkContainer to='/login'>
                <Nav.Link className="d-flex align-items-center text-light ms-3">
                  <VscAccount size={25} style={{ color: '#ffffff' }} /> <span className="ms-1">Sign In</span>
                </Nav.Link>
              </LinkContainer>)}
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
