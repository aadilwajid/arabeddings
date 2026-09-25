'use client';

import { useState, useEffect } from 'react';
import { Camera, Star, ThumbsUp, X } from 'lucide-react';

interface PhotoReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  photoUrl: string;
  likes: number;
  createdAt: string;
  approved: boolean;
}

const PHOTO_REVIEWS_KEY = 'ara_photo_reviews';

// Sample photo reviews
const SAMPLE_REVIEWS: PhotoReview[] = [
  {
    id: 'pr-001',
    productId: 'prod-001',
    customerName: 'Fatima A.',
    rating: 5,
    comment: 'Absolutely love these sheets! The quality is amazing and they feel so soft.',
    photoUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
    likes: 12,
    createdAt: '2026-01-15T10:00:00Z',
    approved: true
  },
  {
    id: 'pr-002',
    productId: 'prod-001',
    customerName: 'Ayesha K.',
    rating: 5,
    comment: 'Perfect fit for our king size bed. The color is exactly as shown.',
    photoUrl: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=400',
    likes: 8,
    createdAt: '2026-01-14T15:00:00Z',
    approved: true
  },
  {
    id: 'pr-003',
    productId: 'prod-002',
    customerName: 'Sara M.',
    rating: 4,
    comment: 'Very comfortable comforter. Warm but not too heavy.',
    photoUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400',
    likes: 5,
    createdAt: '2026-01-13T12:00:00Z',
    approved: true
  }
];

export function getPhotoReviews(productId: string): PhotoReview[] {
  if (typeof window === 'undefined') return SAMPLE_REVIEWS.filter(r => r.productId === productId);
  
  const saved = localStorage.getItem(PHOTO_REVIEWS_KEY);
  const allReviews: PhotoReview[] = saved ? JSON.parse(saved) : SAMPLE_REVIEWS;
  return allReviews.filter(r => r.productId === productId && r.approved);
}

export function addPhotoReview(review: Omit<PhotoReview, 'id' | 'likes' | 'createdAt' | 'approved'>): void {
  const saved = localStorage.getItem(PHOTO_REVIEWS_KEY);
  const allReviews: PhotoReview[] = saved ? JSON.parse(saved) : SAMPLE_REVIEWS;
  
  const newReview: PhotoReview = {
    ...review,
    id: `pr-${Date.now()}`,
    likes: 0,
    createdAt: new Date().toISOString(),
    approved: false // Needs admin approval
  };
  
  allReviews.push(newReview);
  localStorage.setItem(PHOTO_REVIEWS_KEY, JSON.stringify(allReviews));
}

export function likeReview(reviewId: string): void {
  const saved = localStorage.getItem(PHOTO_REVIEWS_KEY);
  const allReviews: PhotoReview[] = saved ? JSON.parse(saved) : SAMPLE_REVIEWS;
  
  const review = allReviews.find(r => r.id === reviewId);
  if (review) {
    review.likes += 1;
    localStorage.setItem(PHOTO_REVIEWS_KEY, JSON.stringify(allReviews));
  }
}

interface PhotoReviewsProps {
  productId: string;
}

export default function PhotoReviews({ productId }: PhotoReviewsProps) {
  const [reviews, setReviews] = useState<PhotoReview[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    rating: 5,
    comment: '',
    photoUrl: ''
  });

  useEffect(() => {
    setReviews(getPhotoReviews(productId));
  }, [productId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPhotoReview({
      productId,
      ...formData
    });
    setShowForm(false);
    setFormData({ customerName: '', rating: 5, comment: '', photoUrl: '' });
    setReviews(getPhotoReviews(productId));
  };

  const handleLike = (reviewId: string) => {
    likeReview(reviewId);
    setReviews(getPhotoReviews(productId));
  };

  if (reviews.length === 0 && !showForm) {
    return (
      <div className="text-center py-8">
        <Camera size={48} className="text-[#E8DFD5] mx-auto mb-3" />
        <p className="text-[#5C4A32] mb-3">Be the first to share a photo!</p>
        <button
          onClick={() => setShowForm(true)}
          className="text-[#C4A265] hover:underline font-medium"
        >
          Upload Photo Review
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium text-[#2D2A26]">Customer Photos ({reviews.length})</h4>
        <button
          onClick={() => setShowForm(true)}
          className="text-sm text-[#C4A265] hover:underline font-medium"
        >
          Add Photo
        </button>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {reviews.map(review => (
          <div key={review.id} className="group relative">
            <img
              src={review.photoUrl}
              alt={review.comment}
              className="w-full aspect-square object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-xl flex items-end">
              <div className="p-3 w-full opacity-0 group-hover:opacity-100 transition-all">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < review.rating ? 'text-[#C4A265] fill-[#C4A265]' : 'text-white/30'} />
                  ))}
                </div>
                <p className="text-white text-xs font-medium">{review.customerName}</p>
                <p className="text-white/80 text-xs line-clamp-2">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reviews with Photos */}
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="bg-[#FDF8F3] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <img
                src={review.photoUrl}
                alt={review.comment}
                className="w-20 h-20 object-cover rounded-lg shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-[#2D2A26]">{review.customerName}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < review.rating ? 'text-[#C4A265] fill-[#C4A265]' : 'text-[#E8DFD5]'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[#5C4A32] mb-2">{review.comment}</p>
                <div className="flex items-center gap-4 text-xs text-[#A09080]">
                  <button
                    onClick={() => handleLike(review.id)}
                    className="flex items-center gap-1 hover:text-[#C4A265]"
                  >
                    <ThumbsUp size={12} />
                    <span>{review.likes}</span>
                  </button>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-serif text-[#2D2A26]">Share Your Photo</h3>
              <button onClick={() => setShowForm(false)} className="text-[#A09080] hover:text-[#2D2A26]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                    >
                      <Star
                        size={24}
                        className={star <= formData.rating ? 'text-[#C4A265] fill-[#C4A265]' : 'text-[#E8DFD5]'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">Your Review</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">Photo URL</label>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  required
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:border-[#C4A265]"
                />
                <p className="text-xs text-[#A09080] mt-1">Paste a link to your photo</p>
              </div>

              <p className="text-xs text-[#A09080]">
                Your review will be visible after admin approval.
              </p>

              <button
                type="submit"
                className="w-full bg-[#C4A265] text-white py-3 rounded-xl font-medium hover:bg-[#D4B275]"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
