'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@sars/uicard';
import { Badge } from '@sars/uibadge';
import { Zap, Battery, Sun, Fuel, Droplets, TrendingUp } from 'lucide-react';

const sources = [
  { name: 'Solar', percentage: 34, icon: Sun, color: 'bg-yellow-500' },
  { name: 'Grid', percentage: 31, icon: Zap, color: 'bg-blue-500' },
  { name: 'Hydro', percentage: 22, icon: Droplets, color: 'bg-cyan-500' },
  { name: 'Diesel', percentage: 13, icon: Fuel, color: 'bg-orange-500' },
];

const upsUnits = [
  { name: 'UPS-A', status: 'online', charge: 96, load: 34 },
  { name: 'UPS-B', status: 'online', charge: 88, load: 41 },
  { name: 'UPS-C', status: 'maintenance', charge: 100, load: 0 },
  { name: 'UPS-D', status: 'online', charge: 72, load: 53 },
];

const timeline = [
  { label: '00:00', usage: 42 },
  { label: '04:00', usage: 38 },
  { label: '08:00', usage: 55 },
  { label: '12:00', usage: 68 },
  { label: '16:00', usage: 72 },
  { label: '20:00', usage: 58 },
  { label: 'Now', usage: 61 },
];

const maxUsage = Math.max(...timeline.map((t) => t.usage));

export default function EnergyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sars-100">Energy</h1>
        <p className="text-sm text-sars-400">Power mix, UPS status, and consumption</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {sources.map((source) => (
          <Card key={source.name} className="border-sars-800/50 bg-sars-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-sars-400">
                {source.name}
              </CardTitle>
              <source.icon className="h-4 w-4 text-sars-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sars-100">{source.percentage}%</div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-sars-800">
                <div
                  className={`h-full rounded-full ${source.color}`}
                  style={{ width: `${source.percentage}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sars-100">
              <Battery className="h-5 w-5 text-sars-400" /> UPS Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upsUnits.map((ups) => (
              <div key={ups.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-sars-100">{ups.name}</span>
                    <Badge
                      variant={
                        ups.status === 'online'
                          ? 'default'
                          : ups.status === 'maintenance'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {ups.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-sars-400">
                    Load: {ups.load}%
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-sars-800">
                      <div
                        className={`h-full rounded-full ${
                          ups.charge > 80
                            ? 'bg-green-500'
                            : ups.charge > 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${ups.charge}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-sars-500">{ups.charge}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sars-100">
              <TrendingUp className="h-5 w-5 text-sars-400" /> Power Consumption (kW)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2" style={{ height: 160 }}>
              {timeline.map((point) => (
                <div key={point.label} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-sars-600 transition-all"
                    style={{
                      height: `${(point.usage / maxUsage) * 140}px`,
                    }}
                  />
                  <span className="text-xs text-sars-500">{point.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg border border-sars-800/50 px-4 py-3">
              <span className="text-sm text-sars-400">Current draw</span>
              <span className="text-lg font-bold text-sars-100">61 kW</span>
              <span className="text-sm text-yellow-400">72% capacity</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
