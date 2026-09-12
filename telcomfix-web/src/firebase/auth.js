// ============================================================
// TelcomFix — Firebase Authentication Service (Web)
// Handles email/password login with role lookup from Firestore
// ============================================================
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./config";

// ------------------------------------
// Pre-seeded demo accounts (Firestore)
// These match the UI role cards
// ------------------------------------
export const DEMO_ACCOUNTS = {
  noc: {
    email: "noc@telcomfix.lk",
    password: "telcom2026",
    role: "noc",
    displayName: "NOC Operator",
    zone: "Western Province",
  },
  admin: {
    email: "admin@telcomfix.lk",
    password: "telcom2026",
    role: "admin",
    displayName: "System Administrator",
    zone: "All",
  },
  customer: {
    email: "customer@telcomfix.lk",
    password: "telcom2026",
    role: "customer",
    displayName: "Priya Nair",
    towerId: "TOWER_001",
  },
  engineer: {
    email: "engineer@telcomfix.lk",
    password: "telcom2026",
    role: "engineer",
    displayName: "Ravi Kumar",
    zone: "Western Province - South",
  },
};

// ------------------------------------
// Sign In — returns { user, role, profile }
// ------------------------------------
export async function signIn(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(credential.user.uid);
    return { user: credential.user, profile };
  } catch (error) {
    throw mapAuthError(error);
  }
}

// ------------------------------------
// Quick demo login by role (no typing)
// Creates account if it doesn't exist yet
// ------------------------------------
export async function demoLogin(role) {
  const account = DEMO_ACCOUNTS[role];
  if (!account) throw new Error("Unknown role: " + role);

  try {
    // Try signing in first
    const credential = await signInWithEmailAndPassword(auth, account.email, account.password);
    let profile = await getUserProfile(credential.user.uid);

    // If profile doesn't exist yet, create it
    if (!profile) {
      profile = await createUserProfile(credential.user.uid, {
        role: account.role,
        displayName: account.displayName,
        email: account.email,
        zone: account.zone || null,
        towerId: account.towerId || null,
      });
    }

    return { user: credential.user, profile };
  } catch (error) {
    if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
      // Create the demo account
      return await createDemoAccount(role);
    }
    throw mapAuthError(error);
  }
}

// ------------------------------------
// Create demo account in Firebase Auth + Firestore
// ------------------------------------
async function createDemoAccount(role) {
  const account = DEMO_ACCOUNTS[role];
  const credential = await createUserWithEmailAndPassword(auth, account.email, account.password);

  await updateProfile(credential.user, { displayName: account.displayName });

  const profile = await createUserProfile(credential.user.uid, {
    role: account.role,
    displayName: account.displayName,
    email: account.email,
    zone: account.zone || null,
    towerId: account.towerId || null,
  });

  return { user: credential.user, profile };
}

// ------------------------------------
// Sign Out
// ------------------------------------
export async function logOut() {
  await signOut(auth);
}

// ------------------------------------
// Get user profile from Firestore users/{uid}
// ------------------------------------
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { uid, ...snap.data() } : null;
}

// ------------------------------------
// Create / overwrite user profile in Firestore
// ------------------------------------
export async function createUserProfile(uid, data) {
  const profile = {
    ...data,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };
  await setDoc(doc(db, "users", uid), profile, { merge: true });
  return { uid, ...profile };
}

// ------------------------------------
// Auth state listener — call on app startup
// Returns unsubscribe function
// ------------------------------------
export function subscribeAuthState(callback) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const profile = await getUserProfile(firebaseUser.uid);
      callback({ user: firebaseUser, profile });
    } else {
      callback({ user: null, profile: null });
    }
  });
}

// ------------------------------------
// Update last login timestamp
// ------------------------------------
export async function touchLastLogin(uid) {
  await setDoc(doc(db, "users", uid), { lastLoginAt: serverTimestamp() }, { merge: true });
}

// ------------------------------------
// Map Firebase auth errors to friendly messages
// ------------------------------------
function mapAuthError(error) {
  const messages = {
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-email": "Invalid email address.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment.",
    "auth/invalid-credential": "Invalid credentials. Try the demo login.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/configuration-not-found": "Enable Email/Password in Firebase Console → Authentication → Sign-in method.",
    "auth/operation-not-allowed": "Email/Password auth not enabled in Firebase Console.",
  };
  const friendly = messages[error.code] || error.message;
  return new Error(friendly);
}
