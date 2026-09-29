import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

export default function BootstrapFooter() {
  const { settings } = useStore();

  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-5">
      <Container>
        <Row className="g-4">
          {/* Brand Column */}
          <Col lg={3} md={6}>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-gradient-amber rounded-3 d-flex align-items-center justify-content-center me-2" style={{width: '40px', height: '40px'}}>
                <span className="text-white fw-bold">A</span>
              </div>
              <div>
                <div className="fw-bold">ARA</div>
                <div className="small text-amber-400" style={{marginTop: '-5px'}}>BEDDINGS</div>
              </div>
            </div>
            <p className="text-muted small mb-3">
              Premium bedding crafted for the perfect night's sleep. From Egyptian cotton to organic bamboo — every thread tells a story of comfort and quality.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle" style={{width: '35px', height: '35px', padding: '0'}}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle" style={{width: '35px', height: '35px', padding: '0'}}>
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle" style={{width: '35px', height: '35px', padding: '0'}}>
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </Col>

          {/* Shop Column */}
          <Col lg={2} md={6}>
            <h6 className="fw-bold mb-3">Shop</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/products" className="text-muted text-decoration-none small">
                  All Products
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products?category=bed-sheets" className="text-muted text-decoration-none small">
                  Bed Sheets
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products?category=duvet-covers" className="text-muted text-decoration-none small">
                  Duvet Covers
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products?category=comforters" className="text-muted text-decoration-none small">
                  Comforters
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products?category=blankets" className="text-muted text-decoration-none small">
                  Blankets
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products?category=pillowcases" className="text-muted text-decoration-none small">
                  Pillowcases
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products?category=pillows" className="text-muted text-decoration-none small">
                  Pillows
                </Link>
              </li>
            </ul>
          </Col>

          {/* Customer Column */}
          <Col lg={2} md={6}>
            <h6 className="fw-bold mb-3">Customer</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/account" className="text-muted text-decoration-none small">
                  My Account
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/track-order" className="text-muted text-decoration-none small">
                  Track Order
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/drug-order" className="text-muted text-decoration-none small">
                  Custom Orders
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/wishlist" className="text-muted text-decoration-none small">
                  Wishlist
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" className="text-muted text-decoration-none small">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </Col>

          {/* Help Column */}
          <Col lg={2} md={6}>
            <h6 className="fw-bold mb-3">Help</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/about" className="text-muted text-decoration-none small">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-muted text-decoration-none small">
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/shipping" className="text-muted text-decoration-none small">
                  Shipping Info
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/returns" className="text-muted text-decoration-none small">
                  Returns & Refunds
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/faq" className="text-muted text-decoration-none small">
                  FAQ
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="text-muted text-decoration-none small">
                  Terms & Conditions
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/privacy" className="text-muted text-decoration-none small">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </Col>

          {/* Contact Column */}
          <Col lg={3} md={6}>
            <h6 className="fw-bold mb-3">Contact</h6>
            <ul className="list-unstyled text-muted small">
              <li className="mb-2 d-flex align-items-start">
                <i className="bi bi-envelope me-2 mt-1"></i>
                <span>{settings.storeEmail}</span>
              </li>
              <li className="mb-2 d-flex align-items-start">
                <i className="bi bi-telephone me-2 mt-1"></i>
                <span>{settings.storePhone}</span>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <i className="bi bi-geo-alt me-2 mt-1"></i>
                <span>Karachi, Pakistan</span>
              </li>
            </ul>
            <div className="bg-secondary bg-opacity-25 rounded-3 p-3">
              <p className="small text-muted mb-1">Free shipping on orders over</p>
              <p className="h5 text-amber-400 mb-1">{formatPKR(settings.freeShippingThreshold)}</p>
              <p className="small text-muted mb-0">30-day risk-free returns</p>
            </div>
          </Col>
        </Row>

        <hr className="border-secondary my-4" />

        <Row>
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <p className="small text-muted mb-0">
              © 2024 ARA BEDDINGS. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <Link to="/privacy" className="text-muted text-decoration-none small">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted text-decoration-none small">
                Terms of Service
              </Link>
              <Link to="/shipping" className="text-muted text-decoration-none small">
                Shipping Info
              </Link>
              <Link to="/returns" className="text-muted text-decoration-none small">
                Returns
              </Link>
              <Link to="/faq" className="text-muted text-decoration-none small">
                FAQ
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}
