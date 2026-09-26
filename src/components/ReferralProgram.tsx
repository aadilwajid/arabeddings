'use client';

import { useState, useEffect } from 'react';
import { Gift, Copy, Check, Users, Share2 } from 'lucide-react';

interface ReferralData {
  code: string;
  totalReferrals: number;
  totalEarned: number;
}

const REFERRAL_KEY = 'ara_referral';

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'ARA-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getReferralData(): ReferralData {
  if (typeof window === 'undefined') {
    return { code: '', totalReferrals: 0, totalEarned: 0 };
  }
  const saved = localStorage.getItem(REFERRAL_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  const newData = { code: generateReferralCode(), totalReferrals: 0, totalEarned: 0 };
  localStorage.setItem(REFERRAL_KEY, JSON.stringify(newData));
  return newData;
}

export function recordReferral(): void {
  const data = getReferralData();
  data.totalReferrals += 1;
  data.totalEarned += 500; // Rs 500 per referral
  localStorage.setItem(REFERRAL_KEY, JSON.stringify(data));
}

export default function ReferralProgram() {
  const [data, setData] = useState<ReferralData>(getReferralData());
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setData(getReferralData());
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `Use my referral code ${data.code} to get Rs 500 off your first order at ARA Beddings!`;
    if (navigator.share) {
      navigator.share({ title: 'ARA Beddings Referral', text });
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all"
      >
        <Gift size={16} />
        <span>Refer & Earn</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif text-[#2D2A26]">Refer & Earn</h3>
              <button onClick={() => setShowModal(false)} className="text-[#A09080] hover:text-[#2D2A26] text-2xl">×</button>
            </div>

            {/* Hero */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Share2 size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-medium text-[#2D2A26] mb-2">Give Rs 500, Get Rs 500</h4>
              <p className="text-sm text-[#5C4A32]">
                Share your code with friends. They get Rs 500 off their first order, and you earn Rs 500 for each referral!
              </p>
            </div>

            {/* Referral Code */}
            <div className="bg-[#FDF8F3] border border-[#E8DFD5] rounded-xl p-4 mb-4">
              <p className="text-xs text-[#A09080] mb-2">Your Referral Code</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xl font-bold text-[#C4A265] tracking-wider">{data.code}</code>
                <button
                  onClick={handleCopy}
                  className="p-2 bg-white border border-[#E8DFD5] rounded-lg hover:bg-[#F5EDE4]"
                >
                  {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-[#5C4A32]" />}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-[#FDF8F3] rounded-xl">
                <Users size={24} className="mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold text-[#2D2A26]">{data.totalReferrals}</p>
                <p className="text-xs text-[#A09080]">Referrals</p>
              </div>
              <div className="text-center p-4 bg-[#FDF8F3] rounded-xl">
                <Gift size={24} className="mx-auto mb-2 text-pink-500" />
                <p className="text-2xl font-bold text-[#2D2A26]">Rs {data.totalEarned.toLocaleString()}</p>
                <p className="text-xs text-[#A09080]">Earned</p>
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Share2 size={18} />
              Share Your Code
            </button>

            {/* How it works */}
            <div className="mt-6 pt-6 border-t border-[#E8DFD5]">
              <p className="text-sm font-medium text-[#2D2A26] mb-3">How it works:</p>
              <ol className="space-y-2 text-xs text-[#5C4A32]">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <span>Share your unique referral code with friends</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <span>Friends use your code for Rs 500 off their first order</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <span>You earn Rs 500 for each successful referral</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
