"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      if (data.role !== 'admin') {
        setError('You are not an admin.');
        setLoading(false);
        return;
      }

      router.push('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[--background] text-[--foreground] transition-colors">
      <Navbar />
      <div className="max-w-md mx-auto py-24 px-6">
        <div className="bg-white/5 p-8 rounded-lg border border-white/5">
          <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
          <p className="text-sm text-slate-400 mb-6">Sign in with your administrator account.</p>

          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 rounded bg-slate-800 border border-slate-700" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 rounded bg-slate-800 border border-slate-700" required />
            </div>
            <div>
              <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 rounded font-semibold disabled:opacity-50">{loading ? 'Signing in...' : 'Sign In'}</button>
            </div>
          </form>

          <p className="mt-4 text-sm text-slate-400">Back to <Link href="/UserPage" className="text-blue-400">Members</Link></p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
