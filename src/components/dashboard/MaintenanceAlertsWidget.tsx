import { useMemo } from 'react';
import { Wrench, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { maintenanceLogs, maintenanceSummaryByVehicle } from '@/data/mockAnalytics';

const urgencyConfig = {
  critical: { icon: AlertTriangle, dotClass: 'status-emergency', label: 'Needs Service' },
  warning: { icon: Clock, dotClass: 'status-maintenance', label: 'Due Soon' },
  ok: { icon: CheckCircle, dotClass: 'status-active', label: 'OK' },
};

export default function MaintenanceAlertsWidget() {
  const maintenanceData = useMemo(() => {
    return maintenanceSummaryByVehicle
      .map((vehicle) => {
        const urgency: 'critical' | 'warning' | 'ok' =
          vehicle.highSeverity > 30 ? 'critical' : vehicle.totalLogs > 280 ? 'warning' : 'ok';

        return {
          ...vehicle,
          urgency,
        };
      })
      .sort((a, b) => {
        const order = { critical: 0, warning: 1, ok: 2 };
        return order[a.urgency] - order[b.urgency];
      });
  }, []);

  const criticalCount = maintenanceData.filter((vehicle) => vehicle.urgency === 'critical').length;
  const warningCount = maintenanceData.filter((vehicle) => vehicle.urgency === 'warning').length;

  return (
    <div className="glass-panel glass-shine rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="label-caps mb-1">Simulated Maintenance Alerts</p>
          <h3 className="text-lg font-semibold tracking-tight">
            {criticalCount + warningCount} Vehicles Need Attention
          </h3>
          <p className="text-xs text-muted-foreground">{maintenanceLogs.length.toLocaleString()} Faker maintenance logs loaded</p>
        </div>
        <Wrench className="w-5 h-5 text-status-maintenance" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left label-caps py-2 pr-4">Vehicle</th>
              <th className="text-left label-caps py-2 pr-4">Status</th>
              <th className="text-left label-caps py-2 pr-4">Latest Service</th>
              <th className="text-right label-caps py-2 pr-4">Total Logs</th>
              <th className="text-right label-caps py-2">High Severity</th>
            </tr>
          </thead>
          <tbody>
            {maintenanceData.map((vehicle) => {
              const config = urgencyConfig[vehicle.urgency];

              return (
                <tr key={vehicle.vehicleId} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{vehicle.vehicleId}</span>
                      <span className="font-mono-data text-muted-foreground">{vehicle.plate}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`status-dot ${config.dotClass}`} />
                      <span>{config.label}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="font-mono-data">{format(new Date(vehicle.latestServiceAt), 'MMM dd, yyyy')}</span>
                  </td>
                  <td className="py-2.5 pr-4 text-right font-mono-data">
                    {vehicle.totalLogs.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={`font-mono-data ${vehicle.highSeverity > 30 ? 'text-status-emergency' : 'text-muted-foreground'}`}>
                      {vehicle.highSeverity}
                    </span>
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
