import { useMemo } from 'react';
import { fleetStats as mockFleetStats } from '@/data/mockData';
import { isFirebaseConfigured } from '@/firebase';
import { useRealtimeData } from './useRealtimeData';

type FleetStats = typeof mockFleetStats;

export function useFleetStats() {
  const { data, loading } = useRealtimeData<Partial<FleetStats>>('fleetStats', {});

  const fleetStats = useMemo(() => {
    if (!isFirebaseConfigured) {
      return mockFleetStats;
    }

    return {
      ...mockFleetStats,
      ...(data ?? {}),
    };
  }, [data]);

  return { fleetStats, loading };
}
