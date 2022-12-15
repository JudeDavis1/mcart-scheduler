import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
// import NavDropdown from 'react-bootstrap/NavDropdown';

import './NavigationMenu.css';
import { useEffect, useState } from 'react';
import { hasJwt } from '../../controllers/loginController';


function NavigationMenu(props) {
  return (
    <div className='navigation-menu'>
      <Navbar collapseOnSelect expand='sm' fixed='top' bg='dark' variant='dark'>
        <Container>
          <Navbar.Brand href='/' className='navbar-brand'>mCart Scheduler</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={ Link } to='/home'>Home</Nav.Link>
              <Nav.Link as={ Link } to='/contact-us'>Contact Us</Nav.Link>
            </Nav>
            <Nav>
              <Button as={ Link } to='/login' className='login-button right-menu-item' variant='primary'>Login</Button>
              <Button as={ Link } to='/signup' className='signup-button right-menu-item' variant='outline-light'>Signup</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavigationMenu;
