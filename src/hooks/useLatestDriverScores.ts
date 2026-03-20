import { useMemo } from 'react';
import { latestDriverScores as mockLatestDriverScores } from '@/data/mockAnalytics';
import { isFirebaseConfigured } from '@/firebase';
import { useRealtimeData } from './useRealtimeData';

export type LatestDriverScore = (typeof mockLatestDriverScores)[number];

export function useLatestDriverScores() {
  const { data, loading } = useRealtimeData<Record<string, LatestDriverScore>>('analytics/latestDriverScores', {});

  const latestDriverScores = useMemo(() => {
    if (!isFirebaseConfigured) {
      return mockLatestDriverScores;
    }

    return Object.values(data ?? {}).sort((a, b) => b.score - a.score);
  }, [data]);

  return { latestDriverScores, loading };
}
