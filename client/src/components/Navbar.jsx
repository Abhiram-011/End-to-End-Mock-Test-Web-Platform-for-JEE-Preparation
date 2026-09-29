import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAuth, onNavigate, currentPage }) {
  const { user, isAuthenticated, isTeacher, logout, quickDemoLogin } = useAuth();

  return (
    <header style={{
      background: 'rgba(11, 15, 25, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 24px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Logo */}
        <div 
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(59, 130, 246, 0.4)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              <polyline points="10 8 13 11 17 6"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#ffffff' }}>JEE</span>
              <span style={{ color: '#3b82f6' }}>PREP</span>
              <span style={{ 
                background: '#1e293b', 
                color: '#38bdf8', 
                fontSize: '0.65rem', 
                padding: '2px 6px', 
                borderRadius: '4px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                letterSpacing: '0.5px'
              }}>CBT NTA</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Mock-Test & Analytics Engine</div>
          </div>
        </div>

        {/* Navigation links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onNavigate('home')}
            className="btn btn-sm"
            style={{
              background: currentPage === 'home' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: currentPage === 'home' ? '#60a5fa' : 'var(--text-secondary)',
              border: currentPage === 'home' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent'
            }}
          >
            Mock Tests
          </button>

          {isAuthenticated && (
            <button
              onClick={() => onNavigate('student-dashboard')}
              className="btn btn-sm"
              style={{
                background: currentPage === 'student-dashboard' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: currentPage === 'student-dashboard' ? '#60a5fa' : 'var(--text-secondary)',
                border: currentPage === 'student-dashboard' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent'
              }}
            >
              My Performance
            </button>
          )}

          {isAuthenticated && isTeacher && (
            <button
              onClick={() => onNavigate('teacher-dashboard')}
              className="btn btn-sm"
              style={{
                background: currentPage === 'teacher-dashboard' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                color: currentPage === 'teacher-dashboard' ? '#c084fc' : 'var(--accent-purple)',
                border: currentPage === 'teacher-dashboard' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent'
              }}
            >
              ⚡ Teacher Portal
            </button>
          )}
        </nav>

        {/* User / Auth actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => quickDemoLogin('student')}
                className="btn btn-sm btn-secondary"
                title="1-Click Login as Sample Student"
              >
                🎓 Student Demo
              </button>
              <button 
                onClick={() => quickDemoLogin('teacher')}
                className="btn btn-sm btn-secondary"
                title="1-Click Login as Faculty / Admin"
              >
                👨‍🏫 Teacher Demo
              </button>
              <button 
                onClick={() => onOpenAuth('login')}
                className="btn btn-sm btn-primary"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Profile Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '4px 12px 4px 6px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isTeacher ? '#7c3aed' : '#2563eb',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user.name.split(' ')[0]}
                  </div>
                  <span className={`badge ${isTeacher ? 'badge-purple' : 'badge-blue'}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Demo Switcher Quick button */}
              <button
                onClick={() => quickDemoLogin(isTeacher ? 'student' : 'teacher')}
                className="btn btn-sm btn-secondary"
                title="Switch demo role instantly"
                style={{ fontSize: '0.78rem', padding: '5px 10px' }}
              >
                Switch to {isTeacher ? 'Student' : 'Teacher'}
              </button>

              {/* Logout */}
              <button
                onClick={logout}
                className="btn btn-sm"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}
                title="Log Out"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
