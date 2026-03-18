import { useMemo, useState } from 'react';
import { Globe, MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Zone {
  id: string;
  name: string;
  description: string;
  color: string;
  region: 'North' | 'South' | 'East' | 'West';
}

const initialZones: Zone[] = [
  { id: 'zone-01', name: 'North Hub', description: 'Primary dispatch center for northern region.', color: 'bg-blue-500/15 text-blue-600', region: 'North' },
  { id: 'zone-02', name: 'South Depot', description: 'Main warehouse for southern deliveries.', color: 'bg-red-500/15 text-red-600', region: 'South' },
  { id: 'zone-03', name: 'East Corridor', description: 'Fast lanes for east-side shipments.', color: 'bg-green-500/15 text-green-600', region: 'East' },
  { id: 'zone-04', name: 'West Terminal', description: 'Central drop-off hub in western region.', color: 'bg-purple-500/15 text-purple-600', region: 'West' },
];

export default function ZonalControl() {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [newRegion, setNewRegion] = useState<Zone['region']>('North');

  const filteredZones = useMemo(() => {
    return zones.filter((zone) =>
      zone.name.toLowerCase().includes(search.toLowerCase()) ||
      zone.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [zones, search]);

  const handleAddZone = () => {
    if (!newName.trim()) return;
    const newZone: Zone = {
      id: `zone-${Date.now()}`,
      name: newName.trim(),
      description: `${newRegion} region zone created by the super admin.`,
      color: 'bg-indigo-500/15 text-indigo-600',
      region: newRegion,
    };
    setZones((prev) => [newZone, ...prev]);
    setNewName('');
  };

  const handleRemoveZone = (id: string) => {
    setZones((prev) => prev.filter((zone) => zone.id !== id));
  };

  return (
    <div className="glass-panel rounded-lg p-5 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="label-caps">Zonal Control</p>
          <h3 className="text-lg font-semibold tracking-tight">Manage Geographical Zones</h3>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 bg-secondary/80 px-3 py-2 rounded-lg">
            <Globe className="w-4 h-4 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Regions</div>
              <div className="text-sm font-semibold">North / South / East / West</div>
            </div>
          </div>
          <Button variant="secondary" className="gap-2" onClick={handleAddZone}>
            <Plus className="w-4 h-4" />
            Add zone
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass-inner p-4">
          <p className="text-sm font-medium">Create a Zone</p>
          <p className="text-xs text-muted-foreground">Name your zone and select a region to assign it to.</p>
          <div className="mt-3 space-y-3">
            <Input
              placeholder="Zone name (e.g., North Hub)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-secondary border-border"
            />
            <div className="flex items-center gap-2">
              <select
                value={newRegion}
                onChange={(e) => setNewRegion(e.target.value as Zone['region'])}
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
              >
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </select>
              <Button size="sm" onClick={handleAddZone}>
                Create
              </Button>
            </div>
          </div>
        </div>

        <div className="glass-inner p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Zone Directory</p>
            <Badge variant="outline" className="text-[10px]">
              {zones.length} zones
            </Badge>
          </div>
          <Input
            placeholder="Search zones…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-secondary border-border text-sm"
          />
          <div className="mt-3 space-y-2">
            {filteredZones.map((zone) => (
              <div key={zone.id} className="glass-panel glass-frosted rounded-lg p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`${zone.color} rounded-full px-2 py-0.5 text-[10px] font-semibold`}>{zone.region}</span>
                      <span className="font-medium">{zone.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{zone.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveZone(zone.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Badge variant="outline" className="text-[10px]">
                      Assigned
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            {filteredZones.length === 0 && (
              <p className="text-sm text-muted-foreground">No zones found. Add one to get started.</p>
            )}
          </div>
        </div>

        <div className="glass-inner p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold">Zone Summary</p>
          </div>
          <p className="text-xs text-muted-foreground">Use zones to assign drivers and vehicles to specific geographic regions for better dispatching and reporting.</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-status-active mt-0.5" />
              Define zones and boundaries for your fleet.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-status-active mt-0.5" />
              Assign drivers and vehicles to regions for optimized routing.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-status-active mt-0.5" />
              Monitor geofence alerts and compliance per zone.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
