import React from 'react';

export default function CBTHeader({
  testTitle,
  candidateName = 'Aarav Sharma',
  sections = [],
  activeSectionIndex = 0,
  onSelectSection,
  timeLeftSeconds = 0,
  onOpenQuestionPaper,
  onOpenInstructions
}) {
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isLowTime = timeLeftSeconds <= 300 && timeLeftSeconds > 0;

  return (
    <div style={{
      background: '#0d1527',
      borderBottom: '2px solid #1e293b',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Top Meta Bar */}
      <div style={{
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Test Name & NTA Simulation Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.8rem',
            padding: '4px 10px',
            borderRadius: '4px',
            letterSpacing: '0.5px'
          }}>
            NTA CBT 2026
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
              {testTitle}
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Standard Marking: <span style={{ color: '#22c55e', fontWeight: 600 }}>+4 Correct</span> | <span style={{ color: '#ef4444', fontWeight: 600 }}>-1 Incorrect (MCQ)</span>
            </div>
          </div>
        </div>

        {/* Candidate Info + Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Candidate Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(30, 41, 59, 0.6)',
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#3b82f6',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}>
              {candidateName[0] || 'S'}
            </div>
            <div style={{ fontSize: '0.8rem', textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ color: '#f8fafc', fontWeight: 600 }}>{candidateName}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Roll: JEE26-884192</div>
            </div>
          </div>

          {/* Real-time Countdown Timer */}
          <div style={{
            background: isLowTime ? 'rgba(239, 68, 68, 0.2)' : 'rgba(15, 23, 42, 0.9)',
            border: isLowTime ? '2px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.4)',
            padding: '6px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: isLowTime ? 'pulseGlow 1s infinite alternate' : 'none'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isLowTime ? '#ef4444' : '#38bdf8'} strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time Left</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: isLowTime ? '#ef4444' : '#38bdf8',
                letterSpacing: '1px'
              }}>
                {formatTime(timeLeftSeconds)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Tabs and Utility Buttons */}
      <div style={{
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: '#090e1a'
      }}>
        {/* Sections / Subjects */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginRight: '4px' }}>SECTIONS:</span>
          {sections.map((sec, idx) => {
            const isActive = idx === activeSectionIndex;
            return (
              <button
                key={sec.name || idx}
                onClick={() => onSelectSection(idx)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isActive ? '#1e3a8a' : '#131b2e',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{sec.name}</span>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: isActive ? '#2563eb' : '#1e293b',
                  color: '#ffffff'
                }}>
                  {(sec.questions || []).length} Qs
                </span>
              </button>
            );
          })}
        </div>

        {/* View Question Paper & View Instructions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onOpenQuestionPaper}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            📋 Question Paper
          </button>
          <button
            onClick={onOpenInstructions}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            ℹ️ Instructions
          </button>
        </div>
      </div>
    </div>
  );
}
