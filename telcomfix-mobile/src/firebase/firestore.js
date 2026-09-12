// ============================================================
// TelcomFix Mobile — Firestore Service
// Real-time listeners for tickets, towers, jobs, alarms
// ============================================================
import {
  collection, doc, addDoc, updateDoc, setDoc, onSnapshot,
  query, orderBy, limit, where, serverTimestamp, writeBatch, getDocs,
} from 'firebase/firestore';
import { db } from './config';
import { TOWERS, TICKETS, JOBS, ALARM_EVENTS_INITIAL, ENGINEERS } from '../data/mockData';

// ── Seed Firestore on first launch ──
export async function seedIfEmpty() {
  try {
    const snap = await getDocs(collection(db, 'towers'));
    if (!snap.empty) return false;

    const batch = writeBatch(db);
    TOWERS.forEach(t => batch.set(doc(db, 'towers', t.id), { ...t, updatedAt: serverTimestamp() }));
    TICKETS.forEach(t => batch.set(doc(db, 'tickets', t.id), { ...t, createdAt: serverTimestamp() }));
    JOBS.forEach(j => batch.set(doc(db, 'jobs', j.id), { ...j, updatedAt: serverTimestamp() }));
    ENGINEERS.forEach(e => batch.set(doc(db, 'engineers', e.id), e));
    await batch.commit();

    for (const alarm of ALARM_EVENTS_INITIAL) {
      await setDoc(doc(db, 'alarms', alarm.id), { ...alarm, createdAt: serverTimestamp() });
    }
    return true;
  } catch (e) {
    console.error('Seed failed:', e);
    return false;
  }
}

// ── Real-time listeners ──
export function subscribeTowers(cb) {
  return onSnapshot(collection(db, 'towers'), snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
}

export function subscribeTickets(customerId, cb) {
  const q = query(
    collection(db, 'tickets'),
    where('customerId', '==', customerId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export function subscribeMyJobs(engineerId, cb) {
  const q = query(collection(db, 'jobs'), where('assignedTo', '==', engineerId));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export function subscribeAlarms(towerId, cb) {
  const q = query(
    collection(db, 'alarms'),
    where('towerId', '==', towerId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

// ── Write operations ──
export async function submitTicket(ticketData) {
  return await addDoc(collection(db, 'tickets'), {
    ...ticketData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function closeJob(jobId, towerId, repairActions, notes, engineerId) {
  const batch = writeBatch(db);
  batch.update(doc(db, 'jobs', jobId), {
    status: 'COMPLETED', repairActions, notes,
    closedAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  batch.update(doc(db, 'towers', towerId), {
    status: 'OPERATIONAL', alarms: [], impactedSubscribers: 0,
    packetLoss: 2, rssi: -72, updatedAt: serverTimestamp(),
  });
  if (engineerId) {
    batch.update(doc(db, 'engineers', engineerId), { status: 'AVAILABLE', currentJobId: null });
  }
  await batch.commit();

  await addDoc(collection(db, 'auditLogs'), {
    action: 'JOB_CLOSED', jobId, towerId, engineerId,
    repairActions, notes, aiConfidence: 1.0,
    result: `Tower ${towerId} restored to OPERATIONAL`,
    timestamp: serverTimestamp(), createdAt: serverTimestamp(),
  });
}

export async function pushAlarm(alarmData) {
  return await addDoc(collection(db, 'alarms'), {
    ...alarmData, createdAt: serverTimestamp(),
  });
}
