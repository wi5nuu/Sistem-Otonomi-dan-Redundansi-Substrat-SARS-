'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertOctagon, RefreshCw, BookOpen, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const incidents = [
  { id: 'INC-0042', title: 'Primary DC cooling failure', status: 'active', severity: 'critical', region: 'us-east', age: '2h 14m' },
  { id: 'INC-0041', title: 'Storage cluster replication lag', status: 'mitigating', severity: 'warning', region: 'eu-west', age: '45m' },
  { id: 'INC-0040', title: 'DNS resolution errors', status: 'resolved', severity: 'critical', region: 'ap-southeast', age: '3h 30m' },
  { id: 'INC-0039', title: 'UPS load threshold breach', status: 'monitoring', severity: 'warning', region: 'us-west', age: '1h 12m' },
];

const failoverJobs = [
  { name: 'Database DR failover', status: 'completed', target: 'eu-west', duration: '4m 23s' },
  { name: 'Compute pool migration', status: 'running', target: 'us-west', duration: '12m 07s' },
  { name: 'Storage sync to DR site', status: 'queued', target: 'ap-southeast', duration: '--' },
  { name: 'DNS route cutover', status: 'failed', target: 'eu-west', duration: '1m 02s' },
];

const runbooks = [
  { title: 'Full DC Failover', type: 'Disaster', steps: 24, automation: true },
  { title: 'Storage Array Recovery', type: 'Storage', steps: 12, automation: true },
  { title: 'Network Core Restore', type: 'Network', steps: 18, automation: false },
  { title: 'Database Emergency Restore', type: 'Database', steps: 9, automation: true },
  { title: 'Power Sequencing Restart', type: 'Facilities', steps: 14, automation: false },
];

export default function DisasterRecoveryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sars-100">Disaster Recovery</h1>
        <p className="text-sm text-sars-400">Incidents, failover jobs, and runbook library</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sars-100">
              <AlertOctagon className="h-5 w-5 text-sars-400" /> Active Incidents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="rounded-lg border border-sars-800/50 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-sars-500">{inc.id}</span>
                    <Badge
                      variant={
                        inc.severity === 'critical'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {inc.severity}
                    </Badge>
                    <Badge
                      variant={
                        inc.status === 'active'
                          ? 'destructive'
                          : inc.status === 'mitigating'
                            ? 'secondary'
                            : inc.status === 'monitoring'
                              ? 'secondary'
                              : 'default'
                      }
                    >
                      {inc.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-sars-500">{inc.age}</span>
                </div>
                <p className="mt-1 text-sm text-sars-100">{inc.title}</p>
                <p className="text-xs text-sars-500">Region: {inc.region}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-sars-800/50 bg-sars-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sars-100">
                <RefreshCw className="h-5 w-5 text-sars-400" /> Failover Jobs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {failoverJobs.map((job) => (
                <div
                  key={job.name}
                  className="flex items-center justify-between rounded-lg border border-sars-800/50 px-4 py-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-sars-100">{job.name}</span>
                      <Badge
                        variant={
                          job.status === 'completed'
                            ? 'default'
                            : job.status === 'running'
                              ? 'secondary'
                              : job.status === 'queued'
                                ? 'outline'
                                : 'destructive'
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-sars-500">
                      Target: {job.target} &middot; {job.duration}
                    </p>
                  </div>
                  {job.status === 'running' && (
                    <RefreshCw className="h-4 w-4 animate-spin text-yellow-400" />
                  )}
                  {job.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-sars-800/50 bg-sars-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sars-100">
                <BookOpen className="h-5 w-5 text-sars-400" /> Runbook Quick Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {runbooks.map((rb) => (
                <div
                  key={rb.title}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-sars-800/50 px-4 py-3 transition-colors hover:bg-sars-800/30"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium text-sars-100">{rb.title}</p>
                      <p className="text-xs text-sars-500">
                        {rb.type} &middot; {rb.steps} steps
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {rb.automation ? (
                      <Badge variant="default">auto</Badge>
                    ) : (
                      <Badge variant="secondary">manual</Badge>
                    )}
                    <ArrowRight className="h-4 w-4 text-sars-400" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
