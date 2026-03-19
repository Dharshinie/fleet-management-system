import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, type User as FirebaseUser, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, push, ref, set, onValue, type DatabaseReference } from 'firebase/database';

// Load Firebase settings from VITE_ env variables.
// Ensure you create a .env file in the project root with these variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.databaseURL
);

export function getFirebaseApp() {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please set VITE_FIREBASE_* env variables.');
  }

  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }

  return getApp();
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export function getFirebaseDatabase() {
  return getDatabase(getFirebaseApp());
}

export async function firebaseCreateUser(email: string, password: string) {
  const auth = getFirebaseAuth();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function firebaseSignIn(email: string, password: string) {
  const auth = getFirebaseAuth();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function firebaseSignOut() {
  const auth = getFirebaseAuth();
  await signOut(auth);
}

export function firebaseOnAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}

export function firebaseDatabaseRef(path: string): DatabaseReference {
  const db = getFirebaseDatabase();
  return ref(db, path);
}

export function firebaseSetValue(path: string, value: unknown) {
  const db = getFirebaseDatabase();
  return set(ref(db, path), value);
}

export function firebasePushValue(path: string, value: unknown) {
  const db = getFirebaseDatabase();
  return set(push(ref(db, path)), value);
}

export function firebaseGetValueOnce<T>(path: string, timeoutMs = 5000): Promise<T | null> {
  return new Promise((resolve, reject) => {
    const dbRef = firebaseDatabaseRef(path);
    let settled = false;

    const timeoutId = window.setTimeout(() => {
      if (settled) {
        return;
      }

      settled = true;
      unsubscribe();
      resolve(null);
    }, timeoutMs);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (settled) {
          return;
        }

        settled = true;
        window.clearTimeout(timeoutId);
        unsubscribe();
        resolve(snapshot.val());
      },
      (error) => {
        if (settled) {
          return;
        }

        settled = true;
        window.clearTimeout(timeoutId);
        unsubscribe();
        reject(error);
      },
      { onlyOnce: true }
    );
  });
}

export function firebaseSubscribe<T>(path: string, callback: (value: T | null) => void) {
  const dbRef = firebaseDatabaseRef(path);
  return onValue(dbRef, (snapshot) => {
    callback(snapshot.val());
  });
}
