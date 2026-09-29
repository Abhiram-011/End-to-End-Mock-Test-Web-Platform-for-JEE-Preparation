import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const { login, register, quickDemoLogin } = useAuth();
  const [tab, setTab] = useState(initialTab); // 'login' | 'register'
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [targetExam, setTargetExam] = useState('JEE Main 2026');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, role, targetExam });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (demoRole) => {
    setError('');
    setLoading(true);
    try {
      await quickDemoLogin(demoRole);
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          background: '#0e1626'
        }}>
          <button
            onClick={() => { setTab('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '16px',
              background: tab === 'login' ? 'transparent' : 'rgba(0,0,0,0.2)',
              color: tab === 'login' ? '#60a5fa' : '#94a3b8',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              borderBottom: tab === 'login' ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '16px',
              background: tab === 'register' ? 'transparent' : 'rgba(0,0,0,0.2)',
              color: tab === 'register' ? '#60a5fa' : '#94a3b8',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              borderBottom: tab === 'register' ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '16px'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Quick Demo Login Helpers */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px dashed rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '0.78rem', color: '#93c5fd', fontWeight: 600, marginBottom: '8px' }}>
              ⚡ 1-CLICK INSTANT DEMO ACCESS:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleDemo('student')}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.8rem' }}
                disabled={loading}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => handleDemo('teacher')}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.8rem' }}
                disabled={loading}
              >
                👨‍🏫 Teacher
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
            {tab === 'register' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>
                    I am registering as:
                  </label>
                  <select
                    className="form-control"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="student">Student (Taking Mock Tests)</option>
                    <option value="teacher">Teacher (Creating & Managing Tests)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', marginTop: '6px' }}
            >
              {loading ? 'Please wait...' : tab === 'login' ? 'Sign In to Portal' : 'Create My Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
