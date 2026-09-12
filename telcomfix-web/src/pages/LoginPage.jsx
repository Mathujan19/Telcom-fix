import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ROLES = [
  {
    id: 'noc',
    icon: '🗺️',
    name: 'NOC Engineer',
    desc: 'Live network map, alarm correlation, field dispatch',
    email: 'noc@telcomfix.lk',
  },
  {
    id: 'admin',
    icon: '⚙️',
    name: 'System Admin',
    desc: 'AI controls, credit policy, audit logs, user management',
    email: 'admin@telcomfix.lk',
  },
];

export default function LoginPage() {
  const { actions, state } = useApp();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('demo'); // 'demo' | 'email'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleDemoLogin = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      await actions.demoLogin(selected);
    } catch (err) {
      // Check if it's a Firebase setup issue
      if (err.message?.includes('Firebase Console') || err.message?.includes('configuration-not-found')) {
        setError('⚙️ Firebase setup needed: Enable Email/Password Auth in your Firebase Console. App is running in local mode.');
      } else {
        setError(err.message);
      }
      console.warn('Firebase login failed, using local mode:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">📡</div>
          <h1 className="login-title">TelcomFix</h1>
          <p className="login-subtitle">Detecting & Fixing Mobile Service Problems at Scale</p>

          {/* Firebase connected indicator */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.15)', borderRadius: 20,
            padding: '4px 12px', marginTop: 10, fontSize: 11, fontWeight: 600,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse-green 2s infinite' }} />
            Firebase Connected · Project: telcom-fix-a79d8
          </div>
        </div>

        <div className="login-body">
          {/* Mode Toggle */}
          <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 12, padding: 3, marginBottom: 20 }}>
            {[{ id: 'demo', label: '⚡ Quick Demo Login' }, { id: 'email', label: '📧 Email Login' }].map(m => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setError(null); }}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                  background: mode === m.id ? 'white' : 'transparent',
                  color: mode === m.id ? 'var(--gray-900)' : 'var(--gray-500)',
                  boxShadow: mode === m.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Demo Login */}
          {mode === 'demo' && (
            <>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
                Select Your Role
              </p>
              {ROLES.map(role => (
                <div
                  key={role.id}
                  className={`role-card ${selected === role.id ? 'selected' : ''}`}
                  onClick={() => setSelected(role.id)}
                >
                  <div className="role-icon-box">{role.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div className="role-info-name">{role.name}</div>
                    <div className="role-info-desc">{role.desc}</div>
                    <div style={{ fontSize: 10, color: 'var(--gray-400)', marginTop: 3 }}>🔑 {role.email}</div>
                  </div>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: `2px solid ${selected === role.id ? 'var(--red-primary)' : 'var(--gray-300)'}`,
                    background: selected === role.id ? 'var(--red-primary)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {selected === role.id && <span style={{ color: 'white', fontSize: 11 }}>✓</span>}
                  </div>
                </div>
              ))}

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: 10, marginTop: 8, fontSize: 12, color: '#dc2626' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: 12, justifyContent: 'center', opacity: !selected || loading ? 0.7 : 1 }}
                onClick={handleDemoLogin}
                disabled={!selected || loading}
              >
                {loading
                  ? '🔄 Authenticating via Firebase...'
                  : `Login as ${selected ? ROLES.find(r => r.id === selected)?.name : '...'} →`
                }
              </button>
            </>
          )}

          {/* Email Login */}
          {mode === 'email' && (
            <>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="user@telcomfix.lk"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 12, color: '#dc2626' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                disabled={loading || !email || !password}
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  try {
                    const { signIn } = await import('../firebase/auth');
                    await signIn(email, password);
                  } catch (err) {
                    setError(err.message);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? '🔄 Signing in...' : 'Sign In →'}
              </button>

              <div style={{ marginTop: 16, padding: 12, background: 'var(--gray-50)', borderRadius: 10, border: '1px solid var(--gray-200)', fontSize: 12, color: 'var(--gray-500)' }}>
                <strong>Demo credentials:</strong><br />
                NOC: noc@telcomfix.lk / telcom2026<br />
                Admin: admin@telcomfix.lk / telcom2026
              </div>
            </>
          )}

          {/* Mobile App Info */}
          <div style={{ marginTop: 16, padding: 12, background: 'var(--gray-50)', borderRadius: 10, border: '1px solid var(--gray-200)' }}>
            <p style={{ fontSize: 12, color: 'var(--gray-500)', textAlign: 'center', lineHeight: 1.6 }}>
              📱 <strong>Mobile Apps</strong> (Customer & Field Engineer)<br />
              Run: <code style={{ background: '#e5e7eb', padding: '1px 5px', borderRadius: 4 }}>npx expo start --web</code> in <code>telcomfix-mobile/</code>
            </p>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--gray-400)', marginTop: 14 }}>
            CodeArena'26 · TelcomFix · Powered by Firebase 🔥
          </p>
        </div>
      </div>
    </div>
  );
}
