import { geofenceAlerts as fallbackAlerts, vehicles as fallbackVehicles, type GeofenceAlert, type Vehicle } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Bell, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { format } from 'date-fns';

interface AlertsPanelProps {
  alerts?: GeofenceAlert[];
  vehicles?: Vehicle[];
}

export default function AlertsPanel({ alerts = fallbackAlerts, vehicles = fallbackVehicles }: AlertsPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <p className="label-caps mb-1">Geofence Alerts</p>
          <h3 className="font-semibold tracking-tight">{alerts.length} Events</h3>
        </div>
        <div className="relative">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-status-emergency animate-pulse-glow" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {alerts.map((alert, index) => {
          const vehicle = vehicles.find((entry) => entry.id === alert.vehicleId);
          const isExit = alert.type === 'exit';

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.15, ease: [0.2, 0, 0, 1] }}
              className="p-3 rounded-md hover:bg-accent transition-colors duration-150"
            >
              <div className="flex items-start gap-2">
                <div className={`mt-0.5 p-1 rounded ${isExit ? 'bg-status-emergency/10 text-status-emergency' : 'bg-primary/10 text-primary'}`}>
                  {isExit ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs">{alert.vehicleId}</span>
                    <span className="font-mono-data text-[10px] text-muted-foreground">
                      {format(new Date(alert.timestamp), 'HH:mm:ss')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isExit ? 'Exited' : 'Entered'} {alert.zone}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {vehicle?.make} {vehicle?.model}
                  </p>
                  <p className="font-mono-data text-[10px] text-muted-foreground mt-0.5">
                    {alert.coordinates.lat.toFixed(3)} deg N, {Math.abs(alert.coordinates.lng).toFixed(3)} deg W
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
