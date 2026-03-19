import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Fuel } from 'lucide-react';
import { fuelUsageByVehicle } from '@/data/mockAnalytics';

const getFuelColor = (gallons: number) => {
  if (gallons >= 22000) return 'hsl(0, 84%, 60%)';
  if (gallons >= 18000) return 'hsl(38, 92%, 50%)';
  return 'hsl(171, 66%, 45%)';
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  return (
    <div className="glass-panel rounded-md px-3 py-2 text-xs border border-border">
      <p className="font-semibold mb-1">{data.vehicleId} - {data.plate}</p>
      <p className="text-muted-foreground">{data.model}</p>
      <p className="font-mono-data mt-1 text-primary">{data.gallons.toLocaleString()} gal simulated</p>
    </div>
  );
};

export default function FuelConsumptionChart() {
  const avgFuel = fuelUsageByVehicle.length
    ? Math.round(fuelUsageByVehicle.reduce((sum, vehicle) => sum + vehicle.gallons, 0) / fuelUsageByVehicle.length)
    : 0;

  return (
    <div className="glass-panel glass-shine rounded-lg p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="label-caps mb-1">Simulated Fuel Receipts</p>
          <h3 className="text-lg font-semibold tracking-tight">Avg. {avgFuel.toLocaleString()} gal</h3>
        </div>
        <Fuel className="w-5 h-5 text-status-maintenance" />
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={fuelUsageByVehicle} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
            <XAxis
              dataKey="vehicleId"
              tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              axisLine={{ stroke: 'hsl(220, 15%, 18%)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              axisLine={{ stroke: 'hsl(220, 15%, 18%)' }}
              tickLine={false}
              tickFormatter={(value) => `${Math.round(value / 1000)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="gallons" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {fuelUsageByVehicle.map((entry) => (
                <Cell key={entry.vehicleId} fill={getFuelColor(entry.gallons)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
