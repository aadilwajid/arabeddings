import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge, Offcanvas } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';

export default function BootstrapHeader() {
  const [show, setShow] = useState(false);
  const { cart, wishlist, user, isAdmin, cartCount, logout, darkMode, toggleDarkMode } = useStore();
  const location = useLocation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-primary text-white py-2">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-none d-md-flex gap-3 small">
              <span>
                <i className="bi bi-telephone me-1"></i>
                +92 321 1234567
              </span>
              <span>
                <i className="bi bi-envelope me-1"></i>
                hello@arabeddings.com
              </span>
            </div>
            <div className="d-flex align-items-center gap-3 small">
              <span className="d-none d-sm-inline">Free delivery on orders over Rs. 5,000</span>
              {user && (
                <Badge bg="light" text="dark">
                  {user.role === 'ADMIN' ? 'Admin' : 'Customer'}
                </Badge>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <Navbar expand="lg" className="bg-white shadow-sm sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <div className="bg-gradient-amber rounded-3 d-flex align-items-center justify-content-center me-2" style={{width: '40px', height: '40px'}}>
              <span className="text-white fw-bold">A</span>
            </div>
            <div>
              <div className="fw-bold text-dark">ARA</div>
              <div className="small text-amber-600" style={{marginTop: '-5px'}}>BEDDINGS</div>
            </div>
          </Navbar.Brand>

          <div className="d-flex align-items-center gap-2 d-lg-none">
            <button 
              className="btn btn-link text-dark position-relative p-0"
              onClick={toggleDarkMode}
            >
              <i className={`bi ${darkMode ? 'bi-sun' : 'bi-moon'}`}></i>
            </button>
            <Link to="/wishlist" className="btn btn-link text-dark position-relative p-0">
              <i className="bi bi-heart"></i>
              {wishlist.length > 0 && (
                <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-pill" style={{fontSize: '0.6rem'}}>
                  {wishlist.length}
                </Badge>
              )}
            </Link>
            <Link to="/cart" className="btn btn-link text-dark position-relative p-0">
              <i className="bi bi-cart3"></i>
              {cartCount() > 0 && (
                <Badge bg="warning" text="dark" className="position-absolute top-0 start-100 translate-middle rounded-pill" style={{fontSize: '0.6rem'}}>
                  {cartCount()}
                </Badge>
              )}
            </Link>
            <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShow} />
          </div>

          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
            show={show}
            onHide={handleClose}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link as={Link} to="/" active={location.pathname === '/'} onClick={handleClose}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/products" active={location.pathname === '/products'} onClick={handleClose}>
                  Shop All
                </Nav.Link>
                <NavDropdown title="Categories" id="categories-dropdown">
                  <NavDropdown.Item as={Link} to="/products?category=bed-sheets" onClick={handleClose}>
                    Bed Sheets
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/products?category=duvet-covers" onClick={handleClose}>
                    Duvet Covers
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/products?category=comforters" onClick={handleClose}>
                    Comforters
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/products?category=blankets" onClick={handleClose}>
                    Blankets
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/products?category=pillowcases" onClick={handleClose}>
                    Pillowcases
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/products?category=pillows" onClick={handleClose}>
                    Pillows
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={Link} to="/track-order" onClick={handleClose}>
                  Track Order
                </Nav.Link>
                <Nav.Link as={Link} to="/drug-order" className="text-amber-600 fw-semibold" onClick={handleClose}>
                  Custom Order
                </Nav.Link>
              </Nav>

              <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={toggleDarkMode}
                >
                  <i className={`bi ${darkMode ? 'bi-sun' : 'bi-moon'}`}></i>
                </button>
                <Link to="/wishlist" className="btn btn-outline-secondary btn-sm position-relative">
                  <i className="bi bi-heart"></i>
                  {wishlist.length > 0 && (
                    <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-pill" style={{fontSize: '0.6rem'}}>
                      {wishlist.length}
                    </Badge>
                  )}
                </Link>
                <Link to="/cart" className="btn btn-outline-secondary btn-sm position-relative">
                  <i className="bi bi-cart3"></i>
                  {cartCount() > 0 && (
                    <Badge bg="warning" text="dark" className="position-absolute top-0 start-100 translate-middle rounded-pill" style={{fontSize: '0.6rem'}}>
                      {cartCount()}
                    </Badge>
                  )}
                </Link>
                {user ? (
                  <NavDropdown 
                    title={
                      <span>
                        <i className="bi bi-person-circle me-1"></i>
                        {user.name?.split(' ')[0]}
                      </span>
                    } 
                    id="user-dropdown"
                    align="end"
                  >
                    <NavDropdown.Item as={Link} to="/account" onClick={handleClose}>
                      My Account
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/account/orders" onClick={handleClose}>
                      My Orders
                    </NavDropdown.Item>
                    {isAdmin && (
                      <>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="/admin" onClick={handleClose}>
                          Admin Dashboard
                        </NavDropdown.Item>
                      </>
                    )}
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => { logout(); handleClose(); }}>
                      Sign Out
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Link to="/login" className="btn btn-primary btn-sm" onClick={handleClose}>
                    Sign In
                  </Link>
                )}
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" active={location.pathname === '/'}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/products" active={location.pathname === '/products'}>
                Shop All
              </Nav.Link>
              <NavDropdown title="Categories" id="categories-dropdown-desktop">
                <NavDropdown.Item as={Link} to="/products?category=bed-sheets">
                  Bed Sheets
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products?category=duvet-covers">
                  Duvet Covers
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products?category=comforters">
                  Comforters
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products?category=blankets">
                  Blankets
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products?category=pillowcases">
                  Pillowcases
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products?category=pillows">
                  Pillows
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/track-order">
                Track Order
              </Nav.Link>
              <Nav.Link as={Link} to="/drug-order" className="text-amber-600 fw-semibold">
                Custom Order
              </Nav.Link>
            </Nav>

            <div className="d-flex align-items-center gap-2">
              <button 
                className="btn btn-link text-dark"
                onClick={toggleDarkMode}
              >
                <i className={`bi ${darkMode ? 'bi-sun' : 'bi-moon'}`}></i>
              </button>
              <Link to="/wishlist" className="btn btn-link text-dark position-relative">
                <i className="bi bi-heart"></i>
                {wishlist.length > 0 && (
                  <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-pill" style={{fontSize: '0.6rem'}}>
                    {wishlist.length}
                  </Badge>
                )}
              </Link>
              <Link to="/cart" className="btn btn-link text-dark position-relative">
                <i className="bi bi-cart3"></i>
                {cartCount() > 0 && (
                  <Badge bg="warning" text="dark" className="position-absolute top-0 start-100 translate-middle rounded-pill" style={{fontSize: '0.6rem'}}>
                    {cartCount()}
                  </Badge>
                )}
              </Link>
              {user ? (
                <NavDropdown 
                  title={
                    <span>
                      <i className="bi bi-person-circle me-1"></i>
                      {user.name?.split(' ')[0]}
                    </span>
                  } 
                  id="user-dropdown-desktop"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/account">
                    My Account
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/account/orders">
                    My Orders
                  </NavDropdown.Item>
                  {isAdmin && (
                    <>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/admin">
                        Admin Dashboard
                      </NavDropdown.Item>
                    </>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Link to="/login" className="btn btn-primary btn-sm">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </Container>
      </Navbar>
    </>
  );
}
