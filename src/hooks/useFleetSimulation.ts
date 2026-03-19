import { useEffect, useMemo, useRef, useState } from 'react';
import type { GeofenceAlert, Vehicle, VehicleStatus } from '@/data/mockData';
import simulatedRoutesData from '@/data/simulatedRoutes.json';
import testZonesData from '@/data/testZones.json';
import { geofenceAlerts as seedAlerts } from '@/data/mockData';

type ZoneFeature = {
  type: 'Feature';
  properties: {
    id: string;
    name: string;
    description: string;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
};

const routesByVehicle = new Map(
  simulatedRoutesData.routes.map((route) => [route.vehicleId, route.coordinates])
);

const pointInPolygon = (lat: number, lng: number, polygon: number[][]) => {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersects =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / ((yj - yi) || Number.EPSILON) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
};

const getVehicleStatus = (vehicle: Vehicle, speed: number, fuelLevel: number): VehicleStatus => {
  if (vehicle.status === 'maintenance') {
    return 'maintenance';
  }

  if (fuelLevel < 12) {
    return 'emergency';
  }

  if (speed > 8) {
    return 'active';
  }

  return 'idle';
};

const createSimulationSnapshot = (vehicles: Vehicle[], tick: number) => {
  return vehicles.map((vehicle) => {
    const route = routesByVehicle.get(vehicle.id);

    if (!route?.length) {
      return vehicle;
    }

    const currentIndex = tick % route.length;
    const previousIndex = currentIndex === 0 ? route.length - 1 : currentIndex - 1;
    const [lat, lng] = route[currentIndex];
    const [prevLat, prevLng] = route[previousIndex];
    const travelDelta = Math.abs(lat - prevLat) + Math.abs(lng - prevLng);
    const speed = Math.max(8, Math.round(24 + travelDelta * 12000));
    const fuelLevel = Math.max(4, Math.round(vehicle.fuelLevel - tick * 0.8) % 100 || vehicle.fuelLevel);

    return {
      ...vehicle,
      lat,
      lng,
      heading: Math.round(Math.atan2(lng - prevLng, lat - prevLat) * (180 / Math.PI)),
      speed,
      fuelLevel,
      status: getVehicleStatus(vehicle, speed, fuelLevel),
    };
  });
};

export function useFleetSimulation(vehicles: Vehicle[], enabled = true) {
  const [tick, setTick] = useState(0);
  const [alerts, setAlerts] = useState<GeofenceAlert[]>(seedAlerts);
  const lastMembershipRef = useRef<Record<string, string[]>>({});

  useEffect(() => {
    if (!enabled || vehicles.length === 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTick((currentTick) => currentTick + 1);
    }, 2800);

    return () => window.clearInterval(intervalId);
  }, [enabled, vehicles.length]);

  const simulatedVehicles = useMemo(() => {
    if (!enabled) {
      return vehicles;
    }

    return createSimulationSnapshot(vehicles, tick);
  }, [enabled, tick, vehicles]);

  useEffect(() => {
    if (!enabled || simulatedVehicles.length === 0) {
      return;
    }

    const zones = (testZonesData.features as ZoneFeature[]) ?? [];
    const nextMembership: Record<string, string[]> = {};
    const newAlerts: GeofenceAlert[] = [];

    simulatedVehicles.forEach((vehicle) => {
      const activeZones = zones
        .filter((zone) => pointInPolygon(vehicle.lat, vehicle.lng, zone.geometry.coordinates[0]))
        .map((zone) => zone.properties.id);

      const previousZones = lastMembershipRef.current[vehicle.id] ?? [];

      activeZones.forEach((zoneId) => {
        if (!previousZones.includes(zoneId)) {
          const zone = zones.find((item) => item.properties.id === zoneId);

          newAlerts.push({
            id: `alert-enter-${vehicle.id}-${zoneId}-${Date.now()}`,
            vehicleId: vehicle.id,
            type: 'entry',
            zone: zone?.properties.name ?? zoneId,
            timestamp: new Date().toISOString(),
            coordinates: { lat: vehicle.lat, lng: vehicle.lng },
          });
        }
      });

      previousZones.forEach((zoneId) => {
        if (!activeZones.includes(zoneId)) {
          const zone = zones.find((item) => item.properties.id === zoneId);

          newAlerts.push({
            id: `alert-exit-${vehicle.id}-${zoneId}-${Date.now()}`,
            vehicleId: vehicle.id,
            type: 'exit',
            zone: zone?.properties.name ?? zoneId,
            timestamp: new Date().toISOString(),
            coordinates: { lat: vehicle.lat, lng: vehicle.lng },
          });
        }
      });

      nextMembership[vehicle.id] = activeZones;
    });

    lastMembershipRef.current = nextMembership;

    if (newAlerts.length > 0) {
      setAlerts((currentAlerts) => [...newAlerts.reverse(), ...currentAlerts].slice(0, 24));
    }
  }, [enabled, simulatedVehicles]);

  return {
    simulatedVehicles,
    geofenceAlerts: alerts,
    testZones: testZonesData,
  };
}
