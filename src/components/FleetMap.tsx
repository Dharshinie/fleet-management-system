import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { vehicles, type Vehicle, type VehicleStatus } from '@/data/mockData';
import { useEffect } from 'react';

const statusColors: Record<VehicleStatus, string> = {
  active: '#22c55e',
  maintenance: '#eab308',
  emergency: '#ef4444',
  idle: '#64748b',
};

const createVehicleIcon = (status: VehicleStatus) => {
  const color = statusColors[status];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="${color}" opacity="0.2"/>
    <circle cx="12" cy="12" r="5" fill="${color}"/>
    <circle cx="12" cy="12" r="3" fill="hsl(220,15%,8%)"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

function FitBounds({ vehicles }: { vehicles: Vehicle[] }) {
  const map = useMap();
  useEffect(() => {
    if (vehicles.length > 0) {
      const bounds = L.latLngBounds(vehicles.map(v => [v.lat, v.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [vehicles, map]);
  return null;
}

interface FleetMapProps {
  onVehicleSelect?: (vehicle: Vehicle) => void;
  selectedVehicleId?: string | null;
}

export default function FleetMap({ onVehicleSelect, selectedVehicleId }: FleetMapProps) {
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
        {vehicles.map((vehicle) => (
          <MarkerAny
            key={vehicle.id}
            position={[vehicle.lat, vehicle.lng]}
            icon={createVehicleIcon(vehicle.status)}
            eventHandlers={{
              click: () => onVehicleSelect?.(vehicle),
            }}
          >
            <PopupAny className="fleet-popup">
              <div className="font-sans text-xs space-y-1">
                <div className="font-semibold text-sm">{vehicle.id} — {vehicle.plate}</div>
                <div className="font-mono-data">{vehicle.lat.toFixed(3)}° N, {Math.abs(vehicle.lng).toFixed(3)}° W</div>
                <div>{vehicle.speed} mph · {vehicle.fuelLevel}% fuel</div>
              </div>
            </PopupAny>
          </MarkerAny>
        ))}
      </MapContainerAny>
    </div>
  );
}
