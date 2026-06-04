import { Server, Database, Zap, Network, Shield, AlertTriangle, Users } from 'lucide-react';

const layers = [
  { name: 'Compute', icon: Server, health: 96, color: 'text-green-400' },
  { name: 'Storage', icon: Database, health: 88, color: 'text-yellow-400' },
  { name: 'Energy', icon: Zap, health: 92, color: 'text-green-400' },
  { name: 'Network', icon: Network, health: 95, color: 'text-green-400' },
  { name: 'Security', icon: Shield, health: 78, color: 'text-yellow-400' },
  { name: 'DR', icon: AlertTriangle, health: 85, color: 'text-yellow-400' },
  { name: 'Governance', icon: Users, health: 98, color: 'text-green-400' },
];

export function LayerHealthGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
      {layers.map((layer) => (
        <div
          key={layer.name}
          className="rounded-lg border border-sars-800 bg-sars-900 p-4 transition-colors hover:border-sars-600"
        >
          <div className="flex items-center justify-between">
            <layer.icon className={`h-5 w-5 ${layer.color}`} />
            <span className="text-lg font-bold text-white">{layer.health}%</span>
          </div>
          <p className="mt-2 text-sm text-sars-300">{layer.name}</p>
        </div>
      ))}
    </div>
  );
}
