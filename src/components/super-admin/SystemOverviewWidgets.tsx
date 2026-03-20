import { Truck, Route, Users, Fuel, AlertTriangle, Activity } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles';
import { useDrivers } from '@/hooks/useDrivers';
import { useTrips } from '@/hooks/useTrips';
import { useAnalyticsSummary } from '@/hooks/useAnalyticsSummary';

export default function SystemOverviewWidgets() {
  const { vehicles } = useVehicles();
  const { drivers } = useDrivers();
  const { trips } = useTrips();
  const { analyticsSummary } = useAnalyticsSummary();

  const kpis = [
    { label: 'Total Vehicles', value: vehicles.length, icon: Truck, accent: 'text-primary' },
    { label: 'Active Trips', value: trips.filter((trip) => trip.status === 'active').length, icon: Route, accent: 'text-status-active' },
    { label: 'Drivers Online', value: drivers.filter((driver) => driver.assignedVehicleId).length, icon: Users, accent: 'text-primary' },
    { label: 'Fuel Receipts', value: analyticsSummary.fuelReceiptCount.toLocaleString(), icon: Fuel, accent: 'text-status-maintenance' },
    { label: 'Active Alerts', value: analyticsSummary.maintenanceLogCount.toLocaleString(), icon: AlertTriangle, accent: 'text-status-emergency' },
    { label: 'System Health', value: '98.7%', icon: Activity, accent: 'text-status-active' },
  ];

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
