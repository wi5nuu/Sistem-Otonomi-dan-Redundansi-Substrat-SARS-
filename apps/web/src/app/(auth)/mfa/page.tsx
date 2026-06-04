'use client';

import { useState } from 'react';
import { Activity, Shield } from 'lucide-react';
import Link from 'next/link';

export default function MFAPage() {
  const [code, setCode] = useState('');

  return (
    <div className="flex min-h-screen items-center justify-center bg-sars-950">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-sars-800 bg-sars-900 p-8">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-sars-400" />
          <span className="text-2xl font-bold text-white">SARS</span>
        </div>
        <h1 className="text-center text-sm text-sars-300">
          Two-Factor Authentication
        </h1>
        <p className="text-center text-xs text-sars-400">
          Enter the 6-digit code from your authenticator app
        </p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-sars-300">
              Authentication Code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="mt-1 w-full rounded-lg border border-sars-700 bg-sars-950 px-3 py-2 text-center text-2xl tracking-widest text-white placeholder-sars-500 focus:border-sars-400 focus:outline-none"
              placeholder="000000"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-sars-500 px-4 py-2 font-medium text-white hover:bg-sars-400 transition-colors"
          >
            Verify
          </button>
        </form>
        <p className="text-center text-sm text-sars-400">
          <Link href="/login" className="text-sars-300 hover:text-sars-200 underline">
            Set up later
          </Link>
        </p>
      </div>
    </div>
  );
}
