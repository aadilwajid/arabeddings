import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form } from 'react-bootstrap';
import { useStore } from '../store';
import { formatPKR } from '../data/pakistan';
import { Link } from 'react-router-dom';

export default function BundleDeals() {
  const { products } = useStore();
  const [showBundleModal, setShowBundleModal] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<any>(null);

  // Define bundle deals
  const bundles = [
    {
      id: 'bundle-1',
      name: 'Complete Bedroom Set',
      description: 'Everything you need for a perfect bedroom',
      discount: 20,
      products: ['prod-1', 'prod-4', 'prod-5'], // Sheets + Duvet + Comforter
      originalPrice: 45000,
      bundlePrice: 36000,
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
      badge: 'Best Value'
    },
    {
      id: 'bundle-2',
      name: 'Luxury Sleep Collection',
      description: 'Premium bedding for the ultimate sleep experience',
      discount: 15,
      products: ['prod-1', 'prod-8', 'prod-7'], // Sheets + Pillowcases + Pillows
      originalPrice: 25000,
      bundlePrice: 21250,
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80',
      badge: 'Popular'
    },
    {
      id: 'bundle-3',
      name: 'Guest Room Essentials',
      description: 'Perfect setup for guest bedrooms',
      discount: 18,
      products: ['prod-3', 'prod-9', 'prod-6'], // Duvet + Pillowcases + Blanket
      originalPrice: 20000,
      bundlePrice: 16400,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
      badge: 'Save 18%'
    },
    {
      id: 'bundle-4',
      name: 'Summer Cool Collection',
      description: 'Stay cool during hot Pakistani summers',
      discount: 22,
      products: ['prod-2', 'prod-8', 'prod-6'], // Bamboo Sheets + Linen Pillowcases + Blanket
      originalPrice: 18000,
      bundlePrice: 14040,
      image: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=600&q=80',
      badge: 'Summer Special'
    }
  ];

  const handleViewBundle = (bundle: any) => {
    setSelectedBundle(bundle);
    setShowBundleModal(true);
  };

  const getBundleProducts = (bundle: any) => {
    return bundle.products.map((productId: string) => 
      products.find(p => p.id === productId)
    ).filter(Boolean);
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <Badge bg="danger" className="mb-2 px-3 py-2">
              <i className="bi bi-lightning-fill me-1"></i>
              Limited Time Offers
            </Badge>
            <h2 className="fw-bold mb-2">Bundle Deals & Save Big!</h2>
            <p className="text-muted">Get more for less with our curated bedding bundles</p>
          </div>
        </Col>
      </Row>

      {/* Bundle Cards */}
      <Row className="g-4">
        {bundles.map((bundle) => (
          <Col key={bundle.id} md={6} lg={3}>
            <Card className="border-0 shadow-sm h-100 bundle-card-hover">
              <div className="position-relative">
                <Card.Img 
                  variant="top" 
                  src={bundle.image}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Badge 
                  bg="danger" 
                  className="position-absolute top-0 start-0 m-2"
                >
                  {bundle.badge}
                </Badge>
                <Badge 
                  bg="success" 
                  className="position-absolute top-0 end-0 m-2"
                >
                  Save {bundle.discount}%
                </Badge>
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-2">{bundle.name}</Card.Title>
                <Card.Text className="text-muted small mb-3">
                  {bundle.description}
                </Card.Text>
                <div className="mb-3">
                  <div className="text-muted text-decoration-line-through small">
                    {formatPKR(bundle.originalPrice)}
                  </div>
                  <div className="h4 fw-bold text-danger mb-0">
                    {formatPKR(bundle.bundlePrice)}
                  </div>
                  <div className="text-success small">
                    You save {formatPKR(bundle.originalPrice - bundle.bundlePrice)}
                  </div>
                </div>
                <div className="mt-auto">
                  <Button 
                    variant="danger" 
                    className="w-100"
                    onClick={() => handleViewBundle(bundle)}
                  >
                    View Bundle
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Bundle Details Modal */}
      <Modal show={showBundleModal} onHide={() => setShowBundleModal(false)} size="lg">
        {selectedBundle && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedBundle.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="g-4">
                <Col md={5}>
                  <Card className="border-0">
                    <Card.Img 
                      src={selectedBundle.image}
                      style={{ height: '300px', objectFit: 'cover' }}
                    />
                  </Card>
                </Col>
                <Col md={7}>
                  <h5 className="mb-3">{selectedBundle.description}</h5>
                  <div className="mb-3">
                    <Badge bg="danger" className="me-2">
                      Save {selectedBundle.discount}%
                    </Badge>
                    <Badge bg="success">
                      Save {formatPKR(selectedBundle.originalPrice - selectedBundle.bundlePrice)}
                    </Badge>
                  </div>
                  
                  <h6 className="mb-3">Bundle Includes:</h6>
                  <div className="mb-3">
                    {getBundleProducts(selectedBundle).map((product: any, index: number) => (
                      <div key={index} className="d-flex align-items-center mb-2 p-2 border rounded">
                        <img 
                          src={product.images[0]?.url}
                          alt={product.name}
                          className="rounded me-2"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-medium small">{product.name}</div>
                          <div className="text-muted small">{formatPKR(product.basePrice)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Original Price:</span>
                      <span className="text-decoration-line-through">
                        {formatPKR(selectedBundle.originalPrice)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="fw-bold">Bundle Price:</span>
                      <span className="h5 text-danger fw-bold mb-0">
                        {formatPKR(selectedBundle.bundlePrice)}
                      </span>
                    </div>
                    <Button variant="danger" className="w-100" size="lg">
                      <i className="bi bi-cart-plus me-2"></i>
                      Add Bundle to Cart
                    </Button>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          </>
        )}
      </Modal>

      {/* Additional Offers */}
      <Row className="mt-5 g-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm bg-gradient" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)' }}>
            <Card.Body className="text-white p-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <Badge bg="light" text="dark" className="mb-2">Flash Sale</Badge>
                  <h4 className="fw-bold mb-2">Buy 2 Get 1 Free</h4>
                  <p className="mb-3 opacity-90">On all pillowcases and sheets</p>
                  <Button variant="light" size="sm">
                    Shop Now <i className="bi bi-arrow-right ms-1"></i>
                  </Button>
                </Col>
                <Col md={4} className="text-center">
                  <div className="display-1 fw-bold">2+1</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm bg-gradient" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <Card.Body className="text-white p-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <Badge bg="light" text="dark" className="mb-2">Bulk Order</Badge>
                  <h4 className="fw-bold mb-2">Hotel & Business Discounts</h4>
                  <p className="mb-3 opacity-90">Up to 30% off on bulk orders</p>
                  <Link to="/drug-order">
                    <Button variant="light" size="sm">
                      Get Quote <i className="bi bi-arrow-right ms-1"></i>
                    </Button>
                  </Link>
                </Col>
                <Col md={4} className="text-center">
                  <i className="bi bi-building" style={{ fontSize: '4rem' }}></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
        .bundle-card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .bundle-card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </Container>
  );
}
