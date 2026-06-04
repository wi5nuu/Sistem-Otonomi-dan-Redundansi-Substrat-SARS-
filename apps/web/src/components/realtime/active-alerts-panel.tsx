import { AlertTriangle, Bell, CheckCircle } from 'lucide-react';

const alerts = [
  { id: '1', severity: 'CRITICAL', title: 'Node 10.0.1.45 offline', message: 'Compute node has stopped responding', time: '5m ago' },
  { id: '2', severity: 'HIGH', title: 'Storage cluster near capacity', message: 'Cluster HOT-01 at 82%', time: '12m ago' },
  { id: '3', severity: 'HIGH', title: 'Certificate expiring', message: '*.sars.io expires in 7 days', time: '1h ago' },
];

export function ActiveAlertsPanel() {
  return (
    <div className="rounded-lg border border-sars-800 bg-sars-900">
      <div className="flex items-center justify-between border-b border-sars-800 p-4">
        <h3 className="font-semibold">Active Alerts</h3>
        <span className="rounded-full bg-red-900 px-2 py-0.5 text-xs text-red-300">3</span>
      </div>
      <div className="divide-y divide-sars-800">
        {alerts.map((alert) => (
          <div key={alert.id} className="p-4">
            <div className="flex items-start gap-3">
              {alert.severity === 'CRITICAL' ? (
                <AlertTriangle className="mt-0.5 h-4 w-4 text-red-400" />
              ) : (
                <Bell className="mt-0.5 h-4 w-4 text-yellow-400" />
              )}
              <div>
                <p className="text-sm font-medium text-white">{alert.title}</p>
                <p className="text-xs text-sars-400">{alert.message}</p>
                <p className="mt-1 text-xs text-sars-500">{alert.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
