import { GeoJSON, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { type Vehicle, type VehicleStatus } from '@/data/mockData';

const statusColors: Record<VehicleStatus, string> = {
  active: '#22c55e',
  maintenance: '#eab308',
  emergency: '#ef4444',
  idle: '#64748b',
};

const createVehicleIcon = (status: VehicleStatus, selected = false) => {
  const color = statusColors[status];
  const size = selected ? 34 : 28;
  const innerRadius = selected ? 7 : 5;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="${color}" opacity="0.2"/>
    <circle cx="12" cy="12" r="${innerRadius}" fill="${color}"/>
    <circle cx="12" cy="12" r="3" fill="hsl(220,15%,8%)"/>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

function FitBounds({ vehicles }: { vehicles: Vehicle[] }) {
  const map = useMap();

  useEffect(() => {
    if (vehicles.length > 0) {
      const bounds = L.latLngBounds(vehicles.map((vehicle) => [vehicle.lat, vehicle.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [vehicles, map]);

  return null;
}

interface FleetMapProps {
  vehicles: Vehicle[];
  onVehicleSelect?: (vehicle: Vehicle) => void;
  selectedVehicleId?: string | null;
  zones?: any;
}

export default function FleetMap({ vehicles, onVehicleSelect, selectedVehicleId, zones }: FleetMapProps) {
  const GeoJSONAny = GeoJSON as any;
  const MapContainerAny = MapContainer as any;
  const TileLayerAny = TileLayer as any;
  const MarkerAny = Marker as any;
  const PopupAny = Popup as any;

  return (
    <div className="absolute inset-0">
      <MapContainerAny
        center={[40.7128, -74.006]}
        zoom={13}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayerAny
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds vehicles={vehicles} />
        {zones && (
          <GeoJSONAny
            data={zones as any}
            style={() => ({
              color: 'hsl(171 66% 45%)',
              weight: 2,
              fillColor: 'hsl(171 66% 45%)',
              fillOpacity: 0.1,
            })}
          />
        )}
        {vehicles.map((vehicle) => (
          <MarkerAny
            key={vehicle.id}
            position={[vehicle.lat, vehicle.lng]}
            icon={createVehicleIcon(vehicle.status, vehicle.id === selectedVehicleId)}
            eventHandlers={{
              click: () => onVehicleSelect?.(vehicle),
            }}
          >
            <PopupAny className="fleet-popup">
              <div className="font-sans text-xs space-y-1">
                <div className="font-semibold text-sm">{vehicle.id} - {vehicle.plate}</div>
                <div className="font-mono-data">
                  {vehicle.lat.toFixed(3)} deg N, {Math.abs(vehicle.lng).toFixed(3)} deg W
                </div>
                <div>{vehicle.speed} mph - {vehicle.fuelLevel}% fuel</div>
                <div className="text-muted-foreground">{vehicle.make} {vehicle.model}</div>
              </div>
            </PopupAny>
          </MarkerAny>
        ))}
      </MapContainerAny>
    </div>
  );
}
