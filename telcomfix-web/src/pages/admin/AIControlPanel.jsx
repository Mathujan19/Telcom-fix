import React from 'react';
import { useApp } from '../../context/AppContext';

const SLIDERS = [
  { key: 'autoRefundConfidence', label: 'Auto-Refund Confidence Threshold', desc: 'Min AI confidence to automatically issue billing refunds', icon: '💰' },
  { key: 'apnResetConfidence', label: 'APN Reset Confidence Threshold', desc: 'Min confidence to push OTA carrier settings reset', icon: '📱' },
  { key: 'outageBoradcastConfidence', label: 'Outage Broadcast Confidence', desc: 'Min confidence to broadcast outage alerts to customers', icon: '📢' },
  { key: 'fieldDispatchConfidence', label: 'Field Dispatch Confidence', desc: 'Min confidence to automatically assign field engineers', icon: '🚁' },
  { key: 'predictiveAlertRiskThreshold', label: 'Predictive Alert Risk Threshold', desc: 'Min failure risk score to trigger predictive maintenance alert', icon: '🔮' },
];

const TOGGLES = [
  { key: 'enableAutoRefund', label: 'Enable Automatic Refunds', desc: 'Allow AI to issue goodwill credits without human approval' },
  { key: 'enableOutageBroadcast', label: 'Enable Outage Broadcasts', desc: 'Auto-notify customers when their tower goes to OUTAGE status' },
  { key: 'enableApnReset', label: 'Enable OTA APN Reset', desc: 'Allow remote carrier settings updates to customer devices' },
  { key: 'enablePredictiveAlerts', label: 'Enable Predictive Alerts', desc: 'Show early-warning flags for towers exceeding risk threshold' },
];

export default function AIControlPanel() {
  const { state, dispatch, actions } = useApp();
  const { aiConfig } = state;

  const updateConfig = (key, value) => {
    const updates = { [key]: value };
    if (actions?.updateAIConfig) {
      actions.updateAIConfig(updates);
    } else {
      dispatch({ type: 'UPDATE_AI_CONFIG', updates });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Confidence Sliders */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">🎛️ AI Confidence Thresholds</div>
              <div className="card-subtitle">Drag to adjust minimum confidence for automated actions</div>
            </div>
          </div>
          <div className="card-body">
            {SLIDERS.map(slider => (
              <div key={slider.key} className="slider-container">
                <div className="slider-label">
                  <div>
                    <div className="slider-name">{slider.icon} {slider.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>{slider.desc}</div>
                  </div>
                  <div className="slider-val">{Math.round(aiConfig[slider.key] * 100)}%</div>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="0.99"
                  step="0.01"
                  value={aiConfig[slider.key]}
                  onChange={e => updateConfig(slider.key, parseFloat(e.target.value))}
                  style={{ background: `linear-gradient(to right, var(--red-primary) 0%, var(--red-primary) ${(aiConfig[slider.key] - 0.5) / 0.49 * 100}%, var(--gray-200) ${(aiConfig[slider.key] - 0.5) / 0.49 * 100}%, var(--gray-200) 100%)` }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--gray-400)', marginTop: 2 }}>
                  <span>50% (Permissive)</span>
                  <span>99% (Strict)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Toggles */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div>
                <div className="card-title">🔧 Automation Rules</div>
                <div className="card-subtitle">Enable or disable automated system actions</div>
              </div>
            </div>
            <div className="card-body">
              {TOGGLES.map(toggle => (
                <div key={toggle.key} className="toggle-wrapper">
                  <div>
                    <div className="toggle-label">{toggle.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>{toggle.desc}</div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={aiConfig[toggle.key]}
                      onChange={e => updateConfig(toggle.key, e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Current Config Summary */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">📊 Active Configuration</div>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Auto-Refund', value: aiConfig.enableAutoRefund ? '✅ On' : '❌ Off', active: aiConfig.enableAutoRefund },
                  { label: 'Broadcast', value: aiConfig.enableOutageBroadcast ? '✅ On' : '❌ Off', active: aiConfig.enableOutageBroadcast },
                  { label: 'APN Reset', value: aiConfig.enableApnReset ? '✅ On' : '❌ Off', active: aiConfig.enableApnReset },
                  { label: 'Predictive', value: aiConfig.enablePredictiveAlerts ? '✅ On' : '❌ Off', active: aiConfig.enablePredictiveAlerts },
                ].map(item => (
                  <div key={item.label} style={{ background: item.active ? 'var(--green-light)' : 'var(--gray-100)', borderRadius: 10, padding: 12, border: `1px solid ${item.active ? '#bbf7d0' : 'var(--gray-200)'}` }}>
                    <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{item.label}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: item.active ? 'var(--green)' : 'var(--gray-400)' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: 12, background: '#fff5f5', borderRadius: 10, border: '1px solid #fca5a5' }}>
                <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>
                  <strong style={{ color: '#dc2626' }}>⚠️ Warning:</strong> Lowering thresholds increases automated actions. Monitor audit logs after changes to ensure accuracy.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
