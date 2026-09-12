import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import NocMap from './NocMap';
import AlarmTable from './AlarmTable';
import DispatchPanel from './DispatchPanel';
import PredictiveRisk from './PredictiveRisk';

const NAV_ITEMS = [
  { id: 'map', icon: '🗺️', label: 'Live Network Map' },
  { id: 'alarms', icon: '🚨', label: 'Alarm Monitor' },
  { id: 'dispatch', icon: '🚁', label: 'Dispatch Control' },
  { id: 'predictive', icon: '🔮', label: 'Predictive Risk' },
];

export default function NocLayout() {
  const { state, dispatch } = useApp();
  const [activeNav, setActiveNav] = useState('map');

  const outageCount = state.towers.filter(t => t.status === 'OUTAGE').length;
  const criticalAlarms = state.alarmEvents.filter(a => a.severity === 'critical').length;

  const renderContent = () => {
    switch (activeNav) {
      case 'map': return <NocMap />;
      case 'alarms': return <AlarmTable />;
      case 'dispatch': return <DispatchPanel />;
      case 'predictive': return <PredictiveRisk />;
      default: return <NocMap />;
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">📡</div>
          <div>
            <div className="logo-name">TelcomFix</div>
            <div className="logo-role">NOC Portal</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
              {item.id === 'map' && outageCount > 0 && (
                <span className="nav-badge">{outageCount}</span>
              )}
              {item.id === 'alarms' && criticalAlarms > 0 && (
                <span className="nav-badge">{criticalAlarms}</span>
              )}
            </button>
          ))}

          <div className="nav-section-label" style={{ marginTop: 16 }}>Quick Stats</div>
          <div style={{ padding: '8px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
              <span style={{ color: 'var(--gray-500)' }}>🔴 Outage</span>
              <span style={{ fontWeight: 700, color: 'var(--red-primary)' }}>
                {state.towers.filter(t => t.status === 'OUTAGE').length}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
              <span style={{ color: 'var(--gray-500)' }}>🟡 Degraded</span>
              <span style={{ fontWeight: 700, color: 'var(--yellow)' }}>
                {state.towers.filter(t => t.status === 'DEGRADED').length}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'var(--gray-500)' }}>🟢 Normal</span>
              <span style={{ fontWeight: 700, color: 'var(--green)' }}>
                {state.towers.filter(t => t.status === 'OPERATIONAL').length}
              </span>
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">NO</div>
            <div>
              <div className="user-name">NOC Operator</div>
              <div className="user-role">Western Province</div>
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
            onClick={() => dispatch({ type: 'SET_ROLE', role: null })}
          >
            ← Switch Role
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="topbar">
          <h1 className="topbar-title">
            {NAV_ITEMS.find(n => n.id === activeNav)?.icon} {NAV_ITEMS.find(n => n.id === activeNav)?.label}
          </h1>
          <div className="live-indicator">
            <div className="live-dot" />
            Live Feed
          </div>
          <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>
            {new Date().toLocaleTimeString()} · {state.towers.length} towers monitored
          </div>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}
