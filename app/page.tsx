"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // To redirect after login

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: 'user',
    email: '',
    password: '',
  });

   
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  // 1. Trim inputs to remove accidental leading/trailing spaces
  const cleanEmail = formData.email.trim();
  const cleanPassword = formData.password.trim();

  // 2. Validation: Check if fields are empty after trimming
  if (!cleanEmail || !cleanPassword) {
    setError("Please enter both email and password.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('/api/Login', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,    // Send trimmed email
        password: cleanPassword, // Send trimmed password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    
    console.log("Login Success:", data);
    
    // Check if the role matches the selection
    if (data.role !== formData.role) {
      setError(`You are registered as a ${data.role}, not an ${formData.role}.`);
      setLoading(false);
      return;
    }

    // Redirect based on role
    if (data.role === 'admin') {
      router.push('/AdminPage');
    } else {
      router.push('/UserPage');
    }

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Something went wrong";
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center px-4 transition-colors">
      {/* ... (background blurs) ... */}

      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl z-10 transition-colors">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Access your anime collection</p>
        </div>

        {/* Display Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">I am an...</label>
            <select
              disabled={loading}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            >
              <option value="user">Member</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input
              disabled={loading}
              type="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              disabled={loading}
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-500 hover:underline">
            Join the community
          </Link>
        </p>
      </div>
    </div>
  );
}