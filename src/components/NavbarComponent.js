import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import './NavbarComponent.css';

const NavbarComponent = () => {
  return (
    <Navbar bg="light" variant="light" className="flex-column text-center">
      <Navbar.Brand href="/" className="justify-content-center mb-0 w-100">
         RHINO LOCATIONS
      </Navbar.Brand>
      <Nav className="justify-content-center w-100">
        <Nav.Link href="/">LOCATIONS</Nav.Link>
        <Nav.Link href="/about">ABOUT ME</Nav.Link>

      </Nav>
    </Navbar>
  );
}

export default NavbarComponent;
