import { useMemo } from 'react';
import { drivers as mockDrivers, type Driver } from '@/data/mockData';
import { isFirebaseConfigured } from '@/firebase';
import { useRealtimeData } from './useRealtimeData';

export function useDrivers() {
  const { data, loading } = useRealtimeData<Record<string, Driver>>('drivers', {});

  const drivers = useMemo(() => {
    if (!isFirebaseConfigured) {
      return mockDrivers;
    }

    return Object.values(data ?? {});
  }, [data]);

  return { drivers, loading };
}
