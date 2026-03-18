import { vehicles, type Vehicle, type VehicleStatus } from '@/data/mockData';
import { Truck, AlertTriangle, Wrench, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

const statusConfig: Record<VehicleStatus, { icon: typeof Truck; className: string; label: string }> = {
  active: { icon: Circle, className: 'status-active', label: 'Active' },
  maintenance: { icon: Wrench, className: 'status-maintenance', label: 'Maintenance' },
  emergency: { icon: AlertTriangle, className: 'status-emergency', label: 'Emergency' },
  idle: { icon: Circle, className: 'status-idle', label: 'Idle' },
};

interface VehicleSidebarProps {
  selectedVehicleId?: string | null;
  onVehicleSelect: (vehicle: Vehicle) => void;
}

export default function VehicleSidebar({ selectedVehicleId, onVehicleSelect }: VehicleSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <p className="label-caps mb-2">Fleet Roster</p>
        <h2 className="text-lg font-semibold tracking-tight">{vehicles.length} Vehicles</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {vehicles.map((vehicle, i) => {
          const config = statusConfig[vehicle.status];
          const isSelected = selectedVehicleId === vehicle.id;
          return (
            <motion.button
              key={vehicle.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03, duration: 0.15, ease: [0.2, 0, 0, 1] }}
              onClick={() => onVehicleSelect(vehicle)}
              className={`w-full text-left p-3 rounded-md transition-all duration-200 ${
                isSelected ? 'glass-panel glow-primary border-primary/20' : 'hover:bg-accent/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`status-dot ${config.className}`} />
                  <span className="font-semibold text-sm">{vehicle.id}</span>
                </div>
                <span className="font-mono-data text-[10px] text-muted-foreground">{vehicle.plate}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{vehicle.make} {vehicle.model}</span>
                <span className="font-mono-data">{vehicle.speed} mph</span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                <span className="font-mono-data">{vehicle.fuelLevel}% fuel</span>
                <span className="font-mono-data">{vehicle.odometer.toLocaleString()} mi</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
