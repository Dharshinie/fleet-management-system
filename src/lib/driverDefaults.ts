import type { Driver } from '@/data/mockData';
import type { ManagedUser } from '@/lib/managedUsers';

export function buildDriverFromManagedUser(user: ManagedUser): Driver {
  return {
    id: user.id,
    name: user.name,
    license: 'Pending Assignment',
    role: 'driver',
    assignedVehicleId: null,
    rating: 0,
    tripsCompleted: 0,
    totalDistance: 0,
    avgFuelEfficiency: 0,
  };
}
