import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const incidents = [
  { id: '1', title: 'Node cluster degradation in us-east', severity: 'P2', status: 'IN_PROGRESS', time: '2m ago' },
  { id: '2', title: 'Network latency spike on transatlantic link', severity: 'P3', status: 'TRIAGED', time: '15m ago' },
  { id: '3', title: 'UPS battery low in Frankfurt DC', severity: 'P2', status: 'DETECTED', time: '1h ago' },
  { id: '4', title: 'Certificate expiration warning for *.sars.io', severity: 'P4', status: 'RESOLVED', time: '3h ago' },
  { id: '5', title: 'Storage cluster 80% capacity in Tokyo', severity: 'P3', status: 'RESOLVED', time: '6h ago' },
];

export function RecentIncidents() {
  return (
    <div className="rounded-lg border border-sars-800 bg-sars-900">
      <div className="border-b border-sars-800 p-4">
        <h3 className="font-semibold">Recent Incidents</h3>
      </div>
      <div className="divide-y divide-sars-800">
        {incidents.map((incident) => (
          <div key={incident.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {incident.status === 'RESOLVED' ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : incident.status === 'IN_PROGRESS' ? (
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
              ) : (
                <Clock className="h-4 w-4 text-sars-400" />
              )}
              <div>
                <p className="text-sm text-white">{incident.title}</p>
                <p className="text-xs text-sars-400">{incident.severity} · {incident.time}</p>
              </div>
            </div>
            <span className={`rounded px-2 py-0.5 text-xs font-medium ${
              incident.status === 'RESOLVED'
                ? 'bg-green-900 text-green-300'
                : incident.status === 'IN_PROGRESS'
                ? 'bg-yellow-900 text-yellow-300'
                : 'bg-sars-800 text-sars-300'
            }`}>
              {incident.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
