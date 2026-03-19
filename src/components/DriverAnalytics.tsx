import { trips } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Star, Route, Fuel, TrendingUp, Shield, UserRound } from 'lucide-react';
import { getDriverPlaceholderImage } from '@/lib/uiPlaceholders';
import { useManagedUsers } from '@/hooks/useManagedUsers';
import { useDrivers } from '@/hooks/useDrivers';
import { latestDriverScores } from '@/data/mockAnalytics';

export default function DriverAnalytics() {
  const { users } = useManagedUsers();
  const { drivers } = useDrivers();
  const driverUsers = users.filter((user) => user.role === 'driver');

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <p className="label-caps mb-1">Driver Performance</p>
        <h3 className="font-semibold tracking-tight">{driverUsers.length} Drivers</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {driverUsers.map((user, index) => {
          const driverRecord = drivers.find((entry) => entry.id === user.id);
          const driverScore = latestDriverScores.find((entry) => entry.driverName === user.name);
          const activeTrip = trips.find((trip) => trip.driverId === user.id && trip.status === 'active');

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.15, ease: [0.2, 0, 0, 1] }}
              className="p-3 rounded-md hover:bg-accent transition-colors duration-150"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={getDriverPlaceholderImage(user.id)}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover border border-border/60"
                  />
                  <div>
                    <span className="font-semibold text-sm">{user.name}</span>
                    <span className="ml-2 font-mono-data text-[10px] text-muted-foreground">{user.role}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-status-maintenance">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="font-mono-data text-xs">{driverScore?.score ?? 'N/A'}</span>
                </div>
              </div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Route className="w-3 h-3" />
                  <span className="font-mono-data">{driverScore?.tripsCompleted ?? driverRecord?.tripsCompleted ?? 0} trips</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="w-3 h-3" />
                  <span className="font-mono-data">{user.status}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  {user.role === 'driver' ? <Fuel className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                  <span className="font-mono-data">
                    {driverScore?.efficiency ?? driverRecord?.avgFuelEfficiency ?? '--'}
                    {driverScore || driverRecord ? ' MPG' : ''}
                  </span>
                </div>
              </div>
              {activeTrip ? (
                <div className="mt-2 px-2 py-1 rounded bg-primary/10 text-primary text-[10px] flex items-center gap-1">
                  <span className="status-dot status-active" />
                  <span>En route - {activeTrip.startLocation}</span>
                </div>
              ) : (
                <div className="mt-2 px-2 py-1 rounded bg-accent/40 text-muted-foreground text-[10px] flex items-center gap-1">
                  <UserRound className="w-3 h-3" />
                  <span>{user.role === 'driver' ? 'Standing by for dispatch' : 'Supervision and access control'}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
