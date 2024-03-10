import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const TransparentNavbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in 
    const userIsLoggedIn = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(userIsLoggedIn === 'true');
  }, []);

  const handleLogout = () => {
    // Perform logout action here (e.g., clear local storage, reset state, etc.)
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    // Redirect to login page after logout
    navigate('/login');
  };

  return (
    <Navbar bg="transparent" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">
        <Image
          src="image.png"
          width="30"
          height="30"
          className="d-inline-block align-top mr-2"
          alt="Weather App Icon"
        />
        Weather App
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="nav-link">
                <FontAwesomeIcon icon={faUserCircle} size="2x"  className="mr-2" />
              </Link>
              <Button variant="outline-light" onClick={handleLogout} className="mr-2">
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="outline-light" className="mr-2">
                <FontAwesomeIcon icon={faSignInAlt} className="mr-1" />
                Login
              </Button>
              <Button as={Link} to="/signup" variant="outline-light">
                <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
                Sign Up
              </Button>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TransparentNavbar;
