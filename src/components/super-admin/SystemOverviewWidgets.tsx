import { fleetStats, drivers } from '@/data/mockData';
import { analyticsSummary } from '@/data/mockAnalytics';
import { Truck, Route, Users, Fuel, AlertTriangle, Activity } from 'lucide-react';

const kpis = [
  { label: 'Total Vehicles', value: fleetStats.totalVehicles, icon: Truck, accent: 'text-primary' },
  { label: 'Active Trips', value: fleetStats.activeTrips, icon: Route, accent: 'text-status-active' },
  { label: 'Drivers Online', value: drivers.filter(d => d.assignedVehicleId).length, icon: Users, accent: 'text-primary' },
  { label: 'Fuel Receipts', value: analyticsSummary.fuelReceiptCount.toLocaleString(), icon: Fuel, accent: 'text-status-maintenance' },
  { label: 'Active Alerts', value: analyticsSummary.maintenanceLogCount.toLocaleString(), icon: AlertTriangle, accent: 'text-status-emergency' },
  { label: 'System Health', value: '98.7%', icon: Activity, accent: 'text-status-active' },
];

export default function SystemOverviewWidgets() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="glass-panel glass-shine rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="label-caps">{kpi.label}</span>
            <kpi.icon className={`w-4 h-4 ${kpi.accent}`} />
          </div>
          <p className="font-mono-data text-2xl font-semibold">{kpi.value}</p>
        </div>
      ))}
    </div>
  );
}
