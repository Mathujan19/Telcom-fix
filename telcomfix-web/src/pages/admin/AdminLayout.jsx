import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AIControlPanel from './AIControlPanel';
import CreditOversight from './CreditOversight';
import AuditLogs from './AuditLogs';
import Analytics from './Analytics';
import UserManagement from './UserManagement';

const NAV_ITEMS = [
  { id: 'ai', icon: '🤖', label: 'AI Controls' },
  { id: 'credit', icon: '💰', label: 'Credit Oversight' },
  { id: 'audit', icon: '📋', label: 'Audit Logs' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
  { id: 'users', icon: '👥', label: 'User Management' },
];

export default function AdminLayout() {
  const { state, dispatch } = useApp();
  const [activeNav, setActiveNav] = useState('ai');

  const renderContent = () => {
    switch (activeNav) {
      case 'ai': return <AIControlPanel />;
      case 'credit': return <CreditOversight />;
      case 'audit': return <AuditLogs />;
      case 'analytics': return <Analytics />;
      case 'users': return <UserManagement />;
      default: return <AIControlPanel />;
    }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon" style={{ background: '#7c3aed' }}>⚙️</div>
          <div>
            <div className="logo-name">TelcomFix</div>
            <div className="logo-role">Admin Portal</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Administration</div>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className="nav-section-label" style={{ marginTop: 16 }}>System</div>
          <div style={{ padding: '8px 12px', fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: 'var(--gray-500)' }}>Total Tickets</span>
              <strong>{state.tickets.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: 'var(--gray-500)' }}>Audit Logs</span>
              <strong>{state.auditLogs.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gray-500)' }}>Users</span>
              <strong>{state.users.length}</strong>
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar" style={{ background: '#7c3aed' }}>SA</div>
            <div>
              <div className="user-name">System Admin</div>
              <div className="user-role">Full Access</div>
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

      <main className="main-content">
        <div className="topbar">
          <h1 className="topbar-title">
            {NAV_ITEMS.find(n => n.id === activeNav)?.icon} {NAV_ITEMS.find(n => n.id === activeNav)?.label}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#7c3aed' }}>
            <span>⚙️</span> Admin Mode
          </div>
          <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>
            {new Date().toLocaleString()}
          </div>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}
