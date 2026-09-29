import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { submissionsAPI } from '../services/api';
import MathRenderer from '../components/MathRenderer';

export default function ResultAnalysis({ submissionId, onNavigateHome, onOpenLeaderboard }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'CORRECT' | 'INCORRECT' | 'UNATTEMPTED'

  useEffect(() => {
    async function loadResult() {
      setLoading(true);
      try {
        const res = await submissionsAPI.getResultById(submissionId);
        if (res.success) {
          setData(res);
          // Trigger victory confetti if score > 0
          if ((res.submission?.totalScore || 0) > 0) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        } else {
          setError('Could not load submission report.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load report.');
      } finally {
        setLoading(false);
      }
    }
    loadResult();
  }, [submissionId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#94a3b8' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <h2>Generating Comprehensive Scorecard & Diagnostics...</h2>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Result Not Found</h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>{error}</p>
        <button onClick={onNavigateHome} className="btn btn-primary">Return to Home</button>
      </div>
    );
  }

  const { submission, detailedReview } = data;

  // Filter questions for review
  const filteredQuestions = (detailedReview || []).filter(q => {
    if (filterType === 'CORRECT') return q.isCorrect;
    if (filterType === 'INCORRECT') return !q.isCorrect && q.selectedOption !== null;
    if (filterType === 'UNATTEMPTED') return q.selectedOption === null || q.selectedOption === undefined;
    return true;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Top Banner Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <button onClick={onNavigateHome} className="btn btn-sm btn-secondary" style={{ marginBottom: '8px' }}>
            ← Back to Tests
          </button>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc' }}>
            Exam Performance Diagnostics
          </h1>
          <p style={{ color: '#94a3b8' }}>
            {submission.testTitle} • Completed on {new Date(submission.submittedAt).toLocaleDateString()}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onOpenLeaderboard(submission.testId, submission.testTitle)}
            className="btn btn-secondary"
          >
            🏆 Test Leaderboard
          </button>
          <button onClick={onNavigateHome} className="btn btn-primary">
            Explore More Tests
          </button>
        </div>
      </div>

      {/* Main Score & Metric Highlights Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        {/* Total Score */}
        <div className="glass-panel" style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(17, 24, 39, 0.8) 100%)',
          borderColor: 'rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ fontSize: '0.82rem', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Marks</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', margin: '8px 0 4px' }}>
            {submission.totalScore}
            <span style={{ fontSize: '1.1rem', color: '#94a3b8', fontWeight: 500 }}> / {submission.maxMarks}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#60a5fa' }}>
            {Math.round(((submission.totalScore || 0) / (submission.maxMarks || 300)) * 100)}% overall score
          </div>
        </div>

        {/* Rank & Percentile */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.82rem', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Percentile & Rank</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#c084fc', margin: '8px 0 4px' }}>
            {submission.percentile}%tile
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Rank: <strong style={{ color: '#ffffff' }}>#{submission.rank}</strong> out of {submission.totalCandidates} candidates
          </div>
        </div>

        {/* Accuracy */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.82rem', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Accuracy Rate</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#34d399', margin: '8px 0 4px' }}>
            {submission.accuracy}%
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Correct / Attempted ratio
          </div>
        </div>

        {/* Marking Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.82rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Marking Impact</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '12px 0 8px' }}>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e' }}>+{submission.positiveMarks}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Positive Gained</div>
            </div>
            <div style={{ height: '30px', width: '1px', background: 'var(--border-color)' }} />
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>-{submission.negativeMarks}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Negative Lost</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Diagnostics */}
      <section style={{ marginBottom: '44px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '18px', color: '#f8fafc' }}>
          Subject-Wise Performance Breakdown
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {submission.sectionScores && Object.entries(submission.sectionScores).map(([secName, sec]) => {
            const secAccuracy = sec.attempted > 0 ? Math.round((sec.correct / sec.attempted) * 100) : 0;
            return (
              <div key={secName} className="glass-panel" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#38bdf8' }}>{secName}</h3>
                  <span className="badge badge-blue">Score: {sec.score} M</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', marginBottom: '14px' }}>
                  <div>
                    <div style={{ color: '#22c55e', fontWeight: 700, fontSize: '1.1rem' }}>{sec.correct}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Correct</div>
                  </div>
                  <div>
                    <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '1.1rem' }}>{sec.incorrect}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Incorrect</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: '1.1rem' }}>{sec.unattempted}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Skipped</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#cbd5e1' }}>
                  <span>Subject Accuracy:</span>
                  <strong style={{ color: secAccuracy >= 75 ? '#22c55e' : '#fbbf24' }}>{secAccuracy}%</strong>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step-by-Step Question Review & Detailed Solutions */}
      <section>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc' }}>
              Question-by-Question Solution Review
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              Study detailed explanations, verify concepts, and learn from mistakes
            </p>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(17, 24, 39, 0.8)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {[
              { id: 'ALL', label: 'All Questions' },
              { id: 'CORRECT', label: 'Correct' },
              { id: 'INCORRECT', label: 'Incorrect' },
              { id: 'UNATTEMPTED', label: 'Skipped' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: filterType === f.id ? '#2563eb' : 'transparent',
                  color: filterType === f.id ? '#ffffff' : '#94a3b8'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Review Cards */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {filteredQuestions.map((q, idx) => {
            const isAttempted = q.selectedOption !== null && q.selectedOption !== undefined;
            const statusColor = q.isCorrect ? '#22c55e' : isAttempted ? '#ef4444' : '#64748b';

            return (
              <div
                key={q.questionId || idx}
                className="glass-panel"
                style={{
                  padding: '24px',
                  borderLeft: `4px solid ${statusColor}`
                }}
              >
                {/* Question Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
                      Question #{q.questionNumber} ({q.sectionName})
                    </span>
                    <span className="badge badge-blue">{q.type.toUpperCase()}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Topic: {q.topic}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {q.isCorrect ? (
                      <span className="badge badge-green">✓ Correct (+{q.marksAwarded} M)</span>
                    ) : isAttempted ? (
                      <span className="badge badge-red">✗ Incorrect ({q.marksAwarded} M)</span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8' }}>
                        Not Attempted (0 M)
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <div style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: '18px', lineHeight: 1.6 }}>
                  <MathRenderer text={q.questionText} />
                </div>

                {/* Options / Answer Review Box */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '18px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Your Selected Response:</div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: q.isCorrect ? '#22c55e' : isAttempted ? '#ef4444' : '#94a3b8',
                        marginTop: '4px'
                      }}>
                        {isAttempted ? q.selectedOption : 'None (Skipped)'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Correct Answer:</div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#22c55e',
                        marginTop: '4px'
                      }}>
                        {q.correctAnswer}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Explanation */}
                {q.explanation && (
                  <div style={{
                    background: 'rgba(59, 130, 246, 0.05)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    padding: '16px',
                    borderRadius: '10px'
                  }}>
                    <div style={{ fontSize: '0.82rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      💡 Complete Step-by-Step Solution:
                    </div>
                    <div style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                      <MathRenderer text={q.explanation} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
