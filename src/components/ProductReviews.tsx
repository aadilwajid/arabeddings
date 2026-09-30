import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Modal, ListGroup } from 'react-bootstrap';
import { useStore } from '../store';
import { formatPKR } from '../data/pakistan';

interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  helpful: number;
  createdAt: string;
  images?: string[];
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { products, user } = useStore();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const product = products.find(p => p.id === productId);
  const reviews = product?.reviews || [];

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
  }));

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    if (sortBy === 'helpful') return (b.helpful || 0) - (a.helpful || 0);
    return 0;
  });

  const handleSubmitReview = () => {
    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    const newReview: Review = {
      id: `review-${Date.now()}`,
      userId: user.id,
      userName: user.name || 'Anonymous',
      productId,
      rating: selectedRating,
      title: reviewTitle,
      body: reviewBody,
      verifiedPurchase: true,
      helpful: 0,
      createdAt: new Date().toISOString()
    };

    // In real app, this would call an API
    console.log('New review:', newReview);
    setShowReviewModal(false);
    setReviewTitle('');
    setReviewBody('');
    setSelectedRating(0);
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="text-center">
              <h2 className="display-4 fw-bold text-warning mb-2">
                {averageRating.toFixed(1)}
              </h2>
              <div className="mb-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <i
                    key={star}
                    className={`bi bi-star${star <= Math.round(averageRating) ? '-fill text-warning' : ' text-muted'}`}
                    style={{ fontSize: '1.5rem' }}
                  ></i>
                ))}
              </div>
              <p className="text-muted mb-0">Based on {reviews.length} reviews</p>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h6 className="mb-3">Rating Distribution</h6>
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="d-flex align-items-center mb-2">
                  <span className="me-2" style={{ width: '60px' }}>
                    {star} <i className="bi bi-star-fill text-warning"></i>
                  </span>
                  <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                    <div
                      className="progress-bar bg-warning"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-muted small">{count}</span>
                </div>
              ))}
            </Card.Body>
          </Card>

          <Button
            variant="warning"
            className="w-100"
            onClick={() => setShowReviewModal(true)}
          >
            <i className="bi bi-pencil-square me-2"></i>
            Write a Review
          </Button>
        </Col>

        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">Customer Reviews</h5>
              <Form.Select
                size="sm"
                style={{ width: '200px' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
                <option value="helpful">Most Helpful</option>
              </Form.Select>
            </Card.Header>
            <Card.Body className="p-0">
              {sortedReviews.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-chat-square-text text-muted" style={{ fontSize: '3rem' }}></i>
                  <p className="text-muted mt-3 mb-0">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {sortedReviews.map((review) => (
                    <ListGroup.Item key={review.id} className="border-0 py-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <div className="d-flex align-items-center mb-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <i
                                key={star}
                                className={`bi bi-star${star <= review.rating ? '-fill text-warning' : ' text-muted'}`}
                                style={{ fontSize: '0.875rem' }}
                              ></i>
                            ))}
                            {review.verifiedPurchase && (
                              <Badge bg="success" className="ms-2" style={{ fontSize: '0.7rem' }}>
                                <i className="bi bi-check-circle me-1"></i>
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <h6 className="mb-1">{review.title}</h6>
                        </div>
                        <small className="text-muted">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="text-muted mb-2">{review.body}</p>
                      <div className="d-flex align-items-center">
                        <small className="text-muted me-3">By {review.userName}</small>
                        <Button variant="link" size="sm" className="p-0 text-muted">
                          <i className="bi bi-hand-thumbs-up me-1"></i>
                          Helpful ({review.helpful})
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Write Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Rating *</Form.Label>
              <div className="d-flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <i
                    key={star}
                    className={`bi bi-star${star <= selectedRating ? '-fill text-warning' : ' text-muted'}`}
                    style={{ fontSize: '2rem', cursor: 'pointer' }}
                    onClick={() => setSelectedRating(star)}
                  ></i>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Review Title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Summarize your experience"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Your Review *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Share your thoughts about this product..."
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
              />
            </Form.Group>

            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              Your review will be published after moderation.
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Cancel
          </Button>
          <Button
            variant="warning"
            onClick={handleSubmitReview}
            disabled={selectedRating === 0 || !reviewTitle || !reviewBody}
          >
            Submit Review
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

function Alert({ variant, children }: { variant: string; children: React.ReactNode }) {
  return (
    <div className={`alert alert-${variant}`} role="alert">
      {children}
    </div>
  );
}
