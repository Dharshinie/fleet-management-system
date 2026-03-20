import { geofenceAlerts, vehicles as fallbackVehicles } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Truck, AlertTriangle, Wrench, Fuel, Route, Bell } from 'lucide-react';
import type { Vehicle } from '@/data/mockData';
import { useDrivers } from '@/hooks/useDrivers';
import { useTrips } from '@/hooks/useTrips';

interface StatusBarProps {
  selectedVehicle: Vehicle | null;
  vehicles?: Vehicle[];
  alertsCount?: number;
}

export default function StatusBar({
  selectedVehicle,
  vehicles = fallbackVehicles,
  alertsCount = geofenceAlerts.length,
}: StatusBarProps) {
  const { drivers } = useDrivers();
  const { trips } = useTrips();

  if (selectedVehicle) {
    const driver = drivers.find((item) => item.id === selectedVehicle.driverId);

    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
        className="glass-panel rounded-lg p-4"
      >
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className={`status-dot status-${selectedVehicle.status}`} />
            <h3 className="truncate font-semibold tracking-tight">{selectedVehicle.id} - {selectedVehicle.plate}</h3>
          </div>
          <span className="label-caps self-start sm:self-auto">{selectedVehicle.status}</span>
        </div>
        <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="label-caps mb-1">Coordinates</p>
            <p className="font-mono-data">{selectedVehicle.lat.toFixed(3)} deg N</p>
            <p className="font-mono-data">{Math.abs(selectedVehicle.lng).toFixed(3)} deg W</p>
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

  const grouped = vehicles.reduce(
    (acc, vehicle) => {
      acc[vehicle.status] += 1;
      return acc;
    },
    { active: 0, maintenance: 0, emergency: 0, idle: 0 }
  );

  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatBlock icon={Truck} label="Active" value={grouped.active} accent="text-status-active" />
        <StatBlock icon={Wrench} label="Maint." value={grouped.maintenance} accent="text-status-maintenance" />
        <StatBlock icon={AlertTriangle} label="Emergency" value={grouped.emergency} accent="text-status-emergency" />
        <StatBlock icon={Route} label="Active Trips" value={trips.filter((trip) => trip.status === 'active').length} accent="text-primary" />
        <StatBlock
          icon={Fuel}
          label="Avg. Fuel"
          value={vehicles.length ? Math.round(vehicles.reduce((sum, vehicle) => sum + vehicle.fuelLevel, 0) / vehicles.length) : 0}
          accent="text-foreground"
        />
        <StatBlock icon={Bell} label="Alerts" value={alertsCount} accent="text-status-emergency" />
      </div>
    </div>
  );
}

function StatBlock({ icon: Icon, label, value, accent }: { icon: typeof Truck; label: string; value: number; accent: string }) {
  return (
    <div className="rounded-md bg-accent/20 px-2 py-3 text-center">
      <Icon className={`w-4 h-4 mx-auto mb-1 ${accent}`} />
      <p className="font-mono-data text-lg font-semibold">{value}</p>
      <p className="label-caps">{label}</p>
    </div>
  );
}
