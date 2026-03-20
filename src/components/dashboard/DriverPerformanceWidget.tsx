import { Star, TrendingUp } from 'lucide-react';
import { getDriverPlaceholderImage } from '@/lib/uiPlaceholders';
import { useDrivers } from '@/hooks/useDrivers';
import { useLatestDriverScores } from '@/hooks/useLatestDriverScores';

export default function DriverPerformanceWidget() {
  const { drivers } = useDrivers();
  const { latestDriverScores } = useLatestDriverScores();

  const scorecards = drivers
    .map((driver) => {
      const score = latestDriverScores.find((entry) => entry.driverId === driver.id);

      return {
        driverId: driver.id,
        driverName: driver.name,
        score: score?.score ?? Number((driver.rating * 20).toFixed(1)),
        efficiency: score?.efficiency ?? driver.avgFuelEfficiency,
        tripsCompleted: score?.tripsCompleted ?? driver.tripsCompleted,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="glass-panel glass-shine rounded-lg p-5 h-full">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="label-caps mb-1">Driver Performance</p>
          <h3 className="text-lg font-semibold tracking-tight">Faker Scorecards</h3>
        </div>
        <TrendingUp className="h-5 w-5 flex-shrink-0 text-primary" />
      </div>
      <div className="space-y-3">
        {scorecards.map((driver, index) => {
          const ratingPct = Math.min(100, driver.score);

          return (
            <div key={driver.driverId} className="flex items-start gap-3 sm:items-center">
              <span className="w-5 pt-1 font-mono-data text-[10px] text-muted-foreground sm:pt-0">#{index + 1}</span>
              <img
                src={getDriverPlaceholderImage(driver.driverId)}
                alt={driver.driverName}
                className="h-10 w-10 rounded-full object-cover border border-border/60"
              />
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="truncate text-xs font-semibold">{driver.driverName}</span>
                  <div className="flex items-center gap-1 text-status-maintenance sm:justify-end">
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
                <div className="mt-1 flex flex-col gap-1 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
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
