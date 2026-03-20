import { Route, Fuel } from 'lucide-react';
import { format } from 'date-fns';
import { useTrips } from '@/hooks/useTrips';
import { useVehicles } from '@/hooks/useVehicles';
import { useDrivers } from '@/hooks/useDrivers';

export default function ActiveTripsWidget() {
  const { trips } = useTrips();
  const { vehicles } = useVehicles();
  const { drivers } = useDrivers();
  const activeTrips = trips.filter((trip) => trip.status === 'active');

  return (
    <div className="glass-panel glass-shine rounded-lg p-5 h-full">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="label-caps mb-1">Active Trips</p>
          <h3 className="text-lg font-semibold tracking-tight">{activeTrips.length} In Progress</h3>
        </div>
        <Route className="h-5 w-5 flex-shrink-0 text-status-active" />
      </div>
      <div className="space-y-3">
        {activeTrips.map((trip) => {
          const vehicle = vehicles.find((entry) => entry.id === trip.vehicleId);
          const driver = drivers.find((entry) => entry.id === trip.driverId);

          return (
            <div key={trip.id} className="glass-inner p-3">
              <div className="mb-1.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="status-dot status-active" />
                  <span className="font-semibold text-xs">{trip.vehicleId}</span>
                  {vehicle && (
                    <span className="truncate font-mono-data text-[10px] text-muted-foreground">{vehicle.plate}</span>
                  )}
                </div>
                <span className="font-mono-data text-[10px] text-muted-foreground sm:text-right">
                  {format(new Date(trip.startTime), 'HH:mm')}
                </span>
              </div>
              <p className="mb-1.5 break-words text-[11px] text-muted-foreground sm:truncate">{trip.startLocation}</p>
              <div className="flex flex-col gap-2 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-1">
                  <Route className="w-3 h-3" />
                  <span className="font-mono-data">{trip.distance} mi</span>
                </div>
                <div className="flex items-center gap-1">
                  <Fuel className="w-3 h-3" />
                  <span className="font-mono-data">{trip.fuelConsumed} gal</span>
                </div>
                {driver && (
                  <span className="text-foreground/70 sm:ml-auto sm:text-right">{driver.name}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
