import { vehicles } from '@/data/mockData';
import { Wrench, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const today = new Date('2026-03-16');

const maintenanceData = vehicles.map(v => {
  const lastServiceDate = new Date(v.lastService);
  const daysSinceService = differenceInDays(today, lastServiceDate);
  const nextServiceMiles = Math.ceil(v.odometer / 10000) * 10000;
  const milesUntilService = nextServiceMiles - v.odometer;
  const urgency: 'critical' | 'warning' | 'ok' =
    v.status === 'maintenance' ? 'critical'
    : daysSinceService > 30 || milesUntilService < 1000 ? 'warning'
    : 'ok';
  return {
    ...v,
    daysSinceService,
    nextServiceMiles,
    milesUntilService,
    urgency,
  };
}).sort((a, b) => {
  const order = { critical: 0, warning: 1, ok: 2 };
  return order[a.urgency] - order[b.urgency];
});

const urgencyConfig = {
  critical: { icon: AlertTriangle, dotClass: 'status-emergency', label: 'Needs Service' },
  warning: { icon: Clock, dotClass: 'status-maintenance', label: 'Due Soon' },
  ok: { icon: CheckCircle, dotClass: 'status-active', label: 'OK' },
};

export default function MaintenanceAlertsWidget() {
  const criticalCount = maintenanceData.filter(v => v.urgency === 'critical').length;
  const warningCount = maintenanceData.filter(v => v.urgency === 'warning').length;

  return (
    <div className="glass-panel glass-shine rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="label-caps mb-1">Maintenance Alerts</p>
          <h3 className="text-lg font-semibold tracking-tight">
            {criticalCount + warningCount} Vehicle{criticalCount + warningCount !== 1 ? 's' : ''} Need Attention
          </h3>
        </div>
        <Wrench className="w-5 h-5 text-status-maintenance" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left label-caps py-2 pr-4">Vehicle</th>
              <th className="text-left label-caps py-2 pr-4">Status</th>
              <th className="text-left label-caps py-2 pr-4">Last Service</th>
              <th className="text-right label-caps py-2 pr-4">Odometer</th>
              <th className="text-right label-caps py-2">Next Service</th>
            </tr>
          </thead>
          <tbody>
            {maintenanceData.map((v) => {
              const config = urgencyConfig[v.urgency];
              return (
                <tr key={v.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{v.id}</span>
                      <span className="font-mono-data text-muted-foreground">{v.plate}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{v.make} {v.model}</p>
                  </td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`status-dot ${config.dotClass}`} />
                      <span>{config.label}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="font-mono-data">{format(new Date(v.lastService), 'MMM dd, yyyy')}</span>
                    <p className="text-[10px] text-muted-foreground">{v.daysSinceService}d ago</p>
                  </td>
                  <td className="py-2.5 pr-4 text-right font-mono-data">
                    {v.odometer.toLocaleString()} mi
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="font-mono-data">{v.nextServiceMiles.toLocaleString()} mi</span>
                    <p className={`text-[10px] font-mono-data ${
                      v.milesUntilService < 1000 ? 'text-status-emergency' : 'text-muted-foreground'
                    }`}>
                      {v.milesUntilService.toLocaleString()} mi left
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
