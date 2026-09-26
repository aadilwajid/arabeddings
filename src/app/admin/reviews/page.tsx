'use client';

import { useState, useEffect } from 'react';
import { Review } from '@/types';
import { Star, Check, X, Trash2 } from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    const res = await fetch('/api/reviews');
    const data = await res.json();
    setReviews(data);
  };

  const toggleApproval = async (review: Review) => {
    await fetch('/api/reviews', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...review, approved: !review.approved })
    });
    fetchReviews();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await fetch('/api/reviews', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchReviews();
  };

  const filtered = reviews.filter(r => {
    if (filter === 'approved') return r.approved;
    if (filter === 'pending') return !r.approved;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif text-[#2D2A26]">Reviews</h2>
        <div className="flex gap-2">
          {(['all', 'approved', 'pending'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${filter === f ? 'bg-[#C4A265] text-white' : 'bg-[#F5EDE4] text-[#5C4A32]'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(review => (
          <div key={review.id} className="bg-white rounded-xl border border-[#F0E8DE] p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={i < review.rating ? 'text-[#C4A265] fill-[#C4A265]' : 'text-[#E8DFD5]'} />
                    ))}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${review.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {review.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <p className="text-sm font-medium text-[#2D2A26] mb-1">{review.customerName} <span className="text-[#A09080] font-normal">({review.customerEmail})</span></p>
                <p className="text-sm text-[#5C4A32]">{review.comment}</p>
                <p className="text-xs text-[#A09080] mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => toggleApproval(review)} className={`p-2 rounded-lg ${review.approved ? 'hover:bg-yellow-50 text-yellow-600' : 'hover:bg-green-50 text-green-600'}`} title={review.approved ? 'Unapprove' : 'Approve'}>
                  {review.approved ? <X size={16} /> : <Check size={16} />}
                </button>
                <button onClick={() => handleDelete(review.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#A09080]">No reviews found</div>
        )}
      </div>
    </div>
  );
}
