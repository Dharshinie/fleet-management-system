import { faker } from '@faker-js/faker';
import { drivers, vehicles } from '@/data/mockData';

faker.seed(20260318);

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  category: 'inspection' | 'repair' | 'warranty';
  severity: 'low' | 'medium' | 'high';
  cost: number;
  createdAt: string;
  mileage: number;
}

export interface FuelReceipt {
  id: string;
  vehicleId: string;
  gallons: number;
  totalCost: number;
  location: string;
  createdAt: string;
}

export interface DriverScoreEntry {
  id: string;
  driverId: string;
  driverName: string;
  score: number;
  efficiency: number;
  safetyIncidents: number;
  createdAt: string;
}

const seededDate = new Date('2026-03-18T08:30:00Z');

export const maintenanceLogs: MaintenanceLog[] = Array.from({ length: 2400 }, (_, index) => {
  const vehicle = faker.helpers.arrayElement(vehicles);
  return {
    id: `maint-${index + 1}`,
    vehicleId: vehicle.id,
    category: faker.helpers.arrayElement(['inspection', 'repair', 'warranty']),
    severity: faker.helpers.weightedArrayElement([
      { weight: 5, value: 'low' },
      { weight: 3, value: 'medium' },
      { weight: 2, value: 'high' },
    ]),
    cost: Number(faker.finance.amount({ min: 120, max: 2200, dec: 2 })),
    createdAt: faker.date.recent({ days: 90, refDate: seededDate }).toISOString(),
    mileage: vehicle.odometer + faker.number.int({ min: 20, max: 18000 }),
  };
});

export const fuelReceipts: FuelReceipt[] = Array.from({ length: 3600 }, (_, index) => {
  const vehicle = faker.helpers.arrayElement(vehicles);
  const gallons = Number(faker.finance.amount({ min: 8, max: 65, dec: 1 }));
  return {
    id: `fuel-${index + 1}`,
    vehicleId: vehicle.id,
    gallons,
    totalCost: Number((gallons * faker.number.float({ min: 3.1, max: 4.9, fractionDigits: 2 })).toFixed(2)),
    location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
    createdAt: faker.date.recent({ days: 45, refDate: seededDate }).toISOString(),
  };
});

export const driverScoreEntries: DriverScoreEntry[] = Array.from({ length: 1800 }, (_, index) => {
  const driver = faker.helpers.arrayElement(drivers);
  return {
    id: `score-${index + 1}`,
    driverId: driver.id,
    driverName: driver.name,
    score: Number(faker.number.float({ min: 72, max: 99, fractionDigits: 1 }).toFixed(1)),
    efficiency: Number(faker.number.float({ min: 11.2, max: 18.4, fractionDigits: 1 }).toFixed(1)),
    safetyIncidents: faker.number.int({ min: 0, max: 4 }),
    createdAt: faker.date.recent({ days: 30, refDate: seededDate }).toISOString(),
  };
});

export const fuelUsageByVehicle = vehicles.map((vehicle) => {
  const receipts = fuelReceipts.filter((receipt) => receipt.vehicleId === vehicle.id);
  const gallons = receipts.reduce((sum, receipt) => sum + receipt.gallons, 0);

  return {
    vehicleId: vehicle.id,
    plate: vehicle.plate,
    model: `${vehicle.make} ${vehicle.model}`,
    gallons: Number(gallons.toFixed(1)),
  };
});

export const maintenanceSummaryByVehicle = vehicles.map((vehicle) => {
  const logs = maintenanceLogs.filter((log) => log.vehicleId === vehicle.id);
  const highSeverity = logs.filter((log) => log.severity === 'high').length;
  const latest = logs.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0];

  return {
    vehicleId: vehicle.id,
    plate: vehicle.plate,
    totalLogs: logs.length,
    highSeverity,
    latestServiceAt: latest?.createdAt ?? seededDate.toISOString(),
  };
});

export const latestDriverScores = drivers.map((driver) => {
  const entries = driverScoreEntries
    .filter((entry) => entry.driverId === driver.id)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  const latest = entries[0];

  return {
    driverId: driver.id,
    driverName: driver.name,
    score: latest?.score ?? driver.rating * 20,
    efficiency: latest?.efficiency ?? driver.avgFuelEfficiency,
    safetyIncidents: latest?.safetyIncidents ?? 0,
    tripsCompleted: driver.tripsCompleted,
  };
}).sort((a, b) => b.score - a.score);

export const analyticsSummary = {
  maintenanceLogCount: maintenanceLogs.length,
  fuelReceiptCount: fuelReceipts.length,
  driverScoreCount: driverScoreEntries.length,
  totalFuelGallons: Number(fuelReceipts.reduce((sum, receipt) => sum + receipt.gallons, 0).toFixed(1)),
};
