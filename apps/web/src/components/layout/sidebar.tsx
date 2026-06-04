'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Server, Database, Zap, Network, Shield,
  AlertTriangle, BookOpen, Settings, Users, FileSearch,
  Globe, Activity,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Command Center', icon: LayoutDashboard },
  { href: '/compute', label: 'Compute', icon: Server },
  { href: '/storage', label: 'Storage', icon: Database },
  { href: '/energy', label: 'Energy', icon: Zap },
  { href: '/network', label: 'Network', icon: Network },
  { href: '/security', label: 'Security', icon: Shield },
  { href: '/disaster-recovery', label: 'DR', icon: AlertTriangle },
  { href: '/governance', label: 'Governance', icon: Users },
  { href: '/alerts', label: 'Alerts', icon: Activity },
  { href: '/runbooks', label: 'Runbooks', icon: BookOpen },
  { href: '/regions', label: 'Regions', icon: Globe },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-sars-800 bg-sars-950">
      <div className="flex h-16 items-center gap-2 border-b border-sars-800 px-6">
        <Activity className="h-6 w-6 text-sars-400" />
        <span className="text-lg font-bold tracking-tight">SARS</span>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-sars-800 text-white'
                  : 'text-sars-300 hover:bg-sars-800/50 hover:text-white'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
