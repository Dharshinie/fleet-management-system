import { drivers, trips } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Star, Route, Fuel, TrendingUp } from 'lucide-react';

export default function DriverAnalytics() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <p className="label-caps mb-1">Driver Performance</p>
        <h3 className="font-semibold tracking-tight">{drivers.length} Drivers</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {drivers.map((driver, i) => {
          const activeTrip = trips.find(t => t.driverId === driver.id && t.status === 'active');
          return (
            <motion.div
              key={driver.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.15, ease: [0.2, 0, 0, 1] }}
              className="p-3 rounded-md hover:bg-accent transition-colors duration-150"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-semibold text-sm">{driver.name}</span>
                  <span className="ml-2 font-mono-data text-[10px] text-muted-foreground">{driver.id}</span>
                </div>
                <div className="flex items-center gap-1 text-status-maintenance">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="font-mono-data text-xs">{driver.rating}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Route className="w-3 h-3" />
                  <span className="font-mono-data">{driver.tripsCompleted} trips</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="w-3 h-3" />
                  <span className="font-mono-data">{driver.totalDistance.toLocaleString()} mi</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Fuel className="w-3 h-3" />
                  <span className="font-mono-data">{driver.avgFuelEfficiency} MPG</span>
                </div>
              </div>
              {activeTrip && (
                <div className="mt-2 px-2 py-1 rounded bg-primary/10 text-primary text-[10px] flex items-center gap-1">
                  <span className="status-dot status-active" />
                  <span>En route — {activeTrip.startLocation}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
