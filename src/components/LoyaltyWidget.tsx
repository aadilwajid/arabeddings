'use client';

import { useState, useEffect } from 'react';
import { Gift, Star, Award, TrendingUp } from 'lucide-react';

interface LoyaltyData {
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalSpent: number;
  orders: number;
}

const TIERS = {
  Bronze: { min: 0, max: 4999, color: '#CD7F32', discount: 0 },
  Silver: { min: 5000, max: 14999, color: '#C0C0C0', discount: 5 },
  Gold: { min: 15000, max: 29999, color: '#FFD700', discount: 10 },
  Platinum: { min: 30000, max: Infinity, color: '#E5E4E2', discount: 15 },
};

export function getLoyaltyData(): LoyaltyData {
  if (typeof window === 'undefined') {
    return { points: 0, tier: 'Bronze', totalSpent: 0, orders: 0 };
  }
  const saved = localStorage.getItem('ara_loyalty');
  if (saved) {
    return JSON.parse(saved);
  }
  return { points: 0, tier: 'Bronze', totalSpent: 0, orders: 0 };
}

export function addLoyaltyPoints(amount: number): LoyaltyData {
  const data = getLoyaltyData();
  const newPoints = data.points + Math.floor(amount / 100); // 1 point per Rs 100
  const newTotalSpent = data.totalSpent + amount;
  const newOrders = data.orders + 1;
  
  let newTier: LoyaltyData['tier'] = 'Bronze';
  if (newTotalSpent >= 30000) newTier = 'Platinum';
  else if (newTotalSpent >= 15000) newTier = 'Gold';
  else if (newTotalSpent >= 5000) newTier = 'Silver';
  
  const newData = { points: newPoints, tier: newTier, totalSpent: newTotalSpent, orders: newOrders };
  localStorage.setItem('ara_loyalty', JSON.stringify(newData));
  return newData;
}

export function redeemPoints(points: number): { success: boolean; discount: number; message: string } {
  const data = getLoyaltyData();
  if (data.points < points) {
    return { success: false, discount: 0, message: 'Not enough points' };
  }
  if (points < 100) {
    return { success: false, discount: 0, message: 'Minimum 100 points required' };
  }
  
  const discount = Math.floor(points / 100) * 50; // 100 points = Rs 50
  const newPoints = data.points - points;
  localStorage.setItem('ara_loyalty', JSON.stringify({ ...data, points: newPoints }));
  
  return { success: true, discount, message: `Rs ${discount} discount applied!` };
}

export default function LoyaltyWidget() {
  const [data, setData] = useState<LoyaltyData>(getLoyaltyData());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setData(getLoyaltyData());
  }, []);

  const currentTier = TIERS[data.tier];
  const nextTier = Object.entries(TIERS).find(([_, t]) => t.min > data.totalSpent);
  const progress = nextTier 
    ? ((data.totalSpent - currentTier.min) / (nextTier[1].min - currentTier.min)) * 100 
    : 100;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#C4A265] to-[#D4B275] text-white rounded-full text-sm font-medium hover:shadow-lg transition-all"
      >
        <Award size={16} />
        <span>{data.points} pts</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif text-[#2D2A26]">Loyalty Rewards</h3>
              <button onClick={() => setShowModal(false)} className="text-[#A09080] hover:text-[#2D2A26]">×</button>
            </div>

            {/* Current Tier */}
            <div className="text-center mb-6">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: currentTier.color + '20', border: `2px solid ${currentTier.color}` }}
              >
                <Star size={32} style={{ color: currentTier.color }} fill={currentTier.color} />
              </div>
              <p className="text-lg font-medium" style={{ color: currentTier.color }}>{data.tier} Member</p>
              <p className="text-sm text-[#A09080]">{data.points} points available</p>
            </div>

            {/* Progress */}
            {nextTier && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#5C4A32]">Progress to {nextTier[0]}</span>
                  <span className="text-[#C4A265] font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-[#F0E8DE] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#C4A265] to-[#D4B275] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-[#A09080] mt-1">
                  Spend Rs {(nextTier[1].min - data.totalSpent).toLocaleString()} more to reach {nextTier[0]}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-[#FDF8F3] rounded-lg">
                <TrendingUp size={20} className="mx-auto mb-1 text-[#C4A265]" />
                <p className="text-lg font-bold text-[#2D2A26]">{data.orders}</p>
                <p className="text-xs text-[#A09080]">Orders</p>
              </div>
              <div className="text-center p-3 bg-[#FDF8F3] rounded-lg">
                <Gift size={20} className="mx-auto mb-1 text-[#C4A265]" />
                <p className="text-lg font-bold text-[#2D2A26]">{data.points}</p>
                <p className="text-xs text-[#A09080]">Points</p>
              </div>
              <div className="text-center p-3 bg-[#FDF8F3] rounded-lg">
                <Star size={20} className="mx-auto mb-1 text-[#C4A265]" />
                <p className="text-lg font-bold text-[#2D2A26]">{currentTier.discount}%</p>
                <p className="text-xs text-[#A09080]">Discount</p>
              </div>
            </div>

            {/* Tier Benefits */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#2D2A26] mb-2">Tier Benefits:</p>
              {Object.entries(TIERS).map(([name, tier]) => (
                <div 
                  key={name}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    data.tier === name ? 'bg-[#C4A265]/10 border border-[#C4A265]' : 'bg-[#FDF8F3]'
                  }`}
                >
                  <span className="text-sm font-medium" style={{ color: tier.color }}>{name}</span>
                  <span className="text-xs text-[#5C4A32]">
                    {tier.discount > 0 ? `${tier.discount}% discount` : 'Start earning'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
