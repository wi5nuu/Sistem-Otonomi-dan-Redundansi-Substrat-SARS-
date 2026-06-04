'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, FileText, CheckSquare, Clock, User, AlertCircle } from 'lucide-react';

const pendingApprovals = [
  { id: 'REQ-1024', title: 'Deploy v3.2.1 to production', requester: 'alice@corp', submitted: '1h ago', priority: 'high' },
  { id: 'REQ-1023', title: 'Provision new compute cluster', requester: 'bob@corp', submitted: '3h ago', priority: 'medium' },
  { id: 'REQ-1022', title: 'Firewall rule change: allow 10.0.5.0/24', requester: 'carol@corp', submitted: '5h ago', priority: 'low' },
  { id: 'REQ-1021', title: 'Rotate database credentials', requester: 'dave@corp', submitted: '6h ago', priority: 'critical' },
  { id: 'REQ-1020', title: 'Add S3 bucket replication rule', requester: 'eve@corp', submitted: '8h ago', priority: 'medium' },
];

const auditSummary = [
  { action: 'User role modified', actor: 'admin@corp', target: 'jdoe@corp', timestamp: '12m ago' },
  { action: 'Deployment approved', actor: 'lead@corp', target: 'web-v3.2.1', timestamp: '45m ago' },
  { action: 'API key generated', actor: 'svc-account', target: 'monitoring-prod', timestamp: '2h ago' },
  { action: 'Config change pushed', actor: 'ci-cd-bot', target: 'nginx/ingress', timestamp: '4h ago' },
  { action: 'Secret rotated', actor: 'vault-bot', target: 'db/prod', timestamp: '6h ago' },
];

const complianceOverview = [
  { framework: 'SOC 2 Type II', status: 'compliant', lastAudit: '2026-03-15' },
  { framework: 'ISO 27001:2022', status: 'compliant', lastAudit: '2026-02-01' },
  { framework: 'PCI DSS v4.0', status: 'compliant', lastAudit: '2026-04-10' },
  { framework: 'GDPR', status: 'partial', lastAudit: '2025-12-20' },
  { framework: 'FedRAMP Moderate', status: 'non-compliant', lastAudit: '2026-01-05' },
];

export default function GovernancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sars-100">Governance</h1>
        <p className="text-sm text-sars-400">Approvals, audit log, and compliance</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sars-100">
              <CheckSquare className="h-5 w-5 text-sars-400" /> Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingApprovals.map((req) => (
              <div
                key={req.id}
                className="rounded-lg border border-sars-800/50 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-sars-500">{req.id}</span>
                  <Badge
                    variant={
                      req.priority === 'critical'
                        ? 'destructive'
                        : req.priority === 'high'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {req.priority}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-sars-100">{req.title}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-sars-500">
                  <User className="h-3 w-3" />
                  {req.requester}
                  <span>&middot;</span>
                  <Clock className="h-3 w-3" />
                  {req.submitted}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sars-100">
              <FileText className="h-5 w-5 text-sars-400" /> Audit Log
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {auditSummary.map((entry, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-sars-600" />
                <div className="flex-1">
                  <p className="text-sm text-sars-100">{entry.action}</p>
                  <p className="text-xs text-sars-500">
                    by {entry.actor} on {entry.target}
                  </p>
                  <p className="text-xs text-sars-500">{entry.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sars-100">
              <ShieldCheck className="h-5 w-5 text-sars-400" /> Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {complianceOverview.map((item) => (
              <div
                key={item.framework}
                className="rounded-lg border border-sars-800/50 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-sars-100">
                    {item.framework}
                  </span>
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
                <p className="mt-1 text-xs text-sars-500">
                  Last audit: {item.lastAudit}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
