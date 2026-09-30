import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal, Badge, Alert } from 'react-bootstrap';
import { formatPKR } from '../data/pakistan';

export default function GiftCards() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [amount, setAmount] = useState(5000);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedDesign, setSelectedDesign] = useState('design-1');

  const presetAmounts = [2000, 5000, 10000, 15000, 20000, 25000];

  const designs = [
    { id: 'design-1', name: 'Elegant Gold', color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
    { id: 'design-2', name: 'Royal Blue', color: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' },
    { id: 'design-3', name: 'Rose Pink', color: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' },
    { id: 'design-4', name: 'Emerald Green', color: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }
  ];

  const handlePurchase = () => {
    // In real app, this would process payment and send email
    alert(`Gift card purchased!\nAmount: ${formatPKR(amount)}\nRecipient: ${recipientEmail}\nDesign: ${selectedDesign}`);
    setShowPurchaseModal(false);
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col className="text-center">
          <h2 className="fw-bold mb-2">
            <i className="bi bi-gift text-danger me-2"></i>
            Gift Cards
          </h2>
          <p className="text-muted">Give the gift of luxury sleep</p>
        </Col>
      </Row>

      {/* Gift Card Designs */}
      <Row className="g-4 mb-4">
        {designs.map((design) => (
          <Col key={design.id} md={6} lg={3}>
            <Card 
              className="border-0 shadow-sm h-100 gift-card-hover cursor-pointer"
              onClick={() => setSelectedDesign(design.id)}
              style={{ 
                background: design.color,
                border: selectedDesign === design.id ? '3px solid #000' : 'none'
              }}
            >
              <Card.Body className="text-white p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <div className="fw-bold mb-1">ARA BEDDINGS</div>
                    <div className="small opacity-75">Gift Card</div>
                  </div>
                  <i className="bi bi-gift-fill" style={{ fontSize: '2rem' }}></i>
                </div>
                <div className="mb-4">
                  <div className="small opacity-75 mb-1">Value</div>
                  <div className="h3 fw-bold">{formatPKR(5000)}</div>
                </div>
                <div className="small opacity-75">
                  {design.name}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Amount Selection */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-3">Select Amount</h5>
          <Row className="g-2 mb-3">
            {presetAmounts.map((preset) => (
              <Col key={preset} xs={6} md={4} lg={2}>
                <Button
                  variant={amount === preset ? 'primary' : 'outline-primary'}
                  className="w-100"
                  onClick={() => setAmount(preset)}
                >
                  {formatPKR(preset)}
                </Button>
              </Col>
            ))}
          </Row>
          <Form.Group>
            <Form.Label>Or enter custom amount</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="1000"
              max="100000"
              step="500"
            />
            <Form.Text className="text-muted">
              Minimum: {formatPKR(1000)} | Maximum: {formatPKR(100000)}
            </Form.Text>
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Purchase Button */}
      <div className="text-center">
        <Button 
          variant="danger" 
          size="lg"
          onClick={() => setShowPurchaseModal(true)}
        >
          <i className="bi bi-cart-plus me-2"></i>
          Purchase Gift Card - {formatPKR(amount)}
        </Button>
      </div>

      {/* Features */}
      <Row className="g-4 mt-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <i className="bi bi-envelope-heart text-danger" style={{ fontSize: '3rem' }}></i>
              <h6 className="mt-3">Instant Delivery</h6>
              <p className="text-muted small mb-0">
                Gift card delivered instantly via email
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <i className="bi bi-calendar-check text-success" style={{ fontSize: '3rem' }}></i>
              <h6 className="mt-3">No Expiry</h6>
              <p className="text-muted small mb-0">
                Gift cards never expire
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <i className="bi bi-shield-check text-primary" style={{ fontSize: '3rem' }}></i>
              <h6 className="mt-3">Secure & Safe</h6>
              <p className="text-muted small mb-0">
                100% secure payment processing
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Purchase Modal */}
      <Modal show={showPurchaseModal} onHide={() => setShowPurchaseModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Complete Your Gift Card Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <i className="bi bi-info-circle me-2"></i>
            You're purchasing a gift card worth <strong>{formatPKR(amount)}</strong>
          </Alert>

          <Form>
            <h6 className="mb-3">Recipient Details</h6>
            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Recipient Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="John Doe"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Recipient Email *</Form.Label>
                  <Form.Control
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Your Name (Sender)</Form.Label>
              <Form.Control
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Personal Message (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message..."
              />
            </Form.Group>

            <div className="border-top pt-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Gift Card Amount:</span>
                <strong>{formatPKR(amount)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Delivery:</span>
                <Badge bg="success">FREE (Instant)</Badge>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <span className="h5 mb-0">Total:</span>
                <span className="h5 text-danger fw-bold mb-0">{formatPKR(amount)}</span>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPurchaseModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handlePurchase}
            disabled={!recipientEmail || !recipientName}
          >
            <i className="bi bi-credit-card me-2"></i>
            Complete Purchase
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .gift-card-hover {
          transition: transform 0.3s ease;
          cursor: pointer;
        }
        .gift-card-hover:hover {
          transform: scale(1.05);
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </Container>
  );
}
