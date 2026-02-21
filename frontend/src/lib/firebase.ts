import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, remove, DatabaseReference } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForHarvestLog",
  authDomain: "harvest-log-demo.firebaseapp.com",
  databaseURL: "https://harvest-log-demo-default-rtdb.firebaseio.com",
  projectId: "harvest-log-demo",
  storageBucket: "harvest-log-demo.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000",
};

let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getDatabase> | null = null;

try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} catch (error) {
  console.warn('Firebase initialization failed (demo mode):', error);
}

export { db, ref, set, onValue, remove };
export type { DatabaseReference };
