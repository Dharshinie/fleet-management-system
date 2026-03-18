export type VehicleStatus = 'active' | 'maintenance' | 'emergency' | 'idle';
export type UserRole = 'super_admin' | 'admin' | 'driver';

export interface Vehicle {
  id: string;
  vin: string;
  plate: string;
  status: VehicleStatus;
  make: string;
  model: string;
  year: number;
  odometer: number;
  lastService: string;
  driverId: string | null;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  fuelLevel: number;
}

export interface Driver {
  id: string;
  name: string;
  license: string;
  role: UserRole;
  assignedVehicleId: string | null;
  rating: number;
  tripsCompleted: number;
  totalDistance: number;
  avgFuelEfficiency: number;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  startTime: string;
  endTime: string | null;
  startLocation: string;
  endLocation: string | null;
  distance: number;
  fuelConsumed: number;
  status: 'active' | 'completed';
}

export interface GeofenceAlert {
  id: string;
  vehicleId: string;
  type: 'entry' | 'exit';
  zone: string;
  timestamp: string;
  coordinates: { lat: number; lng: number };
}

export const vehicles: Vehicle[] = [
  { id: 'V-101', vin: '1HGBH41JXMN109186', plate: 'FLT-2847', status: 'active', make: 'Ford', model: 'Transit', year: 2023, odometer: 45280, lastService: '2026-02-15', driverId: 'D-001', lat: 40.7128, lng: -74.006, speed: 42, heading: 135, fuelLevel: 72 },
  { id: 'V-102', vin: '2C3CDXCT5NH123456', plate: 'FLT-3912', status: 'active', make: 'Mercedes', model: 'Sprinter', year: 2024, odometer: 28190, lastService: '2026-03-01', driverId: 'D-002', lat: 40.7282, lng: -73.9942, speed: 35, heading: 270, fuelLevel: 58 },
  { id: 'V-103', vin: '3GNKBKRS2MS654321', plate: 'FLT-1055', status: 'maintenance', make: 'Chevrolet', model: 'Express', year: 2022, odometer: 89340, lastService: '2026-03-10', driverId: null, lat: 40.7489, lng: -73.9680, speed: 0, heading: 0, fuelLevel: 45 },
  { id: 'V-104', vin: '5YJSA1DG9DFP14555', plate: 'FLT-4201', status: 'emergency', make: 'RAM', model: 'ProMaster', year: 2023, odometer: 62110, lastService: '2026-01-20', driverId: 'D-003', lat: 40.7549, lng: -73.9840, speed: 0, heading: 90, fuelLevel: 15 },
  { id: 'V-105', vin: '1FTFW1ET5EKE98765', plate: 'FLT-5528', status: 'active', make: 'Ford', model: 'E-350', year: 2024, odometer: 12450, lastService: '2026-03-05', driverId: 'D-004', lat: 40.7614, lng: -73.9776, speed: 28, heading: 180, fuelLevel: 84 },
  { id: 'V-106', vin: '1GC1KUEY7LF234567', plate: 'FLT-6673', status: 'idle', make: 'Isuzu', model: 'NPR', year: 2023, odometer: 34670, lastService: '2026-02-28', driverId: null, lat: 40.7061, lng: -74.0087, speed: 0, heading: 45, fuelLevel: 91 },
  { id: 'V-107', vin: '4T1BF1FK5HU789012', plate: 'FLT-7341', status: 'active', make: 'Freightliner', model: 'M2 106', year: 2024, odometer: 8920, lastService: '2026-03-12', driverId: 'D-005', lat: 40.7350, lng: -74.0010, speed: 55, heading: 315, fuelLevel: 63 },
  { id: 'V-108', vin: '5N1AT2MV9LC345678', plate: 'FLT-8019', status: 'active', make: 'Hino', model: '268A', year: 2023, odometer: 51280, lastService: '2026-02-10', driverId: 'D-006', lat: 40.7200, lng: -73.9850, speed: 38, heading: 60, fuelLevel: 47 },
];

