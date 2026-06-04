'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, Radio, Activity, Wifi, WifiOff } from 'lucide-react';

const links = [
  { name: 'WAN-1 (10GbE)', status: 'active', bandwidth: 6.2, capacity: 10, latency: 12 },
  { name: 'WAN-2 (10GbE)', status: 'degraded', bandwidth: 3.1, capacity: 10, latency: 48 },
  { name: 'INTERNAL-A (40GbE)', status: 'active', bandwidth: 22.4, capacity: 40, latency: 1 },
  { name: 'INTERNAL-B (40GbE)', status: 'active', bandwidth: 31.8, capacity: 40, latency: 1 },
  { name: 'DR-LINK (1GbE)', status: 'active', bandwidth: 0.3, capacity: 1, latency: 87 },
  { name: 'PEERING-1 (100GbE)', status: 'active', bandwidth: 45.2, capacity: 100, latency: 5 },
  { name: 'PEERING-2 (100GbE)', status: 'offline', bandwidth: 0, capacity: 100, latency: 0 },
];

const latencyTiers = [
  { label: '< 5 ms', count: 3, color: 'bg-green-500' },
  { label: '5–20 ms', count: 2, color: 'bg-yellow-500' },
  { label: '20–100 ms', count: 1, color: 'bg-orange-500' },
  { label: '> 100 ms', count: 1, color: 'bg-red-500' },
];

const totalLinks = links.length;
const activeLinks = links.filter((l) => l.status === 'active').length;
const degradedLinks = links.filter((l) => l.status === 'degraded').length;
const offlineLinks = links.filter((l) => l.status === 'offline').length;

export default function NetworkPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sars-100">Network</h1>
        <p className="text-sm text-sars-400">Link status, bandwidth, and latency</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sars-400">Total Links</CardTitle>
            <Network className="h-4 w-4 text-sars-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sars-100">{totalLinks}</div>
          </CardContent>
        </Card>
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sars-400">Active</CardTitle>
            <Wifi className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{activeLinks}</div>
          </CardContent>
        </Card>
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sars-400">Degraded</CardTitle>
            <Activity className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{degradedLinks}</div>
          </CardContent>
        </Card>
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sars-400">Offline</CardTitle>
            <WifiOff className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{offlineLinks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-sars-800/50 bg-sars-900/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sars-100">
              <Radio className="h-5 w-5 text-sars-400" /> Bandwidth Utilization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {links.map((link) => (
              <div key={link.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-sars-300">{link.name}</span>
                    <Badge
                      variant={
                        link.status === 'active'
                          ? 'default'
                          : link.status === 'degraded'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {link.status}
                    </Badge>
                  </div>
                  <span className="text-sars-400">
                    {link.bandwidth} / {link.capacity} Gbps
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-sars-800">
                  <div
                    className={`h-full rounded-full ${
                      (link.bandwidth / link.capacity) > 0.7
                        ? 'bg-yellow-500'
                        : (link.bandwidth / link.capacity) > 0.9
                          ? 'bg-red-500'
                          : 'bg-sars-600'
                    }`}
                    style={{ width: `${(link.bandwidth / link.capacity) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sars-100">
              <Activity className="h-5 w-5 text-sars-400" /> Latency Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {latencyTiers.map((tier) => (
              <div key={tier.label} className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${tier.color}`} />
                <span className="flex-1 text-sm text-sars-300">{tier.label}</span>
                <span className="text-sm font-medium text-sars-100">{tier.count} links</span>
              </div>
            ))}
            <div className="mt-4 rounded-lg border border-sars-800/50 p-4">
              <p className="text-xs text-sars-500">Average latency</p>
              <p className="text-xl font-bold text-sars-100">22 ms</p>
              <p className="text-xs text-yellow-400">&uarr; 8% from last hour</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
