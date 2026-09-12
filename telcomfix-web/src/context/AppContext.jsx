// ============================================================
// TelcomFix — App Context (Web)
// Integrates Firebase Auth + Firestore with local mock data fallback
// ============================================================
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import {
  TOWERS, ENGINEERS, CUSTOMERS, TICKETS, JOBS,
  ALARM_EVENTS_INITIAL, AUDIT_LOGS, USERS, AI_CONFIG_DEFAULTS, MTTR_DATA
} from '../data/mockData';
import { subscribeAuthState, demoLogin, logOut } from '../firebase/auth';
import {
  seedFirestoreIfEmpty,
  subscribeTowers,
  subscribeAlarms,
  subscribeTickets,
  subscribeJobs,
  subscribeEngineers,
  subscribeAuditLogs,
  subscribeAIConfig,
  dispatchEngineer,
  closeJob,
  issueBulkCredit,
  saveAIConfig,
  pushAlarmEvent,
  addUserToFirestore,
  updateTowerStatus,
} from '../firebase/firestore';

const AppContext = createContext(null);

// ──────────────────────────────────────────────
// Initial State (mock data as defaults)
// ──────────────────────────────────────────────
const initialState = {
  // Auth
  role: null,
  firebaseUser: null,
  userProfile: null,
  authLoading: true,

  // Network data (replaced by Firestore listeners when online)
  towers: TOWERS,
  engineers: ENGINEERS,
  tickets: TICKETS,
  jobs: JOBS,
  alarmEvents: ALARM_EVENTS_INITIAL,
  auditLogs: AUDIT_LOGS,
  users: USERS,
  aiConfig: AI_CONFIG_DEFAULTS,
  mttrData: MTTR_DATA,

  // UI state
  selectedTower: null,
  firestoreConnected: false,
};

// ──────────────────────────────────────────────
// Reducer
// ──────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    // ── Auth ──
    case 'SET_AUTH':
      return {
        ...state,
        firebaseUser: action.user,
        userProfile: action.profile,
        role: action.profile?.role || null,
        authLoading: false,
      };
    case 'SET_ROLE':
      return { ...state, role: action.role };
    case 'AUTH_LOADING_DONE':
      return { ...state, authLoading: false };

    // ── Firestore live sync ──
    case 'SYNC_TOWERS':
      return { ...state, towers: action.data, firestoreConnected: true };
    case 'SYNC_ALARMS':
      return { ...state, alarmEvents: action.data };
    case 'SYNC_TICKETS':
      return { ...state, tickets: action.data };
    case 'SYNC_JOBS':
      return { ...state, jobs: action.data };
    case 'SYNC_ENGINEERS':
      return { ...state, engineers: action.data };
    case 'SYNC_AUDIT_LOGS':
      return { ...state, auditLogs: action.data };
    case 'SYNC_AI_CONFIG':
      return { ...state, aiConfig: { ...state.aiConfig, ...action.data } };

    // ── Local-only optimistic updates (immediate UI feedback) ──
    case 'SET_SELECTED_TOWER':
      return { ...state, selectedTower: action.tower };
    case 'DISPATCH_ENGINEER': {
      const updatedJobs = state.jobs.map(j =>
        j.id === action.jobId
          ? { ...j, assignedTo: action.engineerId, status: 'IN_PROGRESS', dispatched: new Date().toISOString() }
          : j
      );
      const updatedEngineers = state.engineers.map(e =>
        e.id === action.engineerId ? { ...e, status: 'IN_TRANSIT', currentJobId: action.jobId } : e
      );
      return { ...state, jobs: updatedJobs, engineers: updatedEngineers };
    }
    case 'CLOSE_JOB': {
      const updatedJobs = state.jobs.map(j =>
        j.id === action.jobId ? { ...j, status: 'COMPLETED' } : j
      );
      const updatedTowers = state.towers.map(t =>
        t.id === action.towerId
          ? { ...t, status: 'OPERATIONAL', alarms: [], impactedSubscribers: 0, packetLoss: 2, rssi: -72 }
          : t
      );
      return { ...state, jobs: updatedJobs, towers: updatedTowers };
    }
    case 'ADD_ALARM':
      return { ...state, alarmEvents: [action.alarm, ...state.alarmEvents].slice(0, 50) };
    case 'UPDATE_AI_CONFIG':
      return { ...state, aiConfig: { ...state.aiConfig, ...action.updates } };
    case 'ISSUE_BULK_CREDIT':
      return {
        ...state,
        auditLogs: [{
          id: 'LOG_BULK_' + Date.now(),
          timestamp: new Date().toISOString(),
          ticketId: 'BULK',
          customerId: action.towerId,
          action: `BULK_CREDIT_LKR${action.amount}`,
          checks: 'manual override',
          aiConfidence: 1.0,
          result: `LKR ${action.amount} credit issued to ${action.count} customers on ${action.towerName}`,
        }, ...state.auditLogs],
      };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.user] };
    case 'UPDATE_USER':
      return { ...state, users: state.users.map(u => u.id === action.id ? { ...u, ...action.updates } : u) };

    default:
      return state;
  }
}

// ──────────────────────────────────────────────
// Simulated alarm types (for live mock stream)
// ──────────────────────────────────────────────
const ALARM_TYPES = ['RSSI_DROP', 'INTERFERENCE', 'HANDOVER_FAIL', 'BACKHAUL_LATENCY', 'VSWR_FAULT', 'CELL_UNAVAILABLE'];

