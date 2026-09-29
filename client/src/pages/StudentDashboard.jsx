import React, { useState, useEffect } from 'react';
import { submissionsAPI, testsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StudentDashboard({ onSelectSubmission, onStartExam }) {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [availableTests, setAvailableTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [subRes, testRes] = await Promise.all([
          submissionsAPI.getMyHistory(),
          testsAPI.getAll()
        ]);
        if (subRes.success) setSubmissions(subRes.submissions || []);
        if (testRes.success) setAvailableTests(testRes.tests || []);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  // Compute aggregated stats
  const totalAttempted = submissions.length;
  let avgAccuracy = 0;
  let avgScore = 0;
  let highestScore = 0;

  if (totalAttempted > 0) {
    const sumAccuracy = submissions.reduce((acc, s) => acc + (s.accuracy || 0), 0);
    const sumScore = submissions.reduce((acc, s) => acc + (s.totalScore || 0), 0);
    avgAccuracy = Math.round(sumAccuracy / totalAttempted);
    avgScore = Math.round(sumScore / totalAttempted);
    highestScore = Math.max(...submissions.map(s => s.totalScore || 0));
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Student Welcome Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
          Welcome back, {user?.name || 'Aarav'}! 👋
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
          Targeting: <strong style={{ color: '#38bdf8' }}>{user?.targetExam || 'JEE Main 2026'}</strong> • Track your test trends and exam readiness
        </p>
      </div>

      {/* Aggregate Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '44px'
      }}>
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Tests Taken</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>{totalAttempted}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Full mock sessions completed</div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Average Accuracy</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#34d399', marginTop: '6px' }}>{avgAccuracy}%</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Precision across all attempts</div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Average Score</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fbbf24', marginTop: '6px' }}>{avgScore} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 300</span></div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Mean across all tests</div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Personal Best</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#c084fc', marginTop: '6px' }}>{highestScore} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 300</span></div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Highest single test score</div>
        </div>
      </div>

      {/* Test History Section */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px', color: '#f8fafc' }}>
          Recent Mock Exam Submissions
        </h2>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading test records...</div>
        ) : submissions.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📝</div>
            <h3 style={{ marginBottom: '8px' }}>No tests attempted yet</h3>
            <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Take your first JEE full mock exam to generate your detailed diagnostic report.</p>
            {availableTests.length > 0 && (
              <button onClick={() => onStartExam(availableTests[0].id || availableTests[0]._id)} className="btn btn-primary">
                Take Mock Test Now ➔
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '14px' }}>
            {submissions.map((sub) => {
              const subId = sub._id || sub.id;
              return (
                <div
                  key={subId}
                  className="glass-panel"
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                      {sub.testTitle}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                      Attempted on {new Date(sub.submittedAt).toLocaleDateString()} at {new Date(sub.submittedAt).toLocaleTimeString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                        {sub.totalScore} <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>/ {sub.maxMarks}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#34d399' }}>
                        {sub.accuracy}% Accuracy
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectSubmission(subId)}
                      className="btn btn-primary btn-sm"
                    >
                      View Report & Solutions ➔
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Available Tests Catalog Quick Links */}
      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px', color: '#f8fafc' }}>
          Explore More Tests
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {availableTests.slice(0, 3).map((test) => {
            const tId = test.id || test._id;
            return (
              <div key={tId} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-blue" style={{ marginBottom: '10px' }}>{test.category}</span>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{test.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '16px' }}>{test.description}</p>
                </div>
                <button onClick={() => onStartExam(tId)} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  Start Test ➔
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
