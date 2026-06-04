'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Server, ArrowRight, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const regions = [
  {
    name: 'AMERICAS',
    code: 'americas',
    dcs: 8,
    online: 8,
    degraded: 0,
    offline: 0,
    status: 'healthy',
    color: 'border-l-green-500',
    flag: '🌎',
  },
  {
    name: 'EUROPE',
    code: 'europe',
    dcs: 6,
    online: 5,
    degraded: 1,
    offline: 0,
    status: 'degraded',
    color: 'border-l-yellow-500',
    flag: '🌍',
  },
  {
    name: 'APAC',
    code: 'apac',
    dcs: 5,
    online: 4,
    degraded: 0,
    offline: 1,
    status: 'degraded',
    color: 'border-l-yellow-500',
    flag: '🌏',
  },
  {
    name: 'AFRICA',
    code: 'africa',
    dcs: 2,
    online: 2,
    degraded: 0,
    offline: 0,
    status: 'healthy',
    color: 'border-l-green-500',
    flag: '🌍',
  },
  {
    name: 'ARCTIC',
    code: 'arctic',
    dcs: 1,
    online: 0,
    degraded: 0,
    offline: 1,
    status: 'offline',
    color: 'border-l-red-500',
    flag: '❄️',
  },
];

export default function RegionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sars-100">Global Regions</h1>
        <p className="text-sm text-sars-400">Datacenter overview by geographic region</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {regions.map((region) => (
          <Link key={region.code} href={`/regions/${region.code}`}>
            <Card
              className={`border-sars-800/50 bg-sars-900/50 border-l-4 ${region.color} transition-colors hover:bg-sars-800/50`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{region.flag}</span>
                  <CardTitle className="text-lg font-bold text-sars-100">
                    {region.name}
                  </CardTitle>
                </div>
                <Badge
                  variant={
                    region.status === 'healthy'
                      ? 'default'
                      : region.status === 'degraded'
                        ? 'secondary'
                        : 'destructive'
                  }
                >
                  {region.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-sars-800/30 p-2">
                    <div className="flex items-center justify-center gap-1">
                      <Server className="h-3 w-3 text-sars-400" />
                      <span className="text-lg font-bold text-sars-100">{region.dcs}</span>
                    </div>
                    <p className="text-xs text-sars-500">Datacenters</p>
                  </div>
                  <div className="rounded-lg bg-sars-800/30 p-2">
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span className="text-lg font-bold text-green-400">{region.online}</span>
                    </div>
                    <p className="text-xs text-sars-500">Online</p>
                  </div>
                  <div className="rounded-lg bg-sars-800/30 p-2">
                    <div className="flex items-center justify-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-yellow-400" />
                      <span className="text-lg font-bold text-yellow-400">{region.degraded}</span>
                    </div>
                    <p className="text-xs text-sars-500">Degraded</p>
                  </div>
                </div>
                {region.offline > 0 && (
                  <div className="mb-3 flex items-center gap-2 text-xs text-red-400">
                    <XCircle className="h-3 w-3" />
                    {region.offline} datacenter{region.offline > 1 ? 's' : ''} offline
                  </div>
                )}
                <div className="flex items-center justify-end gap-1 text-xs text-sars-400">
                  View details <ArrowRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
