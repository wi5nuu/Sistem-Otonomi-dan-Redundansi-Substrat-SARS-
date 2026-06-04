'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const events = [
  { id: 1, event: 'Unauthorized SSH attempt', source: '203.0.113.42', severity: 'critical', time: '2m ago' },
  { id: 2, event: 'Failed MFA challenge', source: 'jdoe@example.com', severity: 'warning', time: '8m ago' },
  { id: 3, event: 'Certificate expiring in 7 days', source: 'api.sars.local', severity: 'warning', time: '15m ago' },
  { id: 4, event: 'Port scan detected', source: '198.51.100.17', severity: 'critical', time: '23m ago' },
  { id: 5, event: 'New admin user created', source: 'admin-panel', severity: 'info', time: '1h ago' },
  { id: 6, event: 'Firewall rule modified', source: 'network-team', severity: 'info', time: '2h ago' },
  { id: 7, event: 'IDS alert: SQLi attempt', source: 'web-app-01', severity: 'critical', time: '3h ago' },
];

const certificates = [
  { name: '*.sars.local', issuer: 'Internal CA', expires: '2026-09-15', daysLeft: 103, status: 'valid' },
  { name: 'api.sars.local', issuer: 'LetsEncrypt', expires: '2026-06-12', daysLeft: 8, status: 'expiring' },
  { name: 'vpn.sars.local', issuer: 'Internal CA', expires: '2027-01-20', daysLeft: 230, status: 'valid' },
  { name: 'dr.sars.local', issuer: 'LetsEncrypt', expires: '2026-05-28', daysLeft: 0, status: 'expired' },
];

const complianceItems = [
  { standard: 'SOC 2', status: 'compliant' },
  { standard: 'ISO 27001', status: 'compliant' },
  { standard: 'PCI-DSS', status: 'compliant' },
  { standard: 'GDPR', status: 'partial' },
  { standard: 'HIPAA', status: 'non-compliant' },
];

function severityBadge(severity: string) {
  if (severity === 'critical') return <Badge variant="destructive">critical</Badge>;
  if (severity === 'warning') return <Badge variant="secondary">warning</Badge>;
  return <Badge variant="outline">info</Badge>;
}

function certStatusBadge(daysLeft: number) {
  if (daysLeft <= 0) return <Badge variant="destructive">expired</Badge>;
  if (daysLeft <= 30) return <Badge variant="secondary">expiring</Badge>;
  return <Badge variant="default">valid</Badge>;
}

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sars-100">Security</h1>
        <p className="text-sm text-sars-400">Events, certificates, and compliance</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-sars-800/50 bg-sars-900/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sars-100">
              <Shield className="h-5 w-5 text-sars-400" /> Recent Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-center justify-between rounded-lg border border-sars-800/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    {evt.severity === 'critical' ? (
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    ) : evt.severity === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    ) : (
                      <Clock className="h-4 w-4 text-sars-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-sars-100">{evt.event}</p>
                      <p className="text-xs text-sars-500">
                        {evt.source} &middot; {evt.time}
                      </p>
                    </div>
                  </div>
                  {severityBadge(evt.severity)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-sars-800/50 bg-sars-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sars-100">
                <Lock className="h-5 w-5 text-sars-400" /> Certificate Expiry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {certificates.map((cert) => (
                <div
                  key={cert.name}
                  className="flex items-center justify-between rounded-lg border border-sars-800/50 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-sars-100">{cert.name}</p>
                    <p className="text-xs text-sars-500">{cert.issuer}</p>
                    <p className="text-xs text-sars-500">{cert.daysLeft}d remaining</p>
                  </div>
                  {certStatusBadge(cert.daysLeft)}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-sars-800/50 bg-sars-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sars-100">
                <CheckCircle className="h-5 w-5 text-sars-400" /> Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {complianceItems.map((item) => (
                <div key={item.standard} className="flex items-center justify-between">
                  <span className="text-sm text-sars-300">{item.standard}</span>
                  <Badge
                    variant={
                      item.status === 'compliant'
                        ? 'default'
                        : item.status === 'partial'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
