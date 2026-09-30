import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { useStore } from '../store';
import { formatPKR } from '../data/pakistan';
import { Link } from 'react-router-dom';

export default function ProductComparison() {
  const { products } = useStore();
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('compareList');
    if (saved) {
      setCompareList(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (productId: string) => {
    if (compareList.length >= 4) {
      alert('You can compare up to 4 products at a time');
      return;
    }
    if (!compareList.includes(productId)) {
      setCompareList([...compareList, productId]);
    }
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(compareList.filter(id => id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const compareProducts = compareList.map(id => products.find(p => p.id === id)).filter(Boolean);

  if (compareList.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Card className="border-0 shadow-sm">
          <Card.Body className="py-5">
            <i className="bi bi-arrow-left-right text-primary" style={{ fontSize: '4rem' }}></i>
            <h3 className="mt-3">Compare Products</h3>
            <p className="text-muted">Add products to compare their features side by side</p>
            <Link to="/products">
              <Button variant="primary">
                Browse Products
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold mb-2">
              <i className="bi bi-arrow-left-right text-primary me-2"></i>
              Product Comparison
            </h2>
            <p className="text-muted mb-0">Compare up to 4 products side by side</p>
          </div>
          <div>
            <Button variant="outline-danger" onClick={clearCompare}>
              <i className="bi bi-trash me-2"></i>
              Clear All
            </Button>
          </div>
        </Col>
      </Row>

      {/* Product Cards */}
      <Row className="g-4 mb-4">
        {compareProducts.map((product: any) => (
          <Col key={product.id} md={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Img 
                variant="top" 
                src={product.images[0]?.url}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title className="small mb-2">{product.name}</Card.Title>
                <div className="mb-2">
                  <span className="h5 text-primary fw-bold">
                    {formatPKR(Math.min(...product.variants.map((v: any) => v.price)))}
                  </span>
                </div>
                <div className="mb-3">
                  {product.reviews.length > 0 && (
                    <div>
                      {[1, 2, 3, 4, 5].map(star => (
                        <i
                          key={star}
                          className={`bi bi-star${star <= Math.round(product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length) ? '-fill text-warning' : ' text-muted'}`}
                          style={{ fontSize: '0.875rem' }}
                        ></i>
                      ))}
                      <small className="text-muted ms-1">({product.reviews.length})</small>
                    </div>
                  )}
                </div>
                <div className="d-grid gap-2">
                  <Link to={`/products/${product.slug}`}>
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => removeFromCompare(product.id)}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Remove
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Comparison Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <h5 className="mb-0">Detailed Comparison</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '200px' }}>Feature</th>
                {compareProducts.map((product: any) => (
                  <th key={product.id}>{product.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-medium">Price Range</td>
                {compareProducts.map((product: any) => (
                  <td key={product.id}>
                    {formatPKR(Math.min(...product.variants.map((v: any) => v.price)))} - {formatPKR(Math.max(...product.variants.map((v: any) => v.price)))}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="fw-medium">Material</td>
                {compareProducts.map((product: any) => (
                  <td key={product.id}>{product.material || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td className="fw-medium">Brand</td>
                {compareProducts.map((product: any) => (
                  <td key={product.id}>{product.brand || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td className="fw-medium">Available Sizes</td>
                {compareProducts.map((product: any) => {
                  const sizes = new Set<string>();
                  product.variants.forEach((v: any) => {
                    v.optionValues.forEach((ov: any) => {
                      if (ov.optionName === 'Size') sizes.add(ov.value);
                    });
                  });
                  return <td key={product.id}>{Array.from(sizes).join(', ') || 'N/A'}</td>;
                })}
              </tr>
              <tr>
                <td className="fw-medium">Available Colors</td>
                {compareProducts.map((product: any) => {
                  const colors = new Set<string>();
                  product.variants.forEach((v: any) => {
                    v.optionValues.forEach((ov: any) => {
                      if (ov.optionName === 'Color') colors.add(ov.value);
                    });
                  });
                  return <td key={product.id}>{Array.from(colors).join(', ') || 'N/A'}</td>;
                })}
              </tr>
              <tr>
                <td className="fw-medium">Rating</td>
                {compareProducts.map((product: any) => {
                  const avgRating = product.reviews.length > 0
                    ? (product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
                    : 'N/A';
                  return <td key={product.id}>{avgRating} / 5</td>;
                })}
              </tr>
              <tr>
                <td className="fw-medium">Reviews</td>
                {compareProducts.map((product: any) => (
                  <td key={product.id}>{product.reviews.length}</td>
                ))}
              </tr>
              <tr>
                <td className="fw-medium">Total Stock</td>
                {compareProducts.map((product: any) => {
                  const totalStock = product.variants.reduce((sum: number, v: any) => sum + v.stock, 0);
                  return (
                    <td key={product.id}>
                      <Badge bg={totalStock > 50 ? 'success' : totalStock > 20 ? 'warning' : 'danger'}>
                        {totalStock} units
                      </Badge>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="fw-medium">Category</td>
                {compareProducts.map((product: any) => {
                  const category = useStore.getState().categories.find(c => c.id === product.categoryId);
                  return <td key={product.id}>{category?.name || 'N/A'}</td>;
                })}
              </tr>
              <tr>
                <td className="fw-medium">Featured</td>
                {compareProducts.map((product: any) => (
                  <td key={product.id}>
                    {product.isFeatured ? (
                      <Badge bg="success"><i className="bi bi-check-circle"></i> Yes</Badge>
                    ) : (
                      <Badge bg="secondary">No</Badge>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
