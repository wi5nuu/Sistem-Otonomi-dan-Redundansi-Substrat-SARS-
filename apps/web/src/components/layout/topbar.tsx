'use client';

import { Bell, Search, User } from 'lucide-react';

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-sars-800 px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sars-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-80 rounded-lg border border-sars-700 bg-sars-900 py-2 pl-10 pr-4 text-sm text-white placeholder-sars-400 focus:border-sars-400 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-sars-300 hover:bg-sars-800 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <button className="flex items-center gap-2 rounded-lg p-2 text-sars-300 hover:bg-sars-800 hover:text-white transition-colors">
          <User className="h-5 w-5" />
          <span className="text-sm">Admin</span>
        </button>
      </div>
    </header>
  );
}
