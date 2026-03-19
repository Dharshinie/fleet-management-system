import { firebaseGetValueOnce, firebaseSetValue, isFirebaseConfigured } from '@/firebase';
import { drivers, fleetStats, geofenceAlerts, trips, vehicles } from '@/data/mockData';
import {
  analyticsSummary,
  driverScoreEntries,
  fuelReceipts,
  latestDriverScores,
  maintenanceLogs,
} from '@/data/mockAnalytics';
import simulatedRoutesData from '@/data/simulatedRoutes.json';
import testZonesData from '@/data/testZones.json';
import { fallbackManagedUsers } from '@/lib/managedUsers';

const toRecordById = <T extends { id: string }>(items: T[]) =>
  items.reduce<Record<string, T>>((record, item) => {
    record[item.id] = item;
    return record;
  }, {});

const ensurePathValue = async (path: string, value: unknown) => {
  const existingValue = await firebaseGetValueOnce(path, 2500);

  if (existingValue == null) {
    await firebaseSetValue(path, value);
  }
};

export async function ensureMockDataInFirebase() {
  if (!isFirebaseConfigured) {
    return;
  }

  await Promise.all([
    ensurePathValue('vehicles', toRecordById(vehicles)),
    ensurePathValue('drivers', toRecordById(drivers)),
    ensurePathValue('trips', toRecordById(trips)),
    ensurePathValue('geofenceAlerts', toRecordById(geofenceAlerts)),
    ensurePathValue('fleetStats', fleetStats),
    ensurePathValue(
      'managedUsers',
      fallbackManagedUsers.reduce<Record<string, (typeof fallbackManagedUsers)[number]>>((record, user) => {
        record[user.id] = user;
        return record;
      }, {})
    ),
    ensurePathValue(
      'simulation/routes',
      simulatedRoutesData.routes.reduce<Record<string, (typeof simulatedRoutesData.routes)[number]>>((record, route) => {
        record[route.vehicleId] = route;
        return record;
      }, {})
    ),
    ensurePathValue('simulation/testZones', testZonesData),
    ensurePathValue('analytics/maintenanceLogs', toRecordById(maintenanceLogs)),
    ensurePathValue('analytics/fuelReceipts', toRecordById(fuelReceipts)),
    ensurePathValue('analytics/driverScoreEntries', toRecordById(driverScoreEntries)),
    ensurePathValue(
      'analytics/latestDriverScores',
      latestDriverScores.reduce<Record<string, (typeof latestDriverScores)[number]>>((record, score) => {
        record[score.driverId] = score;
        return record;
      }, {})
    ),
    ensurePathValue('analytics/summary', analyticsSummary),
  ]);
}
