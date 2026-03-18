import { fleetStats, geofenceAlerts, vehicles, drivers } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Truck, AlertTriangle, Wrench, Fuel, Route, Bell } from 'lucide-react';
import type { Vehicle } from '@/data/mockData';

interface StatusBarProps {
  selectedVehicle: Vehicle | null;
}

export default function StatusBar({ selectedVehicle }: StatusBarProps) {
  if (selectedVehicle) {
    const driver = drivers.find(d => d.id === selectedVehicle.driverId);
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
        className="glass-panel rounded-lg p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className={`status-dot status-${selectedVehicle.status}`} />
            <h3 className="font-semibold tracking-tight">{selectedVehicle.id} — {selectedVehicle.plate}</h3>
          </div>
          <span className="label-caps">{selectedVehicle.status}</span>
        </div>
        <div className="grid grid-cols-4 gap-4 text-xs">
          <div>
            <p className="label-caps mb-1">Coordinates</p>
            <p className="font-mono-data">{selectedVehicle.lat.toFixed(3)}° N</p>
            <p className="font-mono-data">{Math.abs(selectedVehicle.lng).toFixed(3)}° W</p>
          </div>
          <div>
            <p className="label-caps mb-1">Speed</p>
            <p className="font-mono-data text-base">{selectedVehicle.speed} <span className="text-muted-foreground text-[10px]">mph</span></p>
          </div>
          <div>
            <p className="label-caps mb-1">Fuel</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${selectedVehicle.fuelLevel}%` }}
                />
              </div>
              <span className="font-mono-data">{selectedVehicle.fuelLevel}%</span>
            </div>
          </div>
          <div>
            <p className="label-caps mb-1">Driver</p>
            <p className="text-sm">{driver?.name ?? 'Unassigned'}</p>
            {driver && <p className="font-mono-data text-muted-foreground">{driver.license}</p>}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="grid grid-cols-6 gap-3">
        <StatBlock icon={Truck} label="Active" value={fleetStats.activeVehicles} accent="text-status-active" />
        <StatBlock icon={Wrench} label="Maint." value={fleetStats.maintenanceVehicles} accent="text-status-maintenance" />
        <StatBlock icon={AlertTriangle} label="Emergency" value={fleetStats.emergencyVehicles} accent="text-status-emergency" />
        <StatBlock icon={Route} label="Active Trips" value={fleetStats.activeTrips} accent="text-primary" />
        <StatBlock icon={Fuel} label="Avg. MPG" value={fleetStats.avgFuelEfficiency} accent="text-foreground" />
        <StatBlock icon={Bell} label="Alerts" value={fleetStats.alertsToday} accent="text-status-emergency" />
      </div>
    </div>
  );
}

function StatBlock({ icon: Icon, label, value, accent }: { icon: typeof Truck; label: string; value: number; accent: string }) {
  return (
    <div className="text-center">
      <Icon className={`w-4 h-4 mx-auto mb-1 ${accent}`} />
      <p className="font-mono-data text-lg font-semibold">{value}</p>
      <p className="label-caps">{label}</p>
    </div>
  );
}