// ──────────────────────────────────────────────
// Provider
// ──────────────────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [firestoreReady, setFirestoreReady] = useState(false);

  // ── 1. Firebase Auth Listener ──
  useEffect(() => {
    const unsubAuth = subscribeAuthState(({ user, profile }) => {
      dispatch({ type: 'SET_AUTH', user, profile });
      if (user) setFirestoreReady(true);
    });
    // If no auth response in 2s, mark loading done (offline/demo mode)
    const timeout = setTimeout(() => dispatch({ type: 'AUTH_LOADING_DONE' }), 2000);
    return () => { unsubAuth(); clearTimeout(timeout); };
  }, []);

  // ── 2. Firestore Real-Time Subscriptions (once auth is ready) ──
  useEffect(() => {
    if (!firestoreReady) return;

    // Seed Firestore if empty (first run)
    seedFirestoreIfEmpty().catch(console.error);

    const unsubs = [
      subscribeTowers(data => dispatch({ type: 'SYNC_TOWERS', data })),
      subscribeAlarms(data => dispatch({ type: 'SYNC_ALARMS', data })),
      subscribeTickets(data => dispatch({ type: 'SYNC_TICKETS', data })),
      subscribeJobs(data => dispatch({ type: 'SYNC_JOBS', data })),
      subscribeEngineers(data => dispatch({ type: 'SYNC_ENGINEERS', data })),
      subscribeAuditLogs(data => dispatch({ type: 'SYNC_AUDIT_LOGS', data })),
      subscribeAIConfig(data => dispatch({ type: 'SYNC_AI_CONFIG', data })),
    ];

    return () => unsubs.forEach(u => u());
  }, [firestoreReady]);

  // ── 3. Live Alarm Simulation (pushes to Firestore if connected, local otherwise) ──
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.55) {
        const tower = state.towers[Math.floor(Math.random() * state.towers.length)];
        const alarm = {
          id: 'AL_' + Date.now(),
          towerId: tower.id,
          towerName: tower.name,
          type: ALARM_TYPES[Math.floor(Math.random() * ALARM_TYPES.length)],
          severity: Math.random() > 0.65 ? 'critical' : 'warning',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          packetLoss: Math.floor(Math.random() * 40) + '%',
          rssi: '-' + (Math.floor(Math.random() * 40) + 70) + ' dBm',
          createdAt: new Date().toISOString(),
        };

        if (state.firestoreConnected) {
          pushAlarmEvent(alarm).catch(console.error); // Firestore will trigger the listener
        } else {
          dispatch({ type: 'ADD_ALARM', alarm }); // Local fallback
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [state.towers, state.firestoreConnected]);

  // ──────────────────────────────────────────────
  // Action Dispatchers (write to Firestore + optimistic local update)
  // ──────────────────────────────────────────────
  const actions = {
    // Auth
    demoLogin: async (role) => {
      try {
        const { user, profile } = await demoLogin(role);
        dispatch({ type: 'SET_AUTH', user, profile });
        setFirestoreReady(true);
        return profile;
      } catch (err) {
        console.error('Login failed:', err);
        // Fallback: set role locally without Firebase
        dispatch({ type: 'SET_ROLE', role });
        throw err;
      }
    },

    logout: async () => {
      await logOut().catch(console.error);
      dispatch({ type: 'SET_AUTH', user: null, profile: null });
      setFirestoreReady(false);
    },

    // Dispatch engineer (optimistic + Firestore)
    dispatchEngineer: async (jobId, engineerId) => {
      dispatch({ type: 'DISPATCH_ENGINEER', jobId, engineerId }); // Optimistic
      if (state.firestoreConnected) {
        await dispatchEngineer(jobId, engineerId).catch(console.error);
      }
    },

    // Close job (optimistic + Firestore)
    closeJob: async (jobId, towerId, repairActions, notes) => {
      dispatch({ type: 'CLOSE_JOB', jobId, towerId }); // Optimistic
      const engId = state.jobs.find(j => j.id === jobId)?.assignedTo || 'ENG_001';
      if (state.firestoreConnected) {
        await closeJob(jobId, towerId, repairActions, notes, engId).catch(console.error);
      }
    },

    // Update AI config
    updateAIConfig: async (updates) => {
      dispatch({ type: 'UPDATE_AI_CONFIG', updates }); // Optimistic
      if (state.firestoreConnected) {
        await saveAIConfig({ ...state.aiConfig, ...updates }).catch(console.error);
      }
    },

    // Issue bulk credits
    issueBulkCredit: async ({ towerId, towerName, amount, count }) => {
      dispatch({ type: 'ISSUE_BULK_CREDIT', towerId, towerName, amount, count }); // Optimistic
      if (state.firestoreConnected) {
        await issueBulkCredit(towerId, towerName, amount, count).catch(console.error);
      }
    },

    // Add user
    addUser: async (user) => {
      dispatch({ type: 'ADD_USER', user });
      if (state.firestoreConnected) {
        await addUserToFirestore(user).catch(console.error);
      }
    },

    updateUser: (id, updates) => dispatch({ type: 'UPDATE_USER', id, updates }),
    setSelectedTower: (tower) => dispatch({ type: 'SET_SELECTED_TOWER', tower }),
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
