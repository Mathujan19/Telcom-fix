import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function PredictiveRisk() {
  const { state, dispatch } = useApp();
  const { towers, jobs } = state;
  const [issuingOrder, setIssuingOrder] = useState(null);

  // Sort towers by failure risk descending
  const sortedTowers = [...towers].sort((a, b) => b.failureRisk - a.failureRisk);
  const highRiskTowers = sortedTowers.filter(t => t.failureRisk >= 0.5);
  const medRiskTowers = sortedTowers.filter(t => t.failureRisk >= 0.3 && t.failureRisk < 0.5);

  const getRiskColor = (risk) => {
    if (risk >= 0.7) return '#dc2626';
    if (risk >= 0.5) return '#d97706';
    if (risk >= 0.3) return '#f59e0b';
    return '#16a34a';
  };

  const handleIssueOrder = (tower) => {
    setIssuingOrder(tower.id);
    setTimeout(() => {
      dispatch({
        type: 'ADD_ALARM',
        alarm: {
          id: 'PRED_' + Date.now(),
          towerId: tower.id,
          towerName: tower.name,
          type: 'PREDICTIVE_INSPECTION_ORDER',
          severity: 'warning',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          packetLoss: tower.packetLoss + '%',
          rssi: tower.rssi + ' dBm',
        },
      });
      setIssuingOrder(null);
      alert(`✅ Preemptive inspection order issued for ${tower.name}.\nA field engineer will be scheduled for routine maintenance.`);
    }, 1000);
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Header Stats */}
      <div className="stats-grid" style={{ padding: 0, marginBottom: 20 }}>
        <div className="stat-card red">
          <div className="stat-icon">🔴</div>
          <div className="stat-label">High Risk (≥70%)</div>
          <div className="stat-value">{towers.filter(t => t.failureRisk >= 0.7).length}</div>
          <div className="stat-sub">Immediate attention needed</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon">🟡</div>
          <div className="stat-label">Medium Risk (50-70%)</div>
          <div className="stat-value">{towers.filter(t => t.failureRisk >= 0.5 && t.failureRisk < 0.7).length}</div>
          <div className="stat-sub">Monitor closely</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">🟢</div>
          <div className="stat-label">Low Risk (&lt;50%)</div>
          <div className="stat-value">{towers.filter(t => t.failureRisk < 0.5).length}</div>
          <div className="stat-sub">Normal operations</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">🔮</div>
          <div className="stat-label">Avg Failure Risk</div>
          <div className="stat-value">{Math.round(towers.reduce((s, t) => s + t.failureRisk, 0) / towers.length * 100)}%</div>
          <div className="stat-sub">Across all 25 towers</div>
        </div>
      </div>

      {/* Risk Rankings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">⚠️ High Risk Towers (≥50%)</div>
              <div className="card-subtitle">Predicted to fail before next maintenance cycle</div>
            </div>
          </div>
          <div>
            {highRiskTowers.map(tower => (
              <div key={tower.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: getRiskColor(tower.failureRisk) }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>📡 {tower.name}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{tower.id} · {tower.bands.join('/')}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: getRiskColor(tower.failureRisk) }}>
                      {Math.round(tower.failureRisk * 100)}%
                    </div>
                    <div style={{ fontSize: 10, color: '#9ca3af' }}>Risk</div>
                  </div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${tower.failureRisk * 100}%`,
                        background: getRiskColor(tower.failureRisk),
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>
                    Pkt Loss: {tower.packetLoss}% · RSSI: {tower.rssi} dBm
                  </div>
                  {tower.status === 'OPERATIONAL' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleIssueOrder(tower)}
                      disabled={issuingOrder === tower.id}
                    >
                      {issuingOrder === tower.id ? '⏳' : '📋 Issue Preemptive Order'}
                    </button>
                  )}
                  {tower.status !== 'OPERATIONAL' && (
                    <span className={`badge ${tower.status === 'OUTAGE' ? 'badge-red' : 'badge-yellow'}`}>
                      {tower.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Pattern Analysis */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div className="card-title">📊 Risk Score Methodology</div>
            </div>
            <div className="card-body">
              <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>
                <p style={{ marginBottom: 12 }}>The predictive model scores each tower based on:</p>
                {[
                  { factor: 'Packet Loss Rate', weight: '35%', desc: 'Rolling 7-day average' },
                  { factor: 'RSSI Degradation', weight: '25%', desc: 'Signal strength trend' },
                  { factor: 'Alarm Frequency', weight: '20%', desc: 'Alarms per week' },
                  { factor: 'Hardware Age', weight: '12%', desc: 'Time since last service' },
                  { factor: 'Historical MTTR', weight: '8%', desc: 'Past repair frequency' },
                ].map(item => (
                  <div key={item.factor} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{item.factor}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{item.desc}</div>
                    </div>
                    <div style={{ fontWeight: 800, color: '#dc2626', fontSize: 14 }}>{item.weight}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">🟡 Moderate Risk (30-50%)</div>
            </div>
            <div>
              {medRiskTowers.slice(0, 5).map(tower => (
                <div key={tower.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>📡 {tower.name}</div>
                  </div>
                  <div style={{ width: 80, marginRight: 8 }}>
                    <div className="progress-bar-track" style={{ height: 6 }}>
                      <div className="progress-bar-fill" style={{ width: `${tower.failureRisk * 100}%`, background: '#f59e0b' }} />
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#d97706', fontSize: 13, width: 40 }}>
                    {Math.round(tower.failureRisk * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
