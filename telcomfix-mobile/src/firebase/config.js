// ============================================================
// TelcomFix Mobile — Firebase Configuration
// Shared by Customer & Field Engineer apps
// ============================================================
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDWwTZAeYlg0oPHqJv62lt-XzJUK5lHLuE',
  authDomain: 'telcom-fix-a79d8.firebaseapp.com',
  projectId: 'telcom-fix-a79d8',
  storageBucket: 'telcom-fix-a79d8.firebasestorage.app',
  messagingSenderId: '308442373389',
  appId: '1:308442373389:web:46da2b2e6abac5c8e8e444',
  measurementId: 'G-XRX708LJRJ',
};

// Prevent re-initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