export const drivers: Driver[] = [
  { id: 'D-001', name: 'Marcus Chen', license: 'CDL-A 28491', role: 'driver', assignedVehicleId: 'V-101', rating: 4.8, tripsCompleted: 342, totalDistance: 28450, avgFuelEfficiency: 14.2 },
  { id: 'D-002', name: 'Sarah Williams', license: 'CDL-B 19274', role: 'driver', assignedVehicleId: 'V-102', rating: 4.9, tripsCompleted: 289, totalDistance: 24100, avgFuelEfficiency: 15.1 },
  { id: 'D-003', name: 'James Rodriguez', license: 'CDL-A 37182', role: 'driver', assignedVehicleId: 'V-104', rating: 4.5, tripsCompleted: 198, totalDistance: 16800, avgFuelEfficiency: 12.8 },
  { id: 'D-004', name: 'Aisha Patel', license: 'CDL-B 42891', role: 'driver', assignedVehicleId: 'V-105', rating: 4.7, tripsCompleted: 156, totalDistance: 13200, avgFuelEfficiency: 16.3 },
  { id: 'D-005', name: 'Erik Johansson', license: 'CDL-A 55123', role: 'driver', assignedVehicleId: 'V-107', rating: 4.6, tripsCompleted: 87, totalDistance: 7400, avgFuelEfficiency: 13.9 },
  { id: 'D-006', name: 'Tomoko Hayashi', license: 'CDL-B 61847', role: 'driver', assignedVehicleId: 'V-108', rating: 4.4, tripsCompleted: 224, totalDistance: 19600, avgFuelEfficiency: 11.7 },
];

export const trips: Trip[] = [
  { id: 'T-001', vehicleId: 'V-101', driverId: 'D-001', startTime: '2026-03-16T06:30:00', endTime: null, startLocation: 'Depot A — Newark, NJ', endLocation: null, distance: 42.8, fuelConsumed: 3.1, status: 'active' },
  { id: 'T-002', vehicleId: 'V-102', driverId: 'D-002', startTime: '2026-03-16T07:15:00', endTime: null, startLocation: 'Warehouse B — Brooklyn, NY', endLocation: null, distance: 28.4, fuelConsumed: 1.9, status: 'active' },
  { id: 'T-003', vehicleId: 'V-105', driverId: 'D-004', startTime: '2026-03-16T05:45:00', endTime: null, startLocation: 'Hub C — Manhattan, NY', endLocation: null, distance: 56.2, fuelConsumed: 3.4, status: 'active' },
  { id: 'T-004', vehicleId: 'V-101', driverId: 'D-001', startTime: '2026-03-15T06:00:00', endTime: '2026-03-15T14:30:00', startLocation: 'Depot A — Newark, NJ', endLocation: 'Client Site — Queens, NY', distance: 89.3, fuelConsumed: 6.3, status: 'completed' },
  { id: 'T-005', vehicleId: 'V-107', driverId: 'D-005', startTime: '2026-03-16T08:00:00', endTime: null, startLocation: 'Depot D — Jersey City, NJ', endLocation: null, distance: 18.7, fuelConsumed: 1.3, status: 'active' },
];

export const geofenceAlerts: GeofenceAlert[] = [
  { id: 'GA-001', vehicleId: 'V-102', type: 'exit', zone: 'Zone: North-Hub', timestamp: '2026-03-16T09:42:18', coordinates: { lat: 40.7282, lng: -73.9942 } },
  { id: 'GA-002', vehicleId: 'V-104', type: 'entry', zone: 'Zone: Restricted-Industrial', timestamp: '2026-03-16T08:15:33', coordinates: { lat: 40.7549, lng: -73.9840 } },
  { id: 'GA-003', vehicleId: 'V-107', type: 'exit', zone: 'Zone: Downtown-Corridor', timestamp: '2026-03-16T10:01:47', coordinates: { lat: 40.7350, lng: -74.0010 } },
  { id: 'GA-004', vehicleId: 'V-101', type: 'entry', zone: 'Zone: Client-Perimeter', timestamp: '2026-03-16T11:22:05', coordinates: { lat: 40.7128, lng: -74.006 } },
];

export const fleetStats = {
  totalVehicles: 8,
  activeVehicles: 5,
  maintenanceVehicles: 1,
  emergencyVehicles: 1,
  idleVehicles: 1,
  totalDrivers: 6,
  activeTrips: 4,
  totalDistanceToday: 146.1,
  avgFuelEfficiency: 14.0,
  alertsToday: 4,
};
