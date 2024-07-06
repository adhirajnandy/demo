import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <Container>
                <Row className="align-items-center">
                    <Col xs={12} md={6} className="text-center text-md-start py-3">
                        <p className="footer-text fw-bolder">
                            EasyShop &copy; {currentYear}
                        </p>
                    </Col>
                    <Col xs={12} md={6} className="text-center text-md-end py-3">
                        <div className="social-icons">
                            <a href="https://www.facebook.com">
                                <FaFacebook className="social-icon" />
                            </a>
                            <a href="https://www.twitter.com">
                                <FaTwitter className="social-icon" />
                            </a>
                            <a href="https://www.instagram.com">
                                <FaInstagram className="social-icon" />
                            </a>
                            <a href="https://www.github.com">
                                <FaGithub className="social-icon" />
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
