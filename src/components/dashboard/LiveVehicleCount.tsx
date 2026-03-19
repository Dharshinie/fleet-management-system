import { type VehicleStatus } from '@/data/mockData';
import { Truck, Circle, Wrench, AlertTriangle } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles';

const statusConfig: Record<VehicleStatus, { label: string; icon: typeof Truck; dotClass: string }> = {
  active: { label: 'Active', icon: Circle, dotClass: 'status-active' },
  maintenance: { label: 'Maintenance', icon: Wrench, dotClass: 'status-maintenance' },
  emergency: { label: 'Emergency', icon: AlertTriangle, dotClass: 'status-emergency' },
  idle: { label: 'Idle', icon: Circle, dotClass: 'status-idle' },
};

export default function LiveVehicleCount() {
  const { vehicles, loading } = useVehicles();

  const grouped = vehicles.reduce<Record<VehicleStatus, number>>((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, { active: 0, maintenance: 0, emergency: 0, idle: 0 });

  return (
    <div className="glass-panel glass-shine rounded-lg p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="label-caps mb-1">Live Vehicle Count</p>
          <h3 className="text-lg font-semibold tracking-tight">
            {loading ? 'Loading…' : `${vehicles.length} Total`}
          </h3>
        </div>
        <Truck className="w-5 h-5 text-primary" />
      </div>
      <div className="space-y-3">
        {(Object.keys(statusConfig) as VehicleStatus[]).map((status) => {
          const config = statusConfig[status];
          const count = grouped[status];
          const pct = vehicles.length ? Math.round((count / vehicles.length) * 100) : 0;
          return (
            <div key={status}>
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className={`status-dot ${config.dotClass}`} />
                  <span>{config.label}</span>
                </div>
                <span className="font-mono-data text-muted-foreground">{count} ({pct}%)</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: `hsl(var(--status-${status}))`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
