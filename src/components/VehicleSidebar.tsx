import { type Vehicle, type VehicleStatus } from '@/data/mockData';
import { useVehicles } from '@/hooks/useVehicles';
import { motion } from 'framer-motion';
import StatusIndicator from '@/components/StatusIndicator';
import { getVehiclePlaceholderImage } from '@/lib/uiPlaceholders';

const statusConfig: Record<VehicleStatus, { className: string; label: string }> = {
  active: { className: 'status-active', label: 'Active' },
  maintenance: { className: 'status-maintenance', label: 'Maintenance' },
  emergency: { className: 'status-emergency', label: 'Emergency' },
  idle: { className: 'status-idle', label: 'Idle' },
};

interface VehicleSidebarProps {
  selectedVehicleId?: string | null;
  onVehicleSelect: (vehicle: Vehicle) => void;
  vehicles?: Vehicle[];
  loading?: boolean;
}

export default function VehicleSidebar({
  selectedVehicleId,
  onVehicleSelect,
  vehicles: providedVehicles,
  loading: providedLoading,
}: VehicleSidebarProps) {
  const { vehicles: fallbackVehicles, loading: fallbackLoading } = useVehicles();
  const vehicles = providedVehicles ?? fallbackVehicles;
  const loading = providedLoading ?? fallbackLoading;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <p className="label-caps mb-2">Fleet Roster</p>
        <h2 className="text-lg font-semibold tracking-tight">
          {loading ? 'Loading...' : `${vehicles.length} Vehicles`}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {vehicles.map((vehicle, index) => {
          const config = statusConfig[vehicle.status];
          const isSelected = selectedVehicleId === vehicle.id;

          return (
            <motion.button
              key={vehicle.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03, duration: 0.15, ease: [0.2, 0, 0, 1] }}
              onClick={() => onVehicleSelect(vehicle)}
              className={`w-full text-left p-3 rounded-md transition-all duration-200 ${
                isSelected ? 'glass-panel glow-primary border-primary/20' : 'hover:bg-accent/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={getVehiclePlaceholderImage(vehicle.id)}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="h-12 w-16 rounded-md object-cover border border-border/60"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`status-dot ${config.className}`} />
                      <span className="font-semibold text-sm">{vehicle.id}</span>
                    </div>
                    <span className="font-mono-data text-[10px] text-muted-foreground">{vehicle.plate}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="truncate">{vehicle.make} {vehicle.model}</span>
                    <span className="font-mono-data">{vehicle.speed} mph</span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <StatusIndicator status={vehicle.status} className="h-4 w-4" />
                      <span>{config.label}</span>
                    </div>
                    <span className="font-mono-data">{vehicle.fuelLevel}% fuel</span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
