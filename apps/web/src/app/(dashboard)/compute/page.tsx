'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@sars/uicard';
import { Badge } from '@sars/uibadge';
import { Server, Cpu, HardDrive, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const nodes = [
  { name: 'compute-node-01', status: 'online', cpu: 62, ram: 48, pods: 23 },
  { name: 'compute-node-02', status: 'online', cpu: 78, ram: 72, pods: 31 },
  { name: 'compute-node-03', status: 'degraded', cpu: 91, ram: 85, pods: 27 },
  { name: 'compute-node-04', status: 'online', cpu: 34, ram: 41, pods: 18 },
  { name: 'compute-node-05', status: 'offline', cpu: 0, ram: 0, pods: 0 },
  { name: 'compute-node-06', status: 'online', cpu: 55, ram: 63, pods: 20 },
];

export default function ComputePage() {
  const total = nodes.length;
  const online = nodes.filter((n) => n.status === 'online').length;
  const degraded = nodes.filter((n) => n.status === 'degraded').length;
  const offline = nodes.filter((n) => n.status === 'offline').length;
  const avgCpu = Math.round(nodes.reduce((s, n) => s + n.cpu, 0) / total);
  const avgRam = Math.round(nodes.reduce((s, n) => s + n.ram, 0) / total);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sars-100">Compute</h1>
        <p className="text-sm text-sars-400">Node inventory and resource utilization</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sars-400">Total Nodes</CardTitle>
            <Server className="h-4 w-4 text-sars-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sars-100">{total}</div>
          </CardContent>
        </Card>
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sars-400">Online</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{online}</div>
          </CardContent>
        </Card>
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sars-400">Degraded</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{degraded}</div>
          </CardContent>
        </Card>
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sars-400">Offline</CardTitle>
            <XCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{offline}</div>
          </CardContent>
        </Card>
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sars-400">Avg CPU/RAM</CardTitle>
            <Cpu className="h-4 w-4 text-sars-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sars-100">{avgCpu}% / {avgRam}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sars-100">
              <Cpu className="h-5 w-5 text-sars-400" /> CPU Utilization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nodes.map((node) => (
              <div key={node.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sars-300">{node.name}</span>
                  <span className="text-sars-400">{node.cpu}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-sars-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      node.cpu > 80
                        ? 'bg-red-500'
                        : node.cpu > 60
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${node.cpu}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sars-100">
              <HardDrive className="h-5 w-5 text-sars-400" /> RAM Utilization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nodes.map((node) => (
              <div key={node.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sars-300">{node.name}</span>
                  <span className="text-sars-400">{node.ram}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-sars-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      node.ram > 80
                        ? 'bg-red-500'
                        : node.ram > 60
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${node.ram}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-sars-800/50 bg-sars-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sars-100">
            <Server className="h-5 w-5 text-sars-400" /> Node Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sars-800 text-left text-sars-400">
                  <th className="pb-3 pr-4 font-medium">Node</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">CPU</th>
                  <th className="pb-3 pr-4 font-medium">RAM</th>
                  <th className="pb-3 font-medium">Pods</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((node) => (
                  <tr key={node.name} className="border-b border-sars-800/50 text-sars-300">
                    <td className="py-3 pr-4">{node.name}</td>
                    <td className="py-3 pr-4">
                      <Badge
                        variant={
                          node.status === 'online'
                            ? 'default'
                            : node.status === 'degraded'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {node.status}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">{node.cpu}%</td>
                    <td className="py-3 pr-4">{node.ram}%</td>
                    <td className="py-3">{node.pods}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
