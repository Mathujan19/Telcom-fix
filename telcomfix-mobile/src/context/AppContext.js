// ============================================================
// TelcomFix Mobile — App Context with Firebase Integration
// ============================================================
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { TOWERS, CUSTOMERS, TICKETS, JOBS, ALARM_EVENTS, VAS_ITEMS, CREDIT_HISTORY } from '../data/mockData';
import { subscribeAuthState, demoLogin, logOut } from '../firebase/auth';
import {
  seedIfEmpty, subscribeTowers, subscribeTickets,
  subscribeMyJobs, submitTicket, closeJob as fbCloseJob, pushAlarm,
} from '../firebase/firestore';

const AppContext = createContext(null);

const initialState = {
  // Auth
  role: null,
  currentUser: null,
  firebaseUser: null,
  authLoading: true,

  // Data
  towers: TOWERS,
  tickets: TICKETS,
  jobs: JOBS,
  alarmEvents: ALARM_EVENTS,
  vasItems: VAS_ITEMS,
  creditHistory: CREDIT_HISTORY,

  // UI
  speedTestResult: null,
  pingResult: null,
  firestoreConnected: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        firebaseUser: action.user,
        currentUser: action.profile
          ? { ...action.profile, id: action.profile.uid || action.profile.id }
          : null,
        role: action.profile?.role || null,
        authLoading: false,
      };
    case 'AUTH_DONE':
      return { ...state, authLoading: false };
    case 'SET_ROLE':
      return { ...state, role: action.role, currentUser: action.user };

    // Firestore sync
    case 'SYNC_TOWERS':
      return { ...state, towers: action.data, firestoreConnected: true };
    case 'SYNC_TICKETS':
      return { ...state, tickets: action.data };
    case 'SYNC_JOBS':
      return { ...state, jobs: action.data };
    case 'SYNC_ALARMS':
      return { ...state, alarmEvents: action.data };

    // Local actions
    case 'ADD_TICKET':
      return { ...state, tickets: [action.ticket, ...state.tickets] };
    case 'UPDATE_TICKET':
      return { ...state, tickets: state.tickets.map(t => t.id === action.id ? { ...t, ...action.updates } : t) };
    case 'CLOSE_JOB': {
      const updatedJobs = state.jobs.map(j =>
        j.id === action.jobId ? { ...j, status: 'COMPLETED' } : j
      );
      const updatedTowers = state.towers.map(t =>
        t.id === action.towerId ? { ...t, status: 'OPERATIONAL', alarms: [], impactedSubscribers: 0 } : t
      );
      return { ...state, jobs: updatedJobs, towers: updatedTowers };
    }
    case 'ADD_ALARM':
      return { ...state, alarmEvents: [action.alarm, ...state.alarmEvents].slice(0, 20) };
    case 'SET_SPEED_TEST':
      return { ...state, speedTestResult: action.result };
    case 'SET_PING':
      return { ...state, pingResult: action.result };
    case 'UNSUBSCRIBE_VAS':
      return { ...state, vasItems: state.vasItems.map(v => v.id === action.id ? { ...v, status: 'INACTIVE' } : v) };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [fbReady, setFbReady] = useState(false);

  // ── 1. Firebase Auth listener ──
  useEffect(() => {
    const unsub = subscribeAuthState(({ user, profile }) => {
      if (user && profile) {
        dispatch({ type: 'SET_AUTH', user, profile });
        setFbReady(true);
      } else {
        dispatch({ type: 'AUTH_DONE' });
      }
    });
    const timeout = setTimeout(() => dispatch({ type: 'AUTH_DONE' }), 2500);
    return () => { unsub(); clearTimeout(timeout); };
  }, []);

  // ── 2. Firestore listeners once auth ready ──
  useEffect(() => {
    if (!fbReady || !state.currentUser) return;

    seedIfEmpty().catch(console.error);

    const unsubs = [
      subscribeTowers(data => dispatch({ type: 'SYNC_TOWERS', data })),
    ];

    if (state.role === 'customer' && state.currentUser?.id) {
      unsubs.push(
        subscribeTickets(state.currentUser.id, data => dispatch({ type: 'SYNC_TICKETS', data }))
      );
    }

    if (state.role === 'engineer' && state.currentUser?.id) {
      unsubs.push(
        subscribeMyJobs(state.currentUser.id, data => dispatch({ type: 'SYNC_JOBS', data }))
      );
    }

    return () => unsubs.forEach(u => u());
  }, [fbReady, state.role, state.currentUser?.id]);

  // ── 3. Live alarm simulation ──
  useEffect(() => {
    const ALARM_TYPES = ['RSSI_DROP', 'INTERFERENCE', 'HANDOVER_FAIL', 'BACKHAUL_LATENCY'];
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const alarm = {
          id: 'AL_' + Date.now(),
          towerId: 'TOWER_00' + (Math.floor(Math.random() * 5) + 1),
          type: ALARM_TYPES[Math.floor(Math.random() * ALARM_TYPES.length)],
          severity: Math.random() > 0.7 ? 'critical' : 'warning',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          packetLoss: Math.floor(Math.random() * 60) + '%',
        };
        alarm.towerName = state.towers.find(t => t.id === alarm.towerId)?.name || alarm.towerId;
        dispatch({ type: 'ADD_ALARM', alarm });
        if (state.firestoreConnected) {
          pushAlarm(alarm).catch(() => {});
        }
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [state.towers, state.firestoreConnected]);

  // ── Action helpers ──
  const actions = {
    demoLogin: async (role) => {
      try {
        const { user, profile } = await demoLogin(role);
        dispatch({ type: 'SET_AUTH', user, profile });
        setFbReady(true);
      } catch (err) {
        // Fallback to local mode
        const localUser = role === 'customer'
          ? { id: 'CUST_001', name: 'Priya Nair', phone: '+94 77 123 4567', towerId: 'TOWER_001', dataBalance: 2.4, dataTotal: 10, fupStatus: 'NORMAL', credits: 225, role }
          : { id: 'ENG_001', name: 'Ravi Kumar', zone: 'Western Province - South', role };
        dispatch({ type: 'SET_ROLE', role, user: localUser });
      }
    },

    logout: async () => {
      await logOut().catch(() => {});
      dispatch({ type: 'SET_AUTH', user: null, profile: null });
      setFbReady(false);
    },

    submitTicket: async (ticketData) => {
      dispatch({ type: 'ADD_TICKET', ticket: { ...ticketData, id: 'TKT-' + Date.now() } });
      if (state.firestoreConnected) {
        await submitTicket(ticketData).catch(console.error);
      }
    },

    closeJob: async (jobId, towerId, repairActions, notes) => {
      dispatch({ type: 'CLOSE_JOB', jobId, towerId });
      if (state.firestoreConnected) {
        await fbCloseJob(jobId, towerId, repairActions, notes, state.currentUser?.id).catch(console.error);
      }
    },
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
