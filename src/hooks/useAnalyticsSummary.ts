import { useMemo } from 'react';
import { analyticsSummary as mockAnalyticsSummary } from '@/data/mockAnalytics';
import { isFirebaseConfigured } from '@/firebase';
import { useRealtimeData } from './useRealtimeData';

type AnalyticsSummary = typeof mockAnalyticsSummary;

export function useAnalyticsSummary() {
  const { data, loading } = useRealtimeData<Partial<AnalyticsSummary>>('analytics/summary', {});

  const analyticsSummary = useMemo(() => {
    if (!isFirebaseConfigured) {
      return mockAnalyticsSummary;
    }

    return {
      ...mockAnalyticsSummary,
      ...(data ?? {}),
    };
  }, [data]);

  return { analyticsSummary, loading };
}
