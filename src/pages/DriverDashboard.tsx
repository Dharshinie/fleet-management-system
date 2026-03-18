import { useState } from 'react';
import { drivers, vehicles, trips } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  Truck, Play, Square, MapPin, Star, Fuel, Clock, Route, ChevronRight, Map
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
};

const currentDriver = drivers[0];
const assignedVehicle = vehicles.find(v => v.id === currentDriver.assignedVehicleId)!;
const driverTrips = trips.filter(t => t.driverId === currentDriver.id);
const activeTrip = driverTrips.find(t => t.status === 'active');
const completedTrips = driverTrips.filter(t => t.status === 'completed');

const assignedRoutes = [
  { id: 'R-01', from: 'Depot A — Newark, NJ', to: 'Client Site — Queens, NY', distance: '89.3 mi', eta: '2h 15m' },
  { id: 'R-02', from: 'Warehouse B — Brooklyn, NY', to: 'Distribution Center — Bronx, NY', distance: '42.1 mi', eta: '1h 05m' },
  { id: 'R-03', from: 'Hub C — Manhattan, NY', to: 'Port — Elizabeth, NJ', distance: '65.7 mi', eta: '1h 40m' },
];

const DriverDashboard = () => {
  const [tripActive, setTripActive] = useState(!!activeTrip);
  const [tripStartTime, setTripStartTime] = useState<Date | null>(activeTrip ? new Date(activeTrip.startTime) : null);

  const ratingPct = (currentDriver.rating / 5) * 100;

  const handleStartTrip = () => {
    setTripActive(true);
    setTripStartTime(new Date());
    toast({ title: 'Trip Started', description: `Vehicle ${assignedVehicle.plate} is now active.` });
  };

  const handleEndTrip = () => {
    setTripActive(false);
    setTripStartTime(null);
    toast({ title: 'Trip Ended', description: 'Trip has been logged successfully.' });
  };

  const elapsed = tripStartTime
    ? Math.floor((Date.now() - tripStartTime.getTime()) / 60000)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      <main className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Driver Info Card */}
        <motion.div {...fadeUp} className="glass-panel glass-shine rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-semibold text-base">{currentDriver.name}</h2>
              <p className="font-mono-data text-[10px] text-muted-foreground">{currentDriver.license}</p>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px]">
              {assignedVehicle.plate}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="glass-inner p-2.5">
              <Route className="w-4 h-4 mx-auto text-primary mb-1" />
              <p className="font-mono-data text-sm font-semibold">{currentDriver.tripsCompleted}</p>
              <p className="text-[9px] text-muted-foreground">Trips</p>
            </div>
            <div className="glass-inner p-2.5">
              <Fuel className="w-4 h-4 mx-auto text-status-maintenance mb-1" />
              <p className="font-mono-data text-sm font-semibold">{currentDriver.avgFuelEfficiency}</p>
              <p className="text-[9px] text-muted-foreground">MPG</p>
            </div>
            <div className="glass-inner p-2.5">
              <MapPin className="w-4 h-4 mx-auto text-status-active mb-1" />
              <p className="font-mono-data text-sm font-semibold">{currentDriver.totalDistance.toLocaleString()}</p>
              <p className="text-[9px] text-muted-foreground">Miles</p>
            </div>
          </div>
        </motion.div>

        {/* Trip Control */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }} className="glass-panel glass-shine rounded-lg p-4">
          <p className="label-caps mb-3">Trip Control</p>
          {tripActive ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="status-dot status-active animate-pulse-glow" />
                  <span className="text-sm font-semibold text-status-active">Trip In Progress</span>
                </div>
                <span className="font-mono-data text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {elapsed} min
                </span>
              </div>
              <div className="glass-inner p-3 space-y-1">
                <p className="text-xs text-muted-foreground">Vehicle</p>
                <p className="font-mono-data text-sm">{assignedVehicle.make} {assignedVehicle.model} · {assignedVehicle.plate}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Fuel className="w-3 h-3 text-muted-foreground" />
                  <div className="flex-1">
                    <Progress value={assignedVehicle.fuelLevel} className="h-1.5" />
                  </div>
                  <span className="font-mono-data text-[10px] text-muted-foreground">{assignedVehicle.fuelLevel}%</span>
                </div>
              </div>
              <Button variant="destructive" className="w-full gap-2" onClick={handleEndTrip}>
                <Square className="w-4 h-4" />
                End Trip
              </Button>
            </div>
          ) : (
            <Button className="w-full gap-2 h-12 text-base" onClick={handleStartTrip}>
              <Play className="w-5 h-5" />
              Start Trip
            </Button>
          )}
        </motion.div>

        {/* Driver Score */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="glass-panel glass-shine rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="label-caps">Driver Score</p>
            <div className="flex items-center gap-1 text-status-maintenance">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-mono-data text-lg font-semibold">{currentDriver.rating}</span>
              <span className="text-[10px] text-muted-foreground">/5.0</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${ratingPct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-full bg-primary"
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono-data">
            <span>Safety · Efficiency · Timeliness</span>
            <span>{ratingPct.toFixed(0)}%</span>
          </div>
        </motion.div>

        {/* Assigned Routes */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="glass-panel glass-shine rounded-lg p-4">
          <p className="label-caps mb-3">Assigned Routes</p>
          <div className="space-y-2">
            {assignedRoutes.map(route => (
              <div key={route.id} className="glass-inner p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs mb-1">
                    <MapPin className="w-3 h-3 text-status-active flex-shrink-0" />
                    <span className="truncate">{route.from}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <MapPin className="w-3 h-3 text-status-emergency flex-shrink-0" />
                    <span className="truncate">{route.to}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono-data text-xs font-semibold">{route.distance}</p>
                  <p className="font-mono-data text-[10px] text-muted-foreground">{route.eta}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Trips */}
        {completedTrips.length > 0 && (
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }} className="glass-panel glass-shine rounded-lg p-4">
            <p className="label-caps mb-3">Recent Trips</p>
            <div className="space-y-2">
              {completedTrips.map(trip => (
                <div key={trip.id} className="glass-inner p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium">{trip.startLocation}</p>
                    <p className="text-[10px] text-muted-foreground">→ {trip.endLocation}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono-data text-xs">{trip.distance} mi</p>
                    <p className="font-mono-data text-[10px] text-muted-foreground">{trip.fuelConsumed} gal</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default DriverDashboard;
