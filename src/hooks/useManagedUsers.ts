import { useMemo } from 'react';
import { isFirebaseConfigured } from '@/firebase';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { fallbackManagedUsers, mapStoredUsers, type ManagedUser } from '@/lib/managedUsers';

export function useManagedUsers() {
  const { data, loading } = useRealtimeData<Record<string, Partial<ManagedUser>>>('managedUsers', {});

  const users = useMemo(() => {
    if (!isFirebaseConfigured) {
      return fallbackManagedUsers;
    }

    const storedUsers = mapStoredUsers(data ?? {});
    return storedUsers.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  }, [data]);

  return { users, loading };
}
