import { useEffect } from 'react';
import { ensureMockDataInFirebase } from '@/lib/firebaseSeed';
import { isFirebaseConfigured } from '@/firebase';

export function useFirebaseBootstrap() {
  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }

    void ensureMockDataInFirebase().catch((error) => {
      console.error('Firebase bootstrap failed:', error);
    });
  }, []);
}
