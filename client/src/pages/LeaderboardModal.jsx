import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';

export default function LeaderboardModal({ isOpen, onClose, testId, testTitle }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && testId) {
      async function loadLeaderboard() {
        setLoading(true);
        try {
          const res = await analyticsAPI.getLeaderboard(testId);
          if (res.success) {
            setLeaderboard(res.leaderboard || []);
            setTotalAttempts(res.totalAttempts || 0);
          }
        } catch (err) {
          console.error('Failed to load leaderboard:', err);
        } finally {
          setLoading(false);
        }
      }
      loadLeaderboard();
    }
  }, [isOpen, testId]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '650px', width: '95%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>🏆 Official Test Leaderboard</h2>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {testTitle} • {totalAttempts} Total Aspirants Ranked
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-secondary"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto', padding: '16px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading rankings...</div>
          ) : leaderboard.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              No submissions recorded yet for this examination. Be the first ranker!
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '8px' }}>
              {leaderboard.map((item) => {
                const isTop3 = item.rank <= 3;
                const medal = item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`;

                return (
                  <div
                    key={item.rank}
                    style={{
                      background: isTop3 ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: isTop3 ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--border-color)',
                      padding: '12px 18px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: isTop3 ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : '#1e293b',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: isTop3 ? '1.1rem' : '0.85rem'
                      }}>
                        {medal}
                      </div>

                      <div>
                        <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                          {item.studentName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Accuracy: <span style={{ color: '#34d399' }}>{item.accuracy}%</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#38bdf8' }}>
                        {item.totalScore} <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>/ {item.maxMarks}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {new Date(item.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            Close Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
