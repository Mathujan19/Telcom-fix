// ============================================================
// TelcomFix — Firestore Database Service (Web)
// Real-time listeners and write helpers for towers, tickets,
// alarms, jobs, audit logs
// ============================================================
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./config";
import { TOWERS, TICKETS, JOBS, ALARM_EVENTS_INITIAL, AUDIT_LOGS, USERS, ENGINEERS } from "../data/mockData";

// ============================================================
// SEED HELPERS — populate Firestore with mock data on first run
// ============================================================

/**
 * Seeds all mock data into Firestore collections.
 * Checks if towers already exist before seeding (idempotent).
 */
export async function seedFirestoreIfEmpty() {
  try {
    const snap = await getDocs(collection(db, "towers"));
    if (!snap.empty) {
      console.log("ℹ️ Firestore already seeded — skipping.");
      return false;
    }

    console.log("🌱 Seeding Firestore with mock data...");
    const batch = writeBatch(db);

    // Towers
    TOWERS.forEach((tower) => {
      batch.set(doc(db, "towers", tower.id), {
        ...tower,
        updatedAt: serverTimestamp(),
      });
    });

    // Tickets
    TICKETS.forEach((ticket) => {
      batch.set(doc(db, "tickets", ticket.id), {
        ...ticket,
        createdAt: serverTimestamp(),
      });
    });

    // Jobs
    JOBS.forEach((job) => {
      batch.set(doc(db, "jobs", job.id), {
        ...job,
        updatedAt: serverTimestamp(),
      });
    });

    // Engineers
    ENGINEERS.forEach((eng) => {
      batch.set(doc(db, "engineers", eng.id), eng);
    });

    await batch.commit();

    // Alarms and audit logs (too many for a single batch)
    for (const alarm of ALARM_EVENTS_INITIAL) {
      await setDoc(doc(db, "alarms", alarm.id), {
        ...alarm,
        createdAt: serverTimestamp(),
      });
    }

    for (const log of AUDIT_LOGS) {
      await setDoc(doc(db, "auditLogs", log.id), {
        ...log,
        createdAt: serverTimestamp(),
      });
    }

    console.log("✅ Firestore seeded successfully!");
    return true;
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    return false;
  }
}

// ============================================================
// REAL-TIME LISTENERS
// ============================================================

/** Listen to all towers in real-time */
export function subscribeTowers(callback) {
  return onSnapshot(collection(db, "towers"), (snap) => {
    const towers = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(towers);
  });
}

/** Listen to live alarm stream (last 50, newest first) */
export function subscribeAlarms(callback) {
  const q = query(collection(db, "alarms"), orderBy("createdAt", "desc"), limit(50));
  return onSnapshot(q, (snap) => {
    const alarms = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(alarms);
  });
}

/** Listen to all tickets */
export function subscribeTickets(callback) {
  const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const tickets = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(tickets);
  });
}

/** Listen to jobs */
export function subscribeJobs(callback) {
  return onSnapshot(collection(db, "jobs"), (snap) => {
    const jobs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(jobs);
  });
}

/** Listen to engineers */
export function subscribeEngineers(callback) {
  return onSnapshot(collection(db, "engineers"), (snap) => {
    const engineers = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(engineers);
  });
}

/** Listen to audit logs (last 100) */
export function subscribeAuditLogs(callback) {
  const q = query(collection(db, "auditLogs"), orderBy("timestamp", "desc"), limit(100));
  return onSnapshot(q, (snap) => {
    const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(logs);
  });
}

// ============================================================
// WRITE OPERATIONS
// ============================================================

/** Add a new customer ticket */
export async function createTicket(ticketData) {
  return await addDoc(collection(db, "tickets"), {
    ...ticketData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** Update a ticket's status/stage/resolution */
export async function updateTicket(ticketId, updates) {
  await updateDoc(doc(db, "tickets", ticketId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/** Push a live telemetry alarm event */
export async function pushAlarmEvent(alarmData) {
  return await addDoc(collection(db, "alarms"), {
    ...alarmData,
    createdAt: serverTimestamp(),
  });
}

/** Update tower status (e.g. OUTAGE → OPERATIONAL after job close) */
export async function updateTowerStatus(towerId, updates) {
  await updateDoc(doc(db, "towers", towerId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/** Dispatch an engineer to a job */
export async function dispatchEngineer(jobId, engineerId) {
  const batch = writeBatch(db);

  batch.update(doc(db, "jobs", jobId), {
    assignedTo: engineerId,
    status: "IN_PROGRESS",
    dispatched: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  batch.update(doc(db, "engineers", engineerId), {
    status: "IN_TRANSIT",
    currentJobId: jobId,
  });

  await batch.commit();
}

/** Close a job — sets tower to OPERATIONAL, logs audit entry */
export async function closeJob(jobId, towerId, repairActions, notes, engineerId) {
  const batch = writeBatch(db);

  // Close the job
  batch.update(doc(db, "jobs", jobId), {
    status: "COMPLETED",
    repairActions,
    notes,
    closedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Restore the tower
  batch.update(doc(db, "towers", towerId), {
    status: "OPERATIONAL",
    alarms: [],
    impactedSubscribers: 0,
    packetLoss: 2,
    rssi: -72,
    updatedAt: serverTimestamp(),
  });

  // Update engineer status
  batch.update(doc(db, "engineers", engineerId), {
    status: "AVAILABLE",
    currentJobId: null,
  });

  await batch.commit();

  // Add audit log entry
  await addDoc(collection(db, "auditLogs"), {
    ticketId: jobId,
    action: "JOB_CLOSED",
    engineerId,
    towerId,
    repairActions,
    notes,
    aiConfidence: 1.0,
    result: `Tower ${towerId} restored to OPERATIONAL`,
    timestamp: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}

/** Issue bulk credits to customers on a tower */
export async function issueBulkCredit(towerId, towerName, amount, subscriberCount) {
  return await addDoc(collection(db, "auditLogs"), {
    ticketId: "BULK",
    action: `BULK_CREDIT_LKR${amount}`,
    customerId: towerId,
    checks: "manual override",
    aiConfidence: 1.0,
    result: `LKR ${amount} issued to ${subscriberCount} customers on ${towerName}`,
    timestamp: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}

/** Update AI system configuration */
export async function saveAIConfig(config) {
  await setDoc(doc(db, "systemConfig", "aiConfig"), {
    ...config,
    updatedAt: serverTimestamp(),
  });
}

/** Subscribe to AI config changes */
export function subscribeAIConfig(callback) {
  return onSnapshot(doc(db, "systemConfig", "aiConfig"), (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    }
  });
}

/** Add a user profile to Firestore */
export async function addUserToFirestore(userData) {
  await setDoc(doc(db, "userProfiles", userData.id), {
    ...userData,
    createdAt: serverTimestamp(),
  });
}
