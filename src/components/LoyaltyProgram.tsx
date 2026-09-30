import React from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, Button, ListGroup } from 'react-bootstrap';
import { useStore } from '../store';
import { formatPKR } from '../data/pakistan';

interface LoyaltyData {
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalSpent: number;
  nextTierPoints: number;
  currentTierPoints: number;
}

export default function LoyaltyProgram() {
  const { user, orders } = useStore();

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Card className="border-0 shadow-sm">
          <Card.Body className="py-5">
            <i className="bi bi-gift text-warning" style={{ fontSize: '4rem' }}></i>
            <h3 className="mt-3">Join Our Loyalty Program</h3>
            <p className="text-muted">Login to start earning rewards and exclusive benefits!</p>
            <Button variant="warning" href="/login">
              Login Now
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // Calculate loyalty data
  const userOrders = orders.filter(o => o.userId === user.id);
  const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
  const points = Math.floor(totalSpent); // 1 PKR = 1 point

  // Determine tier
  let tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' = 'Bronze';
  let nextTierPoints = 5000;
  let currentTierPoints = 0;

  if (points >= 50000) {
    tier = 'Platinum';
    nextTierPoints = 50000;
    currentTierPoints = 50000;
  } else if (points >= 20000) {
    tier = 'Gold';
    nextTierPoints = 50000;
    currentTierPoints = 20000;
  } else if (points >= 5000) {
    tier = 'Silver';
    nextTierPoints = 20000;
    currentTierPoints = 5000;
  } else {
    tier = 'Bronze';
    nextTierPoints = 5000;
    currentTierPoints = 0;
  }

  const progressPercentage = ((points - currentTierPoints) / (nextTierPoints - currentTierPoints)) * 100;
  const pointsToNextTier = nextTierPoints - points;

  const tierBenefits = {
    Bronze: [
      'Earn 1 point per Rs. 1 spent',
      'Birthday reward: 100 points',
      'Early access to sales'
    ],
    Silver: [
      'Earn 1.2 points per Rs. 1 spent',
      'Birthday reward: 250 points',
      'Free shipping on all orders',
      '10% off on birthday month'
    ],
    Gold: [
      'Earn 1.5 points per Rs. 1 spent',
      'Birthday reward: 500 points',
      'Free express shipping',
      '15% off on birthday month',
      'Exclusive member products'
    ],
    Platinum: [
      'Earn 2 points per Rs. 1 spent',
      'Birthday reward: 1000 points',
      'Free express shipping',
      '20% off on birthday month',
      'Exclusive member products',
      'Priority customer support',
      'Free gift wrapping'
    ]
  };

  const tierColors = {
    Bronze: 'warning',
    Silver: 'secondary',
    Gold: 'warning',
    Platinum: 'dark'
  };

  const tierIcons = {
    Bronze: 'bi-award',
    Silver: 'bi-award-fill',
    Gold: 'bi-trophy',
    Platinum: 'bi-gem'
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold mb-2">
            <i className="bi bi-gift text-warning me-2"></i>
            Loyalty & Rewards
          </h2>
          <p className="text-muted">Earn points with every purchase and unlock exclusive benefits!</p>
        </Col>
      </Row>

      {/* Points Overview */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className={`bi ${tierIcons[tier]} text-${tierColors[tier]}`} style={{ fontSize: '3rem' }}></i>
              </div>
              <h6 className="text-muted mb-1">Your Tier</h6>
              <h3 className={`text-${tierColors[tier]} fw-bold mb-0`}>{tier}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="bi bi-star-fill text-warning" style={{ fontSize: '3rem' }}></i>
              </div>
              <h6 className="text-muted mb-1">Total Points</h6>
              <h3 className="fw-bold mb-0">{points.toLocaleString()}</h3>
              <small className="text-muted">= {formatPKR(points)} in rewards</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="bi bi-bag-check text-success" style={{ fontSize: '3rem' }}></i>
              </div>
              <h6 className="text-muted mb-1">Total Spent</h6>
              <h3 className="fw-bold mb-0">{formatPKR(totalSpent)}</h3>
              <small className="text-muted">{userOrders.length} orders</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Progress to Next Tier */}
      {tier !== 'Platinum' && (
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Progress to {tier === 'Bronze' ? 'Silver' : tier === 'Silver' ? 'Gold' : 'Platinum'}</h6>
              <Badge bg={tierColors[tier]}>
                {pointsToNextTier.toLocaleString()} points to go
              </Badge>
            </div>
            <ProgressBar
              now={progressPercentage}
              variant={tierColors[tier]}
              className="mb-2"
              style={{ height: '12px' }}
            />
            <div className="d-flex justify-content-between small text-muted">
              <span>{currentTierPoints.toLocaleString()} points</span>
              <span>{nextTierPoints.toLocaleString()} points</span>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Tier Benefits */}
      <Row className="g-4 mb-4">
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0">
                <i className={`bi ${tierIcons[tier]} text-${tierColors[tier]} me-2`}></i>
                Your {tier} Benefits
              </h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {tierBenefits[tier].map((benefit, index) => (
                  <ListGroup.Item key={index} className="border-0 px-0">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    {benefit}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0">
                <i className="bi bi-trophy-fill text-warning me-2"></i>
                How to Earn Points
              </h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="border-0 px-0">
                  <div className="d-flex justify-content-between">
                    <span>Make a purchase</span>
                    <Badge bg="success">1 point per Rs. 1</Badge>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  <div className="d-flex justify-content-between">
                    <span>Write a review</span>
                    <Badge bg="success">50 points</Badge>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  <div className="d-flex justify-content-between">
                    <span>Refer a friend</span>
                    <Badge bg="success">500 points</Badge>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  <div className="d-flex justify-content-between">
                    <span>Birthday reward</span>
                    <Badge bg="success">
                      {tier === 'Bronze' ? '100' : tier === 'Silver' ? '250' : tier === 'Gold' ? '500' : '1000'} points
                    </Badge>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  <div className="d-flex justify-content-between">
                    <span>Follow on social media</span>
                    <Badge bg="success">100 points</Badge>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Redeem Points */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <h5 className="mb-0">
            <i className="bi bi-gift text-danger me-2"></i>
            Redeem Your Points
          </h5>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Card className="border h-100">
                <Card.Body className="text-center">
                  <i className="bi bi-percent text-primary" style={{ fontSize: '2rem' }}></i>
                  <h6 className="mt-2">Rs. 500 Off</h6>
                  <p className="text-muted small mb-2">On orders above Rs. 5,000</p>
                  <Badge bg="warning" className="mb-3">5,000 points</Badge>
                  <Button variant="outline-primary" size="sm" disabled={points < 5000}>
                    Redeem
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border h-100">
                <Card.Body className="text-center">
                  <i className="bi bi-truck text-primary" style={{ fontSize: '2rem' }}></i>
                  <h6 className="mt-2">Free Shipping</h6>
                  <p className="text-muted small mb-2">On your next order</p>
                  <Badge bg="warning" className="mb-3">2,500 points</Badge>
                  <Button variant="outline-primary" size="sm" disabled={points < 2500}>
                    Redeem
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border h-100">
                <Card.Body className="text-center">
                  <i className="bi bi-gift text-primary" style={{ fontSize: '2rem' }}></i>
                  <h6 className="mt-2">Rs. 1,000 Off</h6>
                  <p className="text-muted small mb-2">On orders above Rs. 10,000</p>
                  <Badge bg="warning" className="mb-3">10,000 points</Badge>
                  <Button variant="outline-primary" size="sm" disabled={points < 10000}>
                    Redeem
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
