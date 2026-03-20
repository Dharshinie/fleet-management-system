import { useMemo } from 'react';
import { trips as mockTrips, type Trip } from '@/data/mockData';
import { isFirebaseConfigured } from '@/firebase';
import { useRealtimeData } from './useRealtimeData';

export function useTrips() {
  const { data, loading } = useRealtimeData<Record<string, Trip>>('trips', {});

  const trips = useMemo(() => {
    if (!isFirebaseConfigured) {
      return mockTrips;
    }

    return Object.values(data ?? {});
  }, [data]);

  return { trips, loading };
}
