import { GlobalHealthScore } from '@/components/charts/global-health-score';
import { ActiveAlertsPanel } from '@/components/realtime/active-alerts-panel';
import { RecentIncidents } from '@/components/dashboard/recent-incidents';
import { LayerHealthGrid } from '@/components/dashboard/layer-health-grid';

export default function CommandCenterPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
          <p className="text-sm text-sars-300">Global infrastructure overview</p>
        </div>
        <GlobalHealthScore score={94} />
      </div>
      <LayerHealthGrid />
      <div className="grid gap-6 lg:grid-cols-2">
        <ActiveAlertsPanel />
        <RecentIncidents />
      </div>
    </div>
  );
}
