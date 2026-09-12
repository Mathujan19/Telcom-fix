import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function DispatchPanel() {
  const { state, dispatch, actions } = useApp();
  const { jobs, engineers, towers } = state;
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedEngineer, setSelectedEngineer] = useState('');
  const [dispatching, setDispatching] = useState(false);

  const pendingJobs = jobs.filter(j => j.status === 'PENDING');
  const activeJobs = jobs.filter(j => j.status === 'IN_PROGRESS');
  const completedJobs = jobs.filter(j => j.status === 'COMPLETED');
  const availableEngineers = engineers.filter(e => e.status === 'AVAILABLE');

  const handleDispatch = () => {
    if (!selectedJob || !selectedEngineer) return;
    setDispatching(true);
    setTimeout(async () => {
      await (actions?.dispatchEngineer
        ? actions.dispatchEngineer(selectedJob.id, selectedEngineer)
        : dispatch({ type: 'DISPATCH_ENGINEER', jobId: selectedJob.id, engineerId: selectedEngineer })
      );
      setSelectedJob(null);
      setSelectedEngineer('');
      setDispatching(false);
    }, 1000);
  };

  const SeverityBadge = ({ severity }) => {
    const config = {
      'Critical Outage': 'badge-red',
      'Degraded Hardware': 'badge-yellow',
      'Predictive Alert': 'badge-purple',
    };
    return <span className={`badge ${config[severity] || 'badge-gray'}`}>{severity}</span>;
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Stats */}
      <div className="stats-grid" style={{ padding: 0, marginBottom: 20 }}>
        {[
          { label: 'Pending Dispatch', value: pendingJobs.length, color: 'red', icon: '⏳' },
          { label: 'In Progress', value: activeJobs.length, color: 'blue', icon: '🔧' },
          { label: 'Completed', value: completedJobs.length, color: 'green', icon: '✅' },
          { label: 'Available Engineers', value: availableEngineers.length, color: 'yellow', icon: '👷' },
        ].map(stat => (
          <div key={stat.label} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Jobs List */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div>
                <div className="card-title">📋 Pending Dispatch Queue</div>
                <div className="card-subtitle">Unacknowledged tower failures requiring field intervention</div>
              </div>
            </div>
            <div>
              {pendingJobs.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>
                  ✅ No pending dispatches
                </div>
              ) : (
                pendingJobs.map(job => (
                  <div
                    key={job.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                      borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                      background: selectedJob?.id === job.id ? '#fff5f5' : 'white',
                      borderLeft: selectedJob?.id === job.id ? '4px solid #dc2626' : '4px solid transparent',
                    }}
                    onClick={() => setSelectedJob(job)}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <SeverityBadge severity={job.severity} />
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>{job.id}</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>📡 {job.towerName}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                        ⚠️ {job.alarmCode}{job.alarmCode2 ? ' + ' + job.alarmCode2 : ''} · 👥 {job.impactedSubscribers} subscribers
                      </div>
                    </div>
                    <span style={{ fontSize: 20, color: '#9ca3af' }}>›</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Jobs */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">🔧 Active Field Operations</div>
            </div>
            <div>
              {activeJobs.map(job => {
                const engineer = engineers.find(e => e.id === job.assignedTo);
                return (
                  <div key={job.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, animation: 'pulse-green 2s infinite' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>📡 {job.towerName}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        👷 {engineer?.name || 'Unknown'} · {job.alarmCode}
                      </div>
                    </div>
                    <SeverityBadge severity={job.severity} />
                    <span className="badge badge-blue">IN PROGRESS</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dispatch Panel */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div className="card-title">🚁 Manual Dispatch</div>
            </div>
            <div className="card-body">
              {selectedJob ? (
                <>
                  <div style={{ background: '#fff5f5', border: '1px solid #fca5a5', borderRadius: 12, padding: 14, marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#dc2626', marginBottom: 4 }}>Selected Job: {selectedJob.id}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedJob.towerName}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>⚠️ {selectedJob.alarmCode}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>👥 {selectedJob.impactedSubscribers} subscribers</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assign Field Engineer</label>
                    <select
                      className="form-select"
                      value={selectedEngineer}
                      onChange={e => setSelectedEngineer(e.target.value)}
                    >
                      <option value="">Select engineer...</option>
                      {availableEngineers.map(eng => (
                        <option key={eng.id} value={eng.id}>
                          👷 {eng.name} · {eng.zone}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={handleDispatch}
                    disabled={!selectedEngineer || dispatching}
                  >
                    {dispatching ? '⏳ Dispatching...' : '🚁 Dispatch Engineer'}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
                    onClick={() => setSelectedJob(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px 0' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>👆</div>
                  <div style={{ fontSize: 13 }}>Select a pending job from the queue to dispatch</div>
                </div>
              )}
            </div>
          </div>

          {/* Engineer Status */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">👷 Field Team Status</div>
            </div>
            <div>
              {engineers.map(eng => (
                <div key={eng.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: eng.status === 'AVAILABLE' ? '#22c55e' : eng.status === 'ON_SITE' ? '#3b82f6' : '#f59e0b', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{eng.name}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{eng.zone}</div>
                  </div>
                  <span className={`badge ${eng.status === 'AVAILABLE' ? 'badge-green' : eng.status === 'ON_SITE' ? 'badge-blue' : 'badge-yellow'}`}>
                    {eng.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
