import { useEffect, useRef, useState } from 'react';
import { isFirebaseConfigured, firebaseSubscribe } from '@/firebase';

export function useRealtimeData<T>(path: string, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const initialDataRef = useRef(initialData);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = firebaseSubscribe<T>(path, (value) => {
      setData(value ?? initialDataRef.current);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [path]);

  return { data, loading, error };
}
