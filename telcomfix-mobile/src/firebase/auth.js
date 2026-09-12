// ============================================================
// TelcomFix Mobile — Firebase Auth Service
// ============================================================
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

export const DEMO_ACCOUNTS = {
  customer: {
    email: 'customer@telcomfix.lk',
    password: 'telcom2026',
    role: 'customer',
    displayName: 'Priya Nair',
    towerId: 'TOWER_001',
  },
  engineer: {
    email: 'engineer@telcomfix.lk',
    password: 'telcom2026',
    role: 'engineer',
    displayName: 'Ravi Kumar',
    zone: 'Western Province - South',
  },
};

export async function demoLogin(role) {
  const account = DEMO_ACCOUNTS[role];
  if (!account) throw new Error('Unknown role');

  try {
    const cred = await signInWithEmailAndPassword(auth, account.email, account.password);
    const profile = await getUserProfile(cred.user.uid);
    if (!profile) {
      await createUserProfile(cred.user.uid, account);
    }
    return { user: cred.user, profile: profile || account };
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      const cred = await createUserWithEmailAndPassword(auth, account.email, account.password);
      await updateProfile(cred.user, { displayName: account.displayName });
      const profile = await createUserProfile(cred.user.uid, account);
      return { user: cred.user, profile };
    }
    throw err;
  }
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { uid, ...snap.data() } : null;
}

export async function createUserProfile(uid, data) {
  const profile = { ...data, createdAt: serverTimestamp(), lastLoginAt: serverTimestamp() };
  await setDoc(doc(db, 'users', uid), profile, { merge: true });
  return { uid, ...profile };
}

export function subscribeAuthState(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profile = await getUserProfile(user.uid);
      callback({ user, profile });
    } else {
      callback({ user: null, profile: null });
    }
  });
}

export async function logOut() {
  await signOut(auth);
}
