'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yprybofxbbqqulmpydtq.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_FCgPg24cKrKlBGLMfiS-Tw_nmpMywQG';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        localStorage.setItem('is_admin_logged_in', 'true');
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50/50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#003B1D] text-amber-300 font-black text-xl flex items-center justify-center mx-auto shadow-md">
            P
          </div>
          <h1 className="text-xl font-black text-slate-900">Admin Login</h1>
          <p className="text-xs text-slate-500">Sign in to manage website contents and CMS settings.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              suppressHydrationWarning={true}
              className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006633] text-slate-900 text-sm font-medium bg-emerald-50/30"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              suppressHydrationWarning={true}
              className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006633] text-slate-900 text-sm font-medium bg-emerald-50/30"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            suppressHydrationWarning={true}
            className="w-full py-3.5 bg-[#006633] hover:bg-[#004D26] text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}