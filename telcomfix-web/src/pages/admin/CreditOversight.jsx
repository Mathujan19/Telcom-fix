import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function CreditOversight() {
  const { state, dispatch, actions } = useApp();
  const { aiConfig, towers } = state;
  const [maxCredit, setMaxCredit] = useState(aiConfig.maxAutoRefundPerCycle);
  const [bulkAmount, setBulkAmount] = useState('');
  const [bulkTower, setBulkTower] = useState('');
  const [issuing, setIssuing] = useState(false);
  const [issued, setIssued] = useState(false);

  const outageOrDegradedTowers = towers.filter(t => t.status !== 'OPERATIONAL');

  const handleSaveCap = () => {
    dispatch({ type: 'UPDATE_AI_CONFIG', updates: { maxAutoRefundPerCycle: parseInt(maxCredit) } });
    alert('✅ Auto-refund cap updated to LKR ' + maxCredit + ' per user per cycle.');
  };

  const handleBulkCredit = () => {
    if (!bulkAmount || !bulkTower) {
      alert('Please enter amount and select a tower.');
      return;
    }
    const tower = towers.find(t => t.id === bulkTower);
    setIssuing(true);
    setTimeout(async () => {
      if (actions?.issueBulkCredit) {
        await actions.issueBulkCredit({ towerId: bulkTower, towerName: tower.name, amount: parseInt(bulkAmount), count: tower.impactedSubscribers });
      } else {
        dispatch({ type: 'ISSUE_BULK_CREDIT', towerId: bulkTower, towerName: tower.name, amount: parseInt(bulkAmount), count: tower.impactedSubscribers });
      }
      setIssuing(false);
      setIssued(true);
      setTimeout(() => setIssued(false), 3000);
      setBulkAmount('');
      setBulkTower('');
    }, 1500);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Stats */}
        {[
          { label: 'Max Auto-Credit/User/Cycle', value: `LKR ${aiConfig.maxAutoRefundPerCycle}`, sub: 'Current policy cap', color: 'red', icon: '🛡️' },
          { label: 'Total Credits Issued (Sep)', value: 'LKR 28,450', sub: '190 automatic refunds', color: 'green', icon: '💸' },
          { label: 'Auto-Refund Accuracy', value: '96.2%', sub: 'Customer dispute rate: 3.8%', color: 'blue', icon: '🎯' },
          { label: 'Avg Credit per Customer', value: 'LKR 150', sub: 'This billing cycle', color: 'yellow', icon: '📊' },
        ].map(stat => (
          <div key={stat.label} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value" style={{ fontSize: 22 }}>{stat.value}</div>
            <div className="stat-sub">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Policy Configuration */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🛡️ Auto-Refund Policy Rules</div>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Maximum Auto-Credit Per User Per Billing Cycle (LKR)</label>
              <input
                type="number"
                className="form-input"
                value={maxCredit}
                onChange={e => setMaxCredit(e.target.value)}
                min={50}
                max={2000}
                step={50}
              />
              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>
                Current: LKR {aiConfig.maxAutoRefundPerCycle} · Range: 50–2000
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 8 }}>Credit Tiers by Issue Type</div>
              {[
                { type: 'VAS Unwanted Subscription', amount: 'LKR 100–300', auto: true },
                { type: 'Network Outage &lt;2h', amount: 'LKR 50–100', auto: true },
                { type: 'Network Outage &gt;4h', amount: 'LKR 150–500', auto: true },
                { type: 'Billing Calculation Error', amount: 'LKR 75–200', auto: true },
                { type: 'Device APN Reset Failure', amount: 'LKR 50', auto: false },
              ].map(tier => (
                <div key={tier.type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                  <span dangerouslySetInnerHTML={{ __html: tier.type }} style={{ color: 'var(--gray-700)' }} />
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{tier.amount}</span>
                    <span className={`badge ${tier.auto ? 'badge-green' : 'badge-gray'}`}>{tier.auto ? 'AUTO' : 'MANUAL'}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-primary" onClick={handleSaveCap}>
              💾 Save Policy
            </button>
          </div>
        </div>

        {/* Bulk Credit Tool */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div className="card-title">💸 Bulk Compensation Tool</div>
              <div className="card-subtitle">Issue credits to all customers on an affected tower</div>
            </div>
            <div className="card-body">
              {issued && (
                <div style={{ background: 'var(--green-light)', border: '1px solid #bbf7d0', borderRadius: 10, padding: 12, marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, color: 'var(--green)', fontSize: 13 }}>✅ Credits issued successfully!</div>
                  <div style={{ fontSize: 12, color: '#374151', marginTop: 2 }}>Check audit logs for confirmation.</div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Select Affected Tower</label>
                <select className="form-select" value={bulkTower} onChange={e => setBulkTower(e.target.value)}>
                  <option value="">Select tower...</option>
                  {outageOrDegradedTowers.map(t => (
                    <option key={t.id} value={t.id}>📡 {t.name} · {t.impactedSubscribers} subscribers ({t.status})</option>
                  ))}
                  {towers.filter(t => t.status === 'OPERATIONAL').slice(0, 5).map(t => (
                    <option key={t.id} value={t.id}>📡 {t.name} · {t.id}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Credit Amount Per Customer (LKR)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 200"
                  value={bulkAmount}
                  onChange={e => setBulkAmount(e.target.value)}
                  min={10}
                />
              </div>
              {bulkTower && bulkAmount && (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 12 }}>
                  <strong>Preview:</strong> LKR {bulkAmount} × {towers.find(t => t.id === bulkTower)?.impactedSubscribers || 0} customers = <strong>LKR {parseInt(bulkAmount || 0) * (towers.find(t => t.id === bulkTower)?.impactedSubscribers || 0)}</strong> total
                </div>
              )}
              <button
                className="btn btn-success"
                onClick={handleBulkCredit}
                disabled={issuing || !bulkAmount || !bulkTower}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {issuing ? '⏳ Issuing Credits...' : '💸 Issue Bulk Credits'}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">📈 Credit Spend This Month</div>
            </div>
            <div className="card-body">
              {[
                { week: 'Week 1 (Sep 1-7)', amount: 8200, breakdown: '54 auto-refunds' },
                { week: 'Week 2 (Sep 8-12)', amount: 20250, breakdown: '136 auto + 2 bulk' },
              ].map(wk => (
                <div key={wk.week} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>{wk.week}</span>
                    <span style={{ fontWeight: 700 }}>LKR {wk.amount.toLocaleString()}</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${(wk.amount / 30000) * 100}%`, background: 'var(--green)' }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>{wk.breakdown}</div>
                </div>
              ))}
              <div style={{ paddingTop: 12, borderTop: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total (Sep)</span>
                <span style={{ color: 'var(--red-primary)' }}>LKR 28,450</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
