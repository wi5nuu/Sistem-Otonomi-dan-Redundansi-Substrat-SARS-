'use client';

import { useState } from 'react';
import { Activity } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="flex min-h-screen items-center justify-center bg-sars-950">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-sars-800 bg-sars-900 p-8">
        <div className="flex items-center justify-center gap-2">
          <Activity className="h-8 w-8 text-sars-400" />
          <span className="text-2xl font-bold text-white">SARS</span>
        </div>
        <h1 className="text-center text-sm text-sars-300">
          Create Account
        </h1>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-sars-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-sars-700 bg-sars-950 px-3 py-2 text-white placeholder-sars-500 focus:border-sars-400 focus:outline-none"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-sars-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-sars-700 bg-sars-950 px-3 py-2 text-white placeholder-sars-500 focus:border-sars-400 focus:outline-none"
              placeholder="admin@sars.io"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-sars-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-sars-700 bg-sars-950 px-3 py-2 text-white placeholder-sars-500 focus:border-sars-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-sars-300">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-sars-700 bg-sars-950 px-3 py-2 text-white placeholder-sars-500 focus:border-sars-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-sars-500 px-4 py-2 font-medium text-white hover:bg-sars-400 transition-colors"
          >
            Create Account
          </button>
        </form>
        <p className="text-center text-sm text-sars-400">
          Already have an account?{' '}
          <Link href="/login" className="text-sars-300 hover:text-sars-200 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
