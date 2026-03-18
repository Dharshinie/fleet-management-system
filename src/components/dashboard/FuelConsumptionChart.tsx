import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { vehicles } from '@/data/mockData';
import { Fuel } from 'lucide-react';

const fuelData = vehicles.map(v => ({
  name: v.id,
  plate: v.plate,
  fuelLevel: v.fuelLevel,
  model: `${v.make} ${v.model}`,
}));

const getFuelColor = (level: number) => {
  if (level <= 20) return 'hsl(0, 84%, 60%)';
  if (level <= 40) return 'hsl(38, 92%, 50%)';
  return 'hsl(171, 66%, 45%)';
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="glass-panel rounded-md px-3 py-2 text-xs border border-border">
      <p className="font-semibold mb-1">{data.name} — {data.plate}</p>
      <p className="text-muted-foreground">{data.model}</p>
      <p className="font-mono-data mt-1 text-primary">{data.fuelLevel}% fuel</p>
    </div>
  );
};

export default function FuelConsumptionChart() {
  const avgFuel = Math.round(vehicles.reduce((s, v) => s + v.fuelLevel, 0) / vehicles.length);

  return (
    <div className="glass-panel glass-shine rounded-lg p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="label-caps mb-1">Fuel Levels by Vehicle</p>
          <h3 className="text-lg font-semibold tracking-tight">Avg. {avgFuel}%</h3>
        </div>
        <Fuel className="w-5 h-5 text-status-maintenance" />
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={fuelData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              axisLine={{ stroke: 'hsl(220, 15%, 18%)' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              axisLine={{ stroke: 'hsl(220, 15%, 18%)' }}
              tickLine={false}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="fuelLevel" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {fuelData.map((entry, i) => (
                <Cell key={i} fill={getFuelColor(entry.fuelLevel)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
