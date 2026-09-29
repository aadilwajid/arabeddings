import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { useStore } from '../store';
import { formatPKR } from '../data/pakistan';
import { Link } from 'react-router-dom';

interface BootstrapProductCardProps {
  product: any;
}

export default function BootstrapProductCard({ product }: BootstrapProductCardProps) {
  const { toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);

  const minPrice = Math.min(...product.variants.map((v: any) => v.price));
  const maxPrice = Math.max(...product.variants.map((v: any) => v.price));
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length
    : 0;

  return (
    <Card className="border-0 shadow-sm h-100 product-card-hover">
      <div className="position-relative">
        <Link to={`/products/${product.slug}`}>
          <Card.Img 
            variant="top" 
            src={product.images[0]?.url} 
            alt={product.name}
            style={{ height: '250px', objectFit: 'cover' }}
          />
        </Link>
        
        {/* Badges */}
        <div className="position-absolute top-0 start-0 p-2">
          {product.isFeatured && (
            <Badge bg="warning" text="dark" className="me-1">Featured</Badge>
          )}
          {product.variants.some((v: any) => v.comparePrice && v.comparePrice > v.price) && (
            <Badge bg="danger">Sale</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant={inWishlist ? 'danger' : 'light'}
          size="sm"
          className="position-absolute top-0 end-0 m-2 rounded-circle"
          style={{ width: '35px', height: '35px', padding: '0' }}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
        >
          <i className={`bi bi-heart${inWishlist ? '-fill' : ''}`}></i>
        </Button>
      </div>

      <Card.Body className="d-flex flex-column">
        {product.brand && (
          <small className="text-muted text-uppercase mb-1">{product.brand}</small>
        )}
        
        <Link to={`/products/${product.slug}`} className="text-decoration-none">
          <Card.Title className="mb-2 text-dark">
            {product.name}
          </Card.Title>
        </Link>

        <Card.Text className="text-muted small mb-2">
          {product.shortDesc}
        </Card.Text>

        {/* Rating */}
        {avgRating > 0 && (
          <div className="mb-2">
            {[...Array(5)].map((_, i) => (
              <i 
                key={i}
                className={`bi bi-star${i < Math.round(avgRating) ? '-fill text-warning' : ' text-muted'}`}
                style={{ fontSize: '0.875rem' }}
              ></i>
            ))}
            <small className="text-muted ms-1">({product.reviews.length})</small>
          </div>
        )}

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <span className="h5 mb-0 text-primary fw-bold">
                {formatPKR(minPrice)}
              </span>
              {minPrice !== maxPrice && (
                <small className="text-muted ms-1">- {formatPKR(maxPrice)}</small>
              )}
            </div>
          </div>

          <Link to={`/products/${product.slug}`} className="btn btn-outline-primary w-100">
            View Options
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}
