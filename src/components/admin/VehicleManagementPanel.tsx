import { useEffect, useMemo, useState } from 'react';
import { useVehicles } from '@/hooks/useVehicles';
import { useDrivers } from '@/hooks/useDrivers';
import { isFirebaseConfigured, firebaseSetValue } from '@/firebase';
import { type Vehicle } from '@/data/mockData';
import { Plus, Edit, Trash2, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'idle', label: 'Idle' },
];

export default function VehicleManagementPanel() {
  const { vehicles: remoteVehicles } = useVehicles();
  const { drivers } = useDrivers();
  const [vehicles, setVehicles] = useState<Vehicle[]>(remoteVehicles);
  const [search, setSearch] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    vin: '',
    plate: '',
    make: '',
    model: '',
    year: 2024,
    status: 'active',
    lastService: '',
  });

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const q = search.toLowerCase();
      return (
        v.id.toLowerCase().includes(q) ||
        v.plate.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q)
      );
    });
  }, [search, vehicles]);

  const resetForm = () => {
    setFormData({
      id: '',
      vin: '',
      plate: '',
      make: '',
      model: '',
      year: 2024,
      status: 'active',
      lastService: '',
    });
  };

  useEffect(() => {
    setVehicles(remoteVehicles);
  }, [remoteVehicles]);

  useEffect(() => {
    if (remoteVehicles.length === 0) {
      setSelectedVehicle(null);
      return;
    }

    if (!selectedVehicle) {
      setSelectedVehicle(remoteVehicles[0]);
      return;
    }

    const matchingVehicle = remoteVehicles.find((vehicle) => vehicle.id === selectedVehicle.id) ?? null;
    setSelectedVehicle(matchingVehicle);
  }, [remoteVehicles, selectedVehicle]);

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      id: vehicle.id,
      vin: vehicle.vin,
      plate: vehicle.plate,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      status: vehicle.status,
      lastService: vehicle.lastService,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.id.trim() || !formData.plate.trim() || !formData.make.trim() || !formData.model.trim()) {
      return;
    }

    const normalizedId = formData.id.trim();
    const existing = vehicles.find((v) => v.id === normalizedId);
    const updated: Vehicle = {
      ...formData,
      id: normalizedId,
      vin: formData.vin.trim(),
      plate: formData.plate.trim(),
      make: formData.make.trim(),
      model: formData.model.trim(),
      status: formData.status as Vehicle['status'],
      odometer: existing?.odometer ?? 0,
      driverId: existing?.driverId ?? null,
      lat: existing?.lat ?? 40.7128,
      lng: existing?.lng ?? -74.006,
      speed: existing?.speed ?? 0,
      heading: existing?.heading ?? 0,
      fuelLevel: existing?.fuelLevel ?? 100,
    };

    setVehicles((prev) => {
      const exists = prev.findIndex((v) => v.id === updated.id);
      if (exists !== -1) {
        const copy = [...prev];
        copy[exists] = updated;
        return copy;
      }
      return [...prev, updated];
    });

    if (isFirebaseConfigured) {
      await firebaseSetValue(`vehicles/${updated.id}`, updated);
    }

    setSelectedVehicle(updated);
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    if (selectedVehicle?.id === id) {
      const remainingVehicles = vehicles.filter((v) => v.id !== id);
      setSelectedVehicle(remainingVehicles[0] ?? null);
    }

    if (isFirebaseConfigured) {
      await firebaseSetValue(`vehicles/${id}`, null);
    }
  };

  return (
    <div className="glass-panel rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-caps mb-1">Fleet Operations</p>
          <h3 className="text-lg font-semibold tracking-tight">Vehicle Profiles</h3>
          <p className="text-xs text-muted-foreground">Add or edit vehicle details, and records remain until you delete them.</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 p-2 rounded-lg bg-gradient-to-br from-blue-500 to-green-500" onClick={openAdd}>
              <Plus className="w-3.5 h-3.5" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>{formData.id && selectedVehicle?.id === formData.id ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <Label className="text-xs text-muted-foreground">Vehicle ID</Label>
                <Input
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="V-101"
                  className="mt-1 bg-secondary border-border"
                  disabled={!!selectedVehicle && selectedVehicle.id === formData.id}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">VIN</Label>
                <Input
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  placeholder="1HGBH41JXMN109186"
                  className="mt-1 bg-secondary border-border"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">License Plate</Label>
                <Input
                  value={formData.plate}
                  onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                  placeholder="FLT-0001"
                  className="mt-1 bg-secondary border-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Make</Label>
                  <Input
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    placeholder="Ford"
                    className="mt-1 bg-secondary border-border"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Model</Label>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Transit"
                    className="mt-1 bg-secondary border-border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Year</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="mt-1 bg-secondary border-border"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Last Service</Label>
                  <Input
                    type="date"
                    value={formData.lastService}
                    onChange={(e) => setFormData({ ...formData, lastService: e.target.value })}
                    className="mt-1 bg-secondary border-border"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Vehicle['status'] })}>
                  <SelectTrigger className="mt-1 bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  Cancel
                </Button>
              </DialogClose>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-secondary border-border text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 px-3 font-medium text-xs">ID</th>
              <th className="text-left py-2 px-3 font-medium text-xs">Plate</th>
              <th className="text-left py-2 px-3 font-medium text-xs">Make / Model</th>
              <th className="text-left py-2 px-3 font-medium text-xs">Status</th>
              <th className="text-left py-2 px-3 font-medium text-xs">Next Service</th>
              <th className="text-right py-2 px-3 font-medium text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((v) => {
              const nextServiceMiles = Math.ceil(v.odometer / 10000) * 10000;
              const daysSince = Math.max(0, Math.floor((new Date().getTime() - new Date(v.lastService).getTime()) / (1000 * 60 * 60 * 24)));

              return (
                <tr
                  key={v.id}
                  className={`border-b border-border/50 transition-colors ${selectedVehicle?.id === v.id ? 'bg-accent/30' : 'hover:bg-accent/30'}`}
                >
                  <td className="py-2.5 px-3 font-semibold">
                    <button type="button" className="text-left hover:text-primary" onClick={() => setSelectedVehicle(v)}>
                      {v.id}
                    </button>
                  </td>
                  <td className="py-2.5 px-3 font-mono-data text-xs text-muted-foreground">{v.plate}</td>
                  <td className="py-2.5 px-3">{v.make} {v.model}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`status-dot ${v.status === 'emergency' ? 'status-emergency' : v.status === 'maintenance' ? 'status-maintenance' : v.status === 'active' ? 'status-active' : 'status-idle'}`} />
                      <span className="capitalize">{v.status}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono-data text-xs">{nextServiceMiles.toLocaleString()} mi</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{daysSince}d since last service</p>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(v)}>
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredVehicles.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">No vehicles match your search.</p>
        )}
      </div>

      {selectedVehicle && (
        <div className="rounded-lg border border-border bg-background/40 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="label-caps mb-1">Selected Vehicle</p>
              <h4 className="text-base font-semibold tracking-tight">
                {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.id})
              </h4>
              <p className="text-xs text-muted-foreground">Vehicle profile details from the saved fleet record.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => openEdit(selectedVehicle)}>
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              Edit Details
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            <DetailItem label="Vehicle ID" value={selectedVehicle.id} />
            <DetailItem label="VIN" value={selectedVehicle.vin || 'Not provided'} />
            <DetailItem label="Plate" value={selectedVehicle.plate} />
            <DetailItem label="Status" value={selectedVehicle.status} />
            <DetailItem label="Make" value={selectedVehicle.make} />
            <DetailItem label="Model" value={selectedVehicle.model} />
            <DetailItem label="Year" value={String(selectedVehicle.year)} />
            <DetailItem label="Last Service" value={selectedVehicle.lastService || 'Not scheduled'} />
            <DetailItem label="Odometer" value={`${selectedVehicle.odometer.toLocaleString()} mi`} />
            <DetailItem label="Fuel Level" value={`${selectedVehicle.fuelLevel}%`} />
            <DetailItem label="Speed" value={`${selectedVehicle.speed} mph`} />
            <DetailItem
              label="Assigned Driver"
              value={drivers.find((driver) => driver.id === selectedVehicle.driverId)?.name ?? 'Unassigned'}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pt-4 text-xs text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span>Use the Live Map to view real-time vehicle locations.</span>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/70 bg-card/40 p-3">
      <p className="label-caps mb-1">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
