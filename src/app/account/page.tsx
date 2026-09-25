'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // In a real app, this would call an API
      alert(isLogin ? 'Login successful! (Demo)' : 'Account created! (Demo)');
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Header cartCount={0} wishlistCount={0} onCartClick={() => window.location.href = '/'} />
      
      <div className="flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif text-[#2D2A26] mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-[#5C4A32]">
              {isLogin ? 'Sign in to your ARA Beddings account' : 'Join the ARA Beddings family'}
            </p>
          </div>

        <div className="bg-white rounded-2xl p-8 border border-[#F0E8DE]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#5C4A32] mb-2">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A09080]" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required={!isLogin}
                    placeholder="Your name"
                    className="w-full pl-12 pr-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A09080]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5C4A32] mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A09080]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A09080] hover:text-[#5C4A32]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-[#5C4A32]">Remember me</span>
                </label>
                <a href="#" className="text-[#C4A265] hover:underline">Forgot password?</a>
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D2A26] text-white py-3 rounded-xl font-medium hover:bg-[#C4A265] transition-colors disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#5C4A32]">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#C4A265] hover:underline font-medium ml-1"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
      </div>
      
      <Footer />
    </div>
  );
}
