'use client';

import React, { useState } from 'react';
import { X, Lock, User, ShieldCheck, UserPlus, LogIn, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Form states
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'FARMER' | 'BUYER'>('FARMER');
  const [district, setDistrict] = useState('Nuwara Eliya');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const endpoint = mode === 'LOGIN' ? '/api/auth/login' : '/api/auth/register';
      const bodyPayload =
        mode === 'LOGIN'
          ? { name, password }
          : { name, password, role, district, phoneNumber };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Authentication failed');
      } else {
        localStorage.setItem('agriprice_token', data.token);
        localStorage.setItem('agriprice_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.token);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage('Network or server connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel rounded-2xl p-6 border border-gray-700 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mb-6 bg-gray-900/90 p-1.5 rounded-xl border border-gray-800">
          <button
            onClick={() => {
              setMode('LOGIN');
              setErrorMessage('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'LOGIN'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
          <button
            onClick={() => {
              setMode('REGISTER');
              setErrorMessage('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'REGISTER'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          {mode === 'LOGIN' ? 'Welcome Back to AgriPrice' : 'Create an Account'}
        </h3>
        <p className="text-xs text-gray-400 mb-6">
          {mode === 'LOGIN'
            ? 'Sign in with your Name and Password to access direct market rates & post listings.'
            : 'Join Sri Lanka’s direct farmer-buyer network with name and password authentication.'}
        </p>

        {errorMessage && (
          <div className="mb-4 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Name Field */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Full Name / Display Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. Sunil Shantha"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl pl-9 pr-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl pl-9 pr-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Additional Registration Fields */}
          {mode === 'REGISTER' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="FARMER">Farmer Producer</option>
                    <option value="BUYER">Wholesale / Retail Buyer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                    <option value="Badulla">Badulla</option>
                    <option value="Matale">Matale</option>
                    <option value="Colombo">Colombo</option>
                    <option value="Anuradhapura">Anuradhapura</option>
                    <option value="Kandy">Kandy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="+94 77 123 4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2"
          >
            {mode === 'LOGIN' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{loading ? 'Authenticating...' : mode === 'LOGIN' ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
