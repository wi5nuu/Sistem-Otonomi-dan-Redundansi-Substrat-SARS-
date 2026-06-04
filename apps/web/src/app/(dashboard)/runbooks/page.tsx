'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Zap, Repeat, Filter } from 'lucide-react';

const runbookCategories = ['All', 'Disaster Recovery', 'Maintenance', 'Security', 'Deployment', 'Monitoring'];

const runbooks = [
  { title: 'Full DC Failover Procedure', category: 'Disaster Recovery', steps: 24, version: '3.2', automatable: true, updated: '2w ago' },
  { title: 'Storage Array Recovery', category: 'Disaster Recovery', steps: 12, version: '2.0', automatable: true, updated: '1m ago' },
  { title: 'Emergency Database Restore', category: 'Disaster Recovery', steps: 9, version: '1.5', automatable: false, updated: '3w ago' },
  { title: 'Kubernetes Cluster Upgrade', category: 'Maintenance', steps: 18, version: '4.1', automatable: true, updated: '5d ago' },
  { title: 'SSL Certificate Rotation', category: 'Maintenance', steps: 7, version: '2.3', automatable: true, updated: '1w ago' },
  { title: 'Patch Tuesday Automation', category: 'Maintenance', steps: 14, version: '6.0', automatable: true, updated: '2d ago' },
  { title: 'Incident Response: Ransomware', category: 'Security', steps: 22, version: '1.2', automatable: false, updated: '1m ago' },
  { title: 'Firewall Rule Audit', category: 'Security', steps: 11, version: '3.0', automatable: true, updated: '3d ago' },
  { title: 'Vulnerability Scan Remediation', category: 'Security', steps: 16, version: '2.1', automatable: false, updated: '2w ago' },
  { title: 'Blue/Green Deployment', category: 'Deployment', steps: 8, version: '5.0', automatable: true, updated: '4d ago' },
  { title: 'Canary Release Rollback', category: 'Deployment', steps: 6, version: '2.0', automatable: true, updated: '1w ago' },
  { title: 'Prometheus Alert Tuning', category: 'Monitoring', steps: 5, version: '1.1', automatable: false, updated: '3w ago' },
  { title: 'Grafana Dashboard Migration', category: 'Monitoring', steps: 10, version: '2.0', automatable: true, updated: '6d ago' },
  { title: 'Log Aggregation Pipeline Restart', category: 'Monitoring', steps: 4, version: '1.0', automatable: true, updated: '1d ago' },
];

export default function RunbooksPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = runbooks.filter((rb) => {
    const matchesSearch =
      rb.title.toLowerCase().includes(search.toLowerCase()) ||
      rb.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || rb.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sars-100">Runbook Library</h1>
        <p className="text-sm text-sars-400">{runbooks.length} runbooks across all categories</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sars-500" />
          <input
            type="text"
            placeholder="Search runbooks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-sars-800 bg-sars-900 py-2 pl-10 pr-4 text-sm text-sars-100 placeholder-sars-500 focus:border-sars-600 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {runbookCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-sars-600 text-white'
                  : 'border border-sars-800 text-sars-400 hover:bg-sars-800/50 hover:text-sars-200'
              }`}
            >
              {cat === 'All' ? cat : cat}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-sars-800/50 bg-sars-900/50">
        <CardContent className="p-0">
          <div className="divide-y divide-sars-800/50">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-sars-500">
                <BookOpen className="mb-2 h-8 w-8" />
                <p className="text-sm">No runbooks match your search</p>
              </div>
            ) : (
              filtered.map((rb) => (
                <div
                  key={rb.title}
                  className="flex cursor-pointer items-center justify-between px-6 py-4 transition-colors hover:bg-sars-800/20"
                >
                  <div className="flex items-start gap-4">
                    <BookOpen className="mt-0.5 h-5 w-5 text-sars-400" />
                    <div>
                      <p className="text-sm font-medium text-sars-100">{rb.title}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-sars-500">
                        <Badge variant="secondary">{rb.category}</Badge>
                        <span>{rb.steps} steps</span>
                        <span>v{rb.version}</span>
                        <span>Updated {rb.updated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {rb.automatable ? (
                      <Badge variant="default">
                        <Zap className="mr-1 h-3 w-3" /> automatable
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Repeat className="mr-1 h-3 w-3" /> manual
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
