'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// This page uses its own layout, not the admin layout
export const dynamic = 'force-dynamic';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        // Store user data in localStorage for client-side access
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        router.push('/admin/dashboard');
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Invalid credentials' }));
        setError(errorData.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-serif text-[#2D2A26] mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-2">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@arabeddings.com" 
              required 
              disabled={loading}
              className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265] disabled:bg-gray-100" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4A32] mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter your password" 
                required 
                disabled={loading}
                className="w-full px-4 py-3 border border-[#E8DFD5] rounded-xl focus:outline-none focus:border-[#C4A265] disabled:bg-gray-100" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A09080] hover:text-[#5C4A32]"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#2D2A26] text-white py-3 rounded-xl font-medium hover:bg-[#C4A265] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <div className="mt-6 p-4 bg-[#FDF8F3] rounded-lg">
          <p className="text-xs text-[#5C4A32] font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-[#A09080]">Email: admin@arabeddings.com</p>
          <p className="text-xs text-[#A09080]">Password: password</p>
        </div>
      </div>
    </div>
  );
}
