import React, { useState } from 'react';
import { RadioTower, Settings, AlertCircle, Loader2, KeyRound, UserPlus, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('admin');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const auth = await import('../firebase/auth');
      let result;
      if (mode === 'login') {
        result = await auth.signIn(email, password);
      } else {
        result = await auth.signUp(email, password, name, role);
      }
      dispatch({ type: 'SET_AUTH', user: result.user, profile: result.profile });
    } catch (err) {
      if (err.message?.includes('Firebase Console') || err.message?.includes('configuration-not-found')) {
        setError(<> <Settings size={16} style={{display: 'inline', verticalAlign: 'middle', marginRight: 4}} /> Firebase setup needed: Enable Email/Password Auth in your Firebase Console.</>);
      } else {
        setError(err.message);
      }
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
          <div className="slide-in-right" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--red-primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 30px rgba(244,63,94,0.4)' }}>
              <RadioTower size={28} />
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>TelcomFix</h1>
          </div>
          
          <h2 className="slide-in-right" style={{ fontSize: '48px', fontWeight: '800', lineHeight: 1.1, marginBottom: '24px', fontFamily: 'Outfit', animationDelay: '0.1s', animationFillMode: 'both' }}>
            Next-Generation<br/>Network Intelligence
          </h2>
          <p className="slide-in-right" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', maxWidth: '400px', lineHeight: 1.5, animationDelay: '0.2s', animationFillMode: 'both' }}>
            Automate issue detection, empower field engineers, and restore mobile services faster than ever before.
          </p>
        </div>

        <div style={{ zIndex: 10 }}>
          <div className="slide-in-right" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', animationDelay: '0.3s', animationFillMode: 'both' }}>
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
        <div style={{ width: '100%', maxWidth: '440px' }} className="slide-in">
          
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--gray-900)', fontFamily: 'Outfit', marginBottom: '8px' }}>
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '15px' }}>
              {mode === 'login' ? 'Sign in to access the TelcomFix portal' : 'Join TelcomFix to manage network operations'}
            </p>
          </div>

          {/* Mode Tabs */}
          <div style={{ display: 'flex', background: 'var(--gray-200)', borderRadius: '16px', padding: '4px', marginBottom: '32px' }}>
            {[
              { id: 'login', label: <><KeyRound size={16} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: 6}} /> Sign In</> }, 
              { id: 'signup', label: <><UserPlus size={16} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: 6}} /> Create Account</> }
            ].map(m => (
              <button
                key={m.id}
                type="button"
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

          <form onSubmit={handleAuth} key={mode} className="slide-in">
            {mode === 'signup' && (
              <>
                <div className="form-group slide-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    style={{ padding: '14px 16px', fontSize: '15px' }}
                    placeholder="John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="form-group slide-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                  <label className="form-label">Role</label>
                  <select 
                    className="form-select" 
                    value={role} 
                    onChange={e => setRole(e.target.value)}
                    style={{ padding: '14px 16px', fontSize: '15px', width: '100%' }}
                  >
                    <option value="admin">System Administrator</option>
                    <option value="noc">NOC Engineer</option>
                  </select>
                </div>
              </>
            )}
            
            <div className="form-group slide-in" style={{ animationDelay: mode === 'signup' ? '0.2s' : '0.1s', animationFillMode: 'both' }}>
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
            
            <div className="form-group slide-in" style={{ marginBottom: '24px', animationDelay: mode === 'signup' ? '0.3s' : '0.2s', animationFillMode: 'both' }}>
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
              <div className="slide-in" style={{ background: 'var(--red-light)', border: '1px solid var(--red-border)', borderRadius: '12px', padding: '16px', marginBottom: '24px', fontSize: '13px', color: 'var(--red-dark)', fontWeight: '500' }}>
                <AlertCircle size={16} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: 6}} /> {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-animated slide-in"
              style={{ width: '100%', padding: '16px', fontSize: '16px', opacity: loading ? 0.7 : 1, background: 'var(--blue)', animationDelay: mode === 'signup' ? '0.4s' : '0.3s', animationFillMode: 'both' }}
              disabled={loading || !email || !password || (mode === 'signup' && !name)}
            >
              {loading 
                ? <><Loader2 size={18} className="animate-spin" style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: 8}} /> Processing...</>
                : (mode === 'login' 
                  ? <><KeyRound size={18} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: 8}} /> Sign In</> 
                  : <><UserPlus size={18} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: 8}} /> Create Account</>)
              }
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--gray-400)', marginTop: '40px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <ShieldCheck size={14} /> Secured by TelcomFix Platform
          </p>
        </div>
      </div>
    </div>
  );
}
