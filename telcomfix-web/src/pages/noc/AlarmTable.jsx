import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AlarmTable() {
  const { state } = useApp();
  const { alarmEvents, towers, tickets } = state;
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredAlarms = alarmEvents.filter(alarm => {
    if (filter !== 'all' && alarm.severity !== filter) return false;
    if (search && !alarm.towerName?.toLowerCase().includes(search.toLowerCase()) && !alarm.type.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Incident linking: match complaint clusters to alarms
  const outageTowers = towers.filter(t => t.status !== 'OPERATIONAL');
  const correlations = outageTowers.map(tower => {
    const relatedTickets = tickets.filter(tk => tk.towerIds?.includes(tower.id));
    const relatedAlarms = alarmEvents.filter(a => a.towerId === tower.id);
    return { tower, ticketCount: relatedTickets.length, alarmCount: relatedAlarms.length };
  });

  return (
    <div style={{ padding: 20 }}>
      {/* Incident Correlation Panel */}
      {correlations.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="card-header" style={{ padding: '14px 20px', background: 'white', borderRadius: '16px 16px 0 0', border: '1px solid #e2e8f0', borderBottom: 'none' }}>
            <div>
              <div className="card-title">🔗 Incident Correlation Engine</div>
              <div className="card-subtitle">Matching customer complaint surges to tower alarms</div>
            </div>
            <div className="badge badge-red">AI Linked</div>
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0 0 16px 16px', overflow: 'hidden' }}>
            {correlations.map(({ tower, ticketCount, alarmCount }) => (
              <div key={tower.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: tower.status === 'OUTAGE' ? '#ef4444' : '#f59e0b', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>📡 {tower.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{tower.alarms.join(', ') || 'No active alarms'}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#dc2626' }}>{ticketCount}</div>
                  <div style={{ fontSize: 10, color: '#9ca3af' }}>Complaints</div>
                </div>
                <div style={{ fontSize: 14 }}>↔️</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#7c3aed' }}>{alarmCount}</div>
                  <div style={{ fontSize: 10, color: '#9ca3af' }}>Alarms</div>
                </div>
                <span className={`badge ${tower.status === 'OUTAGE' ? 'badge-red' : 'badge-yellow'}`}>
                  {tower.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alarm Stream Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">⚡ Live Telemetry Alarm Stream</div>
            <div className="card-subtitle">{filteredAlarms.length} events · auto-updating every 5s</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#9ca3af' }}>🔍</span>
              <input
                type="text"
                className="form-input"
                placeholder="Search alarms..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 32, width: 200, height: 36 }}
              />
            </div>
            {['all', 'critical', 'warning'].map(f => (
              <button
                key={f}
                className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f === 'critical' ? '🔴 Critical' : '🟡 Warning'}
              </button>
            ))}
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Tower</th>
                <th>Alarm Type</th>
                <th>Severity</th>
                <th>Packet Loss</th>
                <th>RSSI</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlarms.map(alarm => (
                <tr key={alarm.id} className={alarm.severity === 'critical' ? 'alarm-row-critical' : 'alarm-row-warning'}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{alarm.time}</td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>📡 {alarm.towerName}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{alarm.towerId}</div>
                  </td>
                  <td>
                    <code style={{ background: '#f8fafc', padding: '2px 6px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
                      {alarm.type}
                    </code>
                  </td>
                  <td>
                    <span className={`badge ${alarm.severity === 'critical' ? 'badge-red' : 'badge-yellow'}`}>
                      {alarm.severity === 'critical' ? '🔴' : '🟡'} {alarm.severity}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: parseInt(alarm.packetLoss) > 50 ? '#dc2626' : '#d97706' }}>
                    {alarm.packetLoss}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{alarm.rssi}</td>
                  <td>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', marginRight: 6, animation: 'pulse-green 1.5s infinite' }} />
                    Active
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
