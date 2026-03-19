import { Star, TrendingUp } from 'lucide-react';
import { latestDriverScores } from '@/data/mockAnalytics';
import { getDriverPlaceholderImage } from '@/lib/uiPlaceholders';

export default function DriverPerformanceWidget() {
  return (
    <div className="glass-panel glass-shine rounded-lg p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="label-caps mb-1">Driver Performance</p>
          <h3 className="text-lg font-semibold tracking-tight">Faker Scorecards</h3>
        </div>
        <TrendingUp className="w-5 h-5 text-primary" />
      </div>
      <div className="space-y-3">
        {latestDriverScores.map((driver, index) => {
          const ratingPct = Math.min(100, driver.score);

          return (
            <div key={driver.driverId} className="flex items-center gap-3">
              <span className="font-mono-data text-[10px] text-muted-foreground w-4">#{index + 1}</span>
              <img
                src={getDriverPlaceholderImage(driver.driverId)}
                alt={driver.driverName}
                className="h-10 w-10 rounded-full object-cover border border-border/60"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold truncate">{driver.driverName}</span>
                  <div className="flex items-center gap-1 text-status-maintenance">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-mono-data text-xs">{driver.score}</span>
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
                  <span className="font-mono-data">{driver.efficiency} MPG</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
