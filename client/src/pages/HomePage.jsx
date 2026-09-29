import React, { useState, useEffect } from 'react';
import { testsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function HomePage({ onStartExam, onOpenLeaderboard, onOpenAuth }) {
  const { isAuthenticated, quickDemoLogin } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function loadTests() {
      setLoading(true);
      try {
        const res = await testsAPI.getAll(selectedCategory);
        if (res.success) {
          setTests(res.tests || []);
        }
      } catch (err) {
        console.error('Failed to load tests:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTests();
  }, [selectedCategory]);

  const handleTestClick = (testId) => {
    if (!isAuthenticated) {
      // Auto sign in as demo student or prompt auth
      onOpenAuth('login');
      return;
    }
    onStartExam(testId);
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Hero Banner */}
      <section style={{
        background: 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.18) 0%, rgba(11, 15, 25, 0) 70%)',
        textAlign: 'center',
        padding: '30px 20px 50px',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        marginBottom: '48px'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="badge badge-blue" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            ⚡ NTA Official 2026 Simulation
          </span>
          <span className="badge badge-green" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            Real Computer Based Test (CBT)
          </span>
        </div>

        <h1 style={{
          fontSize: '3.2rem',
          fontWeight: 800,
          letterSpacing: '-1.5px',
          lineHeight: 1.15,
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #ffffff 30%, #93c5fd 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Master the JEE with Authentic CBT Mock Tests
        </h1>

        <p style={{
          maxWidth: '750px',
          margin: '0 auto 32px',
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6
        }}>
          Simulate the exact NTA exam hall experience with live countdowns, official 5-color question palette, negative marking evaluation, and instant deep diagnostic analytics.
        </p>

        {/* Quick CTA row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {tests.length > 0 && (
            <button
              onClick={() => handleTestClick(tests[0].id || tests[0]._id)}
              className="btn btn-primary btn-lg"
              style={{ padding: '14px 32px', fontSize: '1.05rem' }}
            >
              🚀 Launch All India Mock Test 01
            </button>
          )}

          {!isAuthenticated && (
            <button
              onClick={() => quickDemoLogin('student')}
              className="btn btn-secondary btn-lg"
              style={{ padding: '14px 28px', fontSize: '1rem' }}
            >
              🎓 1-Click Student Login
            </button>
          )}
        </div>

        {/* Highlight Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '44px',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>300 Marks</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Official NTA Pattern & Sections</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4ade80' }}>+4 / -1 Marking</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Real Negative Marking Engine</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c084fc' }}>100% CBT Palette</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>5-State Color Coded Tracker</div>
          </div>
        </div>
      </section>

      {/* Tests Catalog Section */}
      <section>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc' }}>
              Available Mock Examinations
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Select an exam to begin full simulation mode with authentic timing
            </p>
          </div>

          {/* Filter Categories */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(17, 24, 39, 0.8)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            {['All', 'JEE Main', 'JEE Advanced', 'Subject Test'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: selectedCategory === cat ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'transparent',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tests Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Loading mock tests...
          </div>
        ) : tests.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📚</div>
            <h3 style={{ marginBottom: '8px' }}>No tests found in this category</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Check back later or choose another filter.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '24px'
          }}>
            {tests.map((test) => {
              const testId = test.id || test._id;
              return (
                <div
                  key={testId}
                  className="glass-panel"
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span className={`badge ${test.category === 'JEE Advanced' ? 'badge-purple' : test.category === 'Subject Test' ? 'badge-amber' : 'badge-blue'}`}>
                        {test.category}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span>{test.durationMinutes} mins</span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: '#f8fafc' }}>
                      {test.title}
                    </h3>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                      {test.description}
                    </p>

                    {/* Section Breakdown Pills */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap',
                      marginBottom: '20px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem'
                    }}>
                      <span style={{ color: '#94a3b8', fontWeight: 600 }}>Subjects:</span>
                      {test.sectionBreakdown && Object.entries(test.sectionBreakdown).map(([sec, count]) => (
                        <span key={sec} style={{ color: '#cbd5e1' }}>
                          <strong style={{ color: '#38bdf8' }}>{sec}</strong>: {count} Qs
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                    <button
                      onClick={() => handleTestClick(testId)}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                    >
                      Take Mock Exam ➔
                    </button>
                    <button
                      onClick={() => onOpenLeaderboard(testId, test.title)}
                      className="btn btn-secondary btn-sm"
                      title="View test ranking"
                    >
                      🏆 Rank
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ marginTop: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '10px' }}>Built Specifically for Serious JEE Aspirants</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Every element mirrors the genuine National Testing Agency (NTA) exam environment</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '14px' }}>🖥️</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>1-to-1 CBT Simulation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Familiarize yourself with the 5 question states (Visited, Answered, Marked for Review), subject tabs, and full question paper view before exam day.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '14px' }}>📊</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Granular Diagnostic Scorecard</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Receive instant accuracy %, negative mark penalties lost, subject-wise strengths, percentile rankings, and complete step-by-step solutions with concepts.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '14px' }}>👨‍🏫</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Teacher & Coaching Management</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Teachers can create customized mock tests, configure numerical and MCQ questions, review student attempts, and monitor overall batch performance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
