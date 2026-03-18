import { trips, vehicles, drivers } from '@/data/mockData';
import { Route, Clock, Fuel } from 'lucide-react';
import { format } from 'date-fns';

export default function ActiveTripsWidget() {
  const activeTrips = trips.filter(t => t.status === 'active');

  return (
    <div className="glass-panel glass-shine rounded-lg p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="label-caps mb-1">Active Trips</p>
          <h3 className="text-lg font-semibold tracking-tight">{activeTrips.length} In Progress</h3>
        </div>
        <Route className="w-5 h-5 text-status-active" />
      </div>
      <div className="space-y-3">
        {activeTrips.map((trip) => {
          const vehicle = vehicles.find(v => v.id === trip.vehicleId);
          const driver = drivers.find(d => d.id === trip.driverId);
          return (
            <div key={trip.id} className="glass-inner p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="status-dot status-active" />
                  <span className="font-semibold text-xs">{trip.vehicleId}</span>
                  {vehicle && (
                    <span className="font-mono-data text-[10px] text-muted-foreground">{vehicle.plate}</span>
                  )}
                </div>
                <span className="font-mono-data text-[10px] text-muted-foreground">
                  {format(new Date(trip.startTime), 'HH:mm')}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mb-1.5 truncate">{trip.startLocation}</p>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Route className="w-3 h-3" />
                  <span className="font-mono-data">{trip.distance} mi</span>
                </div>
                <div className="flex items-center gap-1">
                  <Fuel className="w-3 h-3" />
                  <span className="font-mono-data">{trip.fuelConsumed} gal</span>
                </div>
                {driver && (
                  <span className="ml-auto text-foreground/70">{driver.name}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
