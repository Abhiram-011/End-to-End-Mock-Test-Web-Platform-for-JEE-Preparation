import React from 'react';
import MathRenderer from './MathRenderer';

export default function QuestionPaperModal({ isOpen, onClose, sections = [] }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '850px', width: '95%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.2rem', color: '#f8fafc' }}>📋 Full Question Paper Summary</h2>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Preview all questions across subjects</div>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-sm btn-secondary"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {sections.map((sec, secIdx) => (
            <div key={sec.name || secIdx} style={{ marginBottom: '28px' }}>
              <div style={{
                background: '#1e293b',
                padding: '8px 16px',
                borderRadius: '6px',
                color: '#38bdf8',
                fontWeight: 700,
                fontSize: '0.95rem',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>Section: {sec.name}</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{(sec.questions || []).length} Questions</span>
              </div>

              {(sec.questions || []).map((q, qIdx) => (
                <div key={q.id || qIdx} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '14px 18px',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{
                      fontWeight: 800,
                      color: '#60a5fa',
                      background: 'rgba(59, 130, 246, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.82rem'
                    }}>
                      Q{qIdx + 1}
                    </span>
                    <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{q.type.toUpperCase()}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Topic: {q.topic}</span>
                  </div>

                  <MathRenderer text={q.questionText} />

                  {q.type === 'mcq' && q.options && q.options.length > 0 && (
                    <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} style={{
                          padding: '6px 12px',
                          background: 'rgba(15, 23, 42, 0.6)',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          color: '#cbd5e1'
                        }}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            Close Question Paper
          </button>
        </div>
      </div>
    </div>
  );
}
