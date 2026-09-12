import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClipboardList, Bot, Truck, Coins, Zap, Wrench, Search } from 'lucide-react';

export default function AuditLogs() {
  const { state } = useApp();
  const { auditLogs } = state;
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const actionTypes = ['all', ...new Set(auditLogs.map(l => l.action.split('_')[0]))];

  const filtered = auditLogs.filter(log => {
    const matchSearch = !search || log.ticketId.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase()) || log.customerId?.toLowerCase().includes(search.toLowerCase());
    const matchAction = filterAction === 'all' || log.action.startsWith(filterAction);
    return matchSearch && matchAction;
  });

  const getActionBadge = (action) => {
    if (action.includes('REFUND') || action.includes('CREDIT')) return <span className="badge badge-green"><Coins size={14} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: 4}} /> {action}</span>;
    if (action.includes('OUTAGE') || action.includes('BROADCAST')) return <span className="badge badge-red"><Zap size={14} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: 4}} /> {action}</span>;
    if (action.includes('DISPATCH')) return <span className="badge badge-blue"><Truck size={14} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: 4}} /> {action}</span>;
    if (action.includes('APN')) return <span className="badge badge-purple"><Wrench size={14} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: 4}} /> {action}</span>;
    return <span className="badge badge-gray">{action}</span>;
  };

  const getConfidenceColor = (c) => c >= 0.9 ? '#16a34a' : c >= 0.8 ? '#d97706' : '#dc2626';

  return (
    <div style={{ padding: 20 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Total Actions', value: auditLogs.length, icon: <ClipboardList size={24} />, color: 'blue' },
          { label: 'Auto-Resolutions', value: auditLogs.filter(l => !l.action.includes('DISPATCH')).length, icon: <Bot size={24} />, color: 'green' },
          { label: 'Field Dispatches', value: auditLogs.filter(l => l.action.includes('DISPATCH')).length, icon: <Truck size={24} />, color: 'yellow' },
          { label: 'Credits Issued', value: auditLogs.filter(l => l.action.includes('CREDIT') || l.action.includes('REFUND')).length, icon: <Coins size={24} />, color: 'red' },
        ].map(stat => (
          <div key={stat.label} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title"><ClipboardList size={18} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: 8}} /> End-to-End Audit Log Repository</div>
            <div className="card-subtitle">Every automated action tracked · {filtered.length} results</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', display: 'flex' }}><Search size={16} /></span>
              <input
                type="text"
                className="form-input"
                placeholder="Search ticket, action, customer..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 32, width: 250, height: 36 }}
              />
            </div>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Ticket ID</th>
                <th>Customer</th>
                <th>Action Taken</th>
                <th>Diagnostic Checks</th>
                <th>AI Confidence</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--gray-500)' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <code style={{ background: '#f8fafc', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
                      {log.ticketId}
                    </code>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--gray-600)' }}>{log.customerId}</td>
                  <td>{getActionBadge(log.action)}</td>
                  <td>
                    <code style={{ fontSize: 11, color: 'var(--gray-600)', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                      {log.checks}
                    </code>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 40 }}>
                        <div className="progress-bar-track" style={{ height: 6 }}>
                          <div className="progress-bar-fill" style={{ width: `${log.aiConfidence * 100}%`, background: getConfidenceColor(log.aiConfidence) }} />
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: getConfidenceColor(log.aiConfidence) }}>
                        {Math.round(log.aiConfidence * 100)}%
                      </span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--gray-700)', maxWidth: 200 }}>{log.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
