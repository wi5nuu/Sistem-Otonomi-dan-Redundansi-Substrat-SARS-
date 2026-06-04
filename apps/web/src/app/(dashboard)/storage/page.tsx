'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, HardDrive, Shield, CheckCircle, XCircle } from 'lucide-react';

const tiers = [
  { name: 'HOT', used: 128, total: 200, color: 'bg-red-500' },
  { name: 'WARM', used: 512, total: 1024, color: 'bg-yellow-500' },
  { name: 'COLD', used: 2048, total: 8192, color: 'bg-blue-500' },
  { name: 'ARCHIVE', used: 4096, total: 16384, color: 'bg-green-500' },
];

const iopsMetrics = [
  { label: 'Read IOPS', value: 12450, peak: 15200 },
  { label: 'Write IOPS', value: 8730, peak: 11000 },
  { label: 'Latency (ms)', value: 2.4, peak: 8.1 },
  { label: 'Throughput (MB/s)', value: 480, peak: 720 },
];

const integrityChecks = [
  { name: 'Weekly scrub', status: 'passed', lastRun: '2h ago' },
  { name: 'Checksum validation', status: 'passed', lastRun: '6h ago' },
  { name: 'Replication check', status: 'warning', lastRun: '1d ago' },
  { name: 'Snapshot integrity', status: 'passed', lastRun: '12h ago' },
  { name: 'RAID consistency', status: 'failed', lastRun: '4h ago' },
];

export default function StoragePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sars-100">Storage</h1>
        <p className="text-sm text-sars-400">Capacity, performance, and data integrity</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => (
          <Card key={tier.name} className="border-sars-800/50 bg-sars-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-sars-400">
                {tier.name}
              </CardTitle>
              <Database className="h-4 w-4 text-sars-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sars-100">
                {tier.used}TB / {tier.total}TB
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-sars-800">
                <div
                  className={`h-full rounded-full ${tier.color}`}
                  style={{ width: `${(tier.used / tier.total) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-sars-500">
                {Math.round((tier.used / tier.total) * 100)}% utilized
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sars-100">
              <HardDrive className="h-5 w-5 text-sars-400" /> IOPS Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {iopsMetrics.map((metric) => (
              <div key={metric.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sars-300">{metric.label}</span>
                  <span className="text-sars-400">
                    {metric.value} / {metric.peak} peak
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-sars-800">
                  <div
                    className="h-full rounded-full bg-sars-600"
                    style={{ width: `${(metric.value / metric.peak) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sars-100">
              <Shield className="h-5 w-5 text-sars-400" /> Integrity Check Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {integrityChecks.map((check) => (
                <div
                  key={check.name}
                  className="flex items-center justify-between rounded-lg border border-sars-800/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    {check.status === 'passed' ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : check.status === 'warning' ? (
                      <XCircle className="h-4 w-4 text-yellow-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-sars-100">{check.name}</p>
                      <p className="text-xs text-sars-500">Last run: {check.lastRun}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      check.status === 'passed'
                        ? 'default'
                        : check.status === 'warning'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {check.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
