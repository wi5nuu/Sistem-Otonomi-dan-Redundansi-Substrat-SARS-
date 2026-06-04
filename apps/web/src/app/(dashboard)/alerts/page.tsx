'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@sars/uicard';
import { Badge } from '@sars/uibadge';
import { Bell, BellOff, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const activeAlerts = [
  { id: 'ALR-8921', rule: 'CPU > 90%', target: 'compute-node-03', severity: 'critical', value: '91%', triggered: '4m ago' },
  { id: 'ALR-8920', rule: 'Disk space < 10%', target: 'storage-pool-02', severity: 'warning', value: '7.2%', triggered: '12m ago' },
  { id: 'ALR-8919', rule: 'Certificate expiry < 30d', target: 'api.sars.local', severity: 'warning', value: '8d remaining', triggered: '18m ago' },
  { id: 'ALR-8918', rule: 'Node offline > 5m', target: 'compute-node-05', severity: 'critical', value: 'offline', triggered: '32m ago' },
  { id: 'ALR-8917', rule: 'UPS on battery power', target: 'UPS-C', severity: 'warning', value: 'battery', triggered: '1h ago' },
  { id: 'ALR-8916', rule: 'Link latency > 50ms', target: 'DR-LINK', severity: 'info', value: '87ms', triggered: '2h ago' },
];

const alertRules = [
  { name: 'CPU > 90%', interval: '1m', enabled: true },
  { name: 'Memory > 85%', interval: '1m', enabled: true },
  { name: 'Disk < 10% free', interval: '5m', enabled: true },
  { name: 'Node heartbeat lost', interval: '30s', enabled: true },
  { name: 'Certificate expiry < 30d', interval: '1h', enabled: true },
  { name: 'UPS battery mode', interval: '1m', enabled: false },
  { name: 'Link latency > 50ms', interval: '5m', enabled: true },
  { name: 'Bandwidth > 80%', interval: '5m', enabled: false },
];

export default function AlertsPage() {
  const totalFiring = activeAlerts.length;
  const acknowledged = 2;
  const resolvedToday = 14;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sars-100">Alert Center</h1>
        <p className="text-sm text-sars-400">Active alerts, rules, and statistics</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sars-400">Total Firing</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{totalFiring}</div>
          </CardContent>
        </Card>
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sars-400">Acknowledged</CardTitle>
            <BellOff className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{acknowledged}</div>
          </CardContent>
        </Card>
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sars-400">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{resolvedToday}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sars-100">
              <Bell className="h-5 w-5 text-sars-400" /> Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-lg border border-sars-800/50 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-sars-500">{alert.id}</span>
                    <Badge
                      variant={
                        alert.severity === 'critical'
                          ? 'destructive'
                          : alert.severity === 'warning'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <span className="text-xs text-sars-500">{alert.triggered}</span>
                </div>
                <p className="mt-1 text-sm text-sars-100">
                  {alert.rule} &mdash; {alert.target}
                </p>
                <p className="text-xs text-sars-500">Value: {alert.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sars-100">
              <AlertTriangle className="h-5 w-5 text-sars-400" /> Alert Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alertRules.map((rule) => (
                <div
                  key={rule.name}
                  className="flex items-center justify-between rounded-lg border border-sars-800/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    {rule.enabled ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-sars-600" />
                    )}
                    <div>
                      <p className="text-sm text-sars-100">{rule.name}</p>
                      <p className="text-xs text-sars-500">Every {rule.interval}</p>
                    </div>
                  </div>
                  <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                    {rule.enabled ? 'enabled' : 'disabled'}
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
