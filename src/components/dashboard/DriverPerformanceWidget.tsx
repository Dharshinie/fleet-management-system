import { drivers } from '@/data/mockData';
import { Star, TrendingUp } from 'lucide-react';

const sortedDrivers = [...drivers].sort((a, b) => b.rating - a.rating);

export default function DriverPerformanceWidget() {
  return (
    <div className="glass-panel glass-shine rounded-lg p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="label-caps mb-1">Driver Performance</p>
          <h3 className="text-lg font-semibold tracking-tight">Scores</h3>
        </div>
        <TrendingUp className="w-5 h-5 text-primary" />
      </div>
      <div className="space-y-3">
        {sortedDrivers.map((driver, i) => {
          const ratingPct = (driver.rating / 5) * 100;
          return (
            <div key={driver.id} className="flex items-center gap-3">
              <span className="font-mono-data text-[10px] text-muted-foreground w-4">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold truncate">{driver.name}</span>
                  <div className="flex items-center gap-1 text-status-maintenance">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-mono-data text-xs">{driver.rating}</span>
                  </div>
                </div>
                <div className="h-1 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${ratingPct}%` }}
                  />
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                  <span className="font-mono-data">{driver.tripsCompleted} trips</span>
                  <span className="font-mono-data">{driver.avgFuelEfficiency} MPG</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
