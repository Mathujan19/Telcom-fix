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
  const { actions } = useApp();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('demo'); // 'demo' | 'email' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleDemoLogin = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      await actions.demoLogin(selected);
    } catch (err) {
      if (err.message?.includes('Firebase Console') || err.message?.includes('configuration-not-found')) {
        setError('⚙️ Firebase setup needed: Enable Email/Password Auth in your Firebase Console.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
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
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'var(--white)' }}>
      {/* Left Pane - Branding & Visuals */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px',
        color: 'white',
        overflow: 'hidden'
      }}>
        {/* Abstract Background Shapes */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'rgba(244, 63, 94, 0.15)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '50%', filter: 'blur(100px)' }} />

        <div style={{ zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--red-primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 0 30px rgba(244,63,94,0.4)' }}>
              📡
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>TelcomFix</h1>
          </div>
          
          <h2 style={{ fontSize: '48px', fontWeight: '800', lineHeight: 1.1, marginBottom: '24px', fontFamily: 'Outfit' }}>
            Next-Generation<br/>Network Intelligence
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', maxWidth: '400px', lineHeight: 1.5 }}>
            Automate issue detection, empower field engineers, and restore mobile services faster than ever before.
          </p>
        </div>

        <div style={{ zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 10px #10b981' }} />
            Systems Operational
          </div>
        </div>
      </div>

      {/* Right Pane - Auth Form */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px',
        background: 'var(--gray-50)'
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--gray-900)', fontFamily: 'Outfit', marginBottom: '8px' }}>
              Welcome back
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '15px' }}>
              Sign in to access the TelcomFix portal
            </p>
          </div>

          {/* Mode Tabs */}
          <div style={{ display: 'flex', background: 'var(--gray-200)', borderRadius: '16px', padding: '4px', marginBottom: '32px' }}>
            {[{ id: 'demo', label: '⚡ Demo Access' }, { id: 'email', label: '📧 Staff Login' }].map(m => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setError(null); }}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', fontFamily: 'Inter',
                  background: mode === m.id ? 'var(--white)' : 'transparent',
                  color: mode === m.id ? 'var(--gray-900)' : 'var(--gray-500)',
                  boxShadow: mode === m.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Demo Login */}
          {mode === 'demo' && (
            <div className="slide-in">
              <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Select Environment Role
              </p>
              {ROLES.map(role => (
                <div
                  key={role.id}
                  onClick={() => setSelected(role.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '20px',
                    background: 'var(--white)',
                    border: `2px solid ${selected === role.id ? 'var(--blue)' : 'var(--gray-200)'}`,
                    borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
                    marginBottom: '16px',
                    boxShadow: selected === role.id ? '0 8px 24px rgba(59,130,246,0.15)' : 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ fontSize: '32px', background: 'var(--gray-50)', padding: '12px', borderRadius: '12px' }}>
                    {role.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--gray-900)' }}>{role.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginTop: '4px', lineHeight: 1.4 }}>{role.desc}</div>
                  </div>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    border: `2px solid ${selected === role.id ? 'var(--blue)' : 'var(--gray-300)'}`,
                    background: selected === role.id ? 'var(--blue)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {selected === role.id && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
                  </div>
                </div>
              ))}

              {error && (
                <div style={{ background: 'var(--red-light)', border: '1px solid var(--red-border)', borderRadius: '12px', padding: '16px', marginTop: '16px', fontSize: '13px', color: 'var(--red-dark)', fontWeight: '500' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '24px', padding: '16px', fontSize: '16px', opacity: !selected || loading ? 0.7 : 1, background: 'var(--blue)' }}
                onClick={handleDemoLogin}
                disabled={!selected || loading}
              >
                {loading
                  ? '🔄 Authenticating...'
                  : `Continue as ${selected ? ROLES.find(r => r.id === selected)?.name : '...'} →`
                }
              </button>
            </div>
          )}

          {/* Email Login/Signup */}
          {mode === 'email' && (
            <form onSubmit={handleEmailAuth} className="slide-in">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  style={{ padding: '14px 16px', fontSize: '15px' }}
                  placeholder="name@telcomfix.lk"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  style={{ padding: '14px 16px', fontSize: '15px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div style={{ background: 'var(--red-light)', border: '1px solid var(--red-border)', borderRadius: '12px', padding: '16px', marginBottom: '24px', fontSize: '13px', color: 'var(--red-dark)', fontWeight: '500' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', padding: '16px', fontSize: '16px', opacity: loading ? 0.7 : 1, background: 'var(--blue)' }}
                disabled={loading || !email || !password}
              >
                {loading ? '🔄 Signing in...' : 'Sign In →'}
              </button>

              <div style={{ marginTop: '32px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '8px' }}>
                  Don't have an account? It will be created automatically.
                </p>
                <div style={{ padding: '16px', background: 'var(--gray-100)', borderRadius: '12px', border: '1px dashed var(--gray-300)', fontSize: '13px', color: 'var(--gray-600)' }}>
                  <strong>Demo Credentials:</strong><br />
                  admin@telcomfix.lk / telcom2026<br />
                  noc@telcomfix.lk / telcom2026
                </div>
              </div>
            </form>
          )}

          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--gray-400)', marginTop: '40px', fontWeight: '500' }}>
            CodeArena'26 · TelcomFix
          </p>
        </div>
      </div>
    </div>
  );
}
