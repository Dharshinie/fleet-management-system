import { vehicles as mockVehicles, type Vehicle } from '@/data/mockData';
import { isFirebaseConfigured } from '@/firebase';
import { useRealtimeData } from './useRealtimeData';

export function useVehicles() {
  const { data, loading } = useRealtimeData<Record<string, Vehicle>>('vehicles', {});

  const vehicles = isFirebaseConfigured ? Object.values(data ?? {}) : mockVehicles;

  return { vehicles, loading };
}
