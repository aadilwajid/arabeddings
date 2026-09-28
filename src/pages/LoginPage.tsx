import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../store';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Already Signed In</h1>
        <p className="mt-2 text-gray-600">You're logged in as {user.email}</p>
        <div className="mt-6 flex gap-4 justify-center">
          <Link to="/account" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">My Account</Link>
          {user.role === 'ADMIN' && <Link to="/admin" className="px-6 py-3 border rounded-lg hover:bg-gray-50">Admin</Link>}
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    const success = login(email, password);
    if (success) {
      navigate(email === 'admin@bedding.com' ? '/admin' : '/account');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🛏️</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Sign in to your LuxeBedding account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="demo@bedding.com" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700">
            <LogIn size={18} className="mr-2" /> Sign In
          </button>

          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <p className="font-medium text-gray-700 mb-2">Demo Accounts:</p>
            <p className="text-gray-600">Customer: <code className="bg-gray-200 px-1 rounded">demo@bedding.com</code></p>
            <p className="text-gray-600">Admin: <code className="bg-gray-200 px-1 rounded">admin@bedding.com</code></p>
            <p className="text-gray-500 mt-1">(Any password works for demo)</p>
          </div>
        </form>
      </div>
    </div>
  );
}
