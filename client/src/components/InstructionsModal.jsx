import React from 'react';

export default function InstructionsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '750px', width: '95%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.2rem', color: '#f8fafc' }}>ℹ️ Official NTA CBT Exam Instructions</h2>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Read all rules and evaluation criteria carefully</div>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-sm btn-secondary"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#cbd5e1' }}>
          <h4 style={{ color: '#60a5fa', marginBottom: '8px' }}>1. General Guidelines</h4>
          <p style={{ marginBottom: '12px' }}>
            The total duration of the examination is <strong>180 minutes</strong> (3 hours). 
            The clock will be set at the server. The countdown timer at the top-right indicates the remaining time. 
            When the timer reaches zero, the examination will end automatically and submit your responses.
          </p>

          <h4 style={{ color: '#60a5fa', marginBottom: '8px' }}>2. Question Palette Symbols</h4>
          <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: '14px', display: 'grid', gap: '8px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '22px', height: '22px', background: 'var(--cbt-not-visited)', borderRadius: '4px', display: 'inline-block' }}></span>
              <span><strong>Not Visited:</strong> You have not visited the question yet.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '22px', height: '22px', background: 'var(--cbt-not-answered)', borderRadius: '4px', display: 'inline-block' }}></span>
              <span><strong>Not Answered:</strong> You have visited the question but have not answered it.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '22px', height: '22px', background: 'var(--cbt-answered)', borderRadius: '4px', display: 'inline-block' }}></span>
              <span><strong>Answered:</strong> You have answered the question.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '22px', height: '22px', background: 'var(--cbt-review)', borderRadius: '50%', display: 'inline-block' }}></span>
              <span><strong>Marked for Review:</strong> You have NOT answered the question, but marked it for review.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '22px', height: '22px', background: 'var(--cbt-review-ans)', borderRadius: '50%', display: 'inline-block', position: 'relative' }}>
                <span style={{ position: 'absolute', bottom: 0, right: 0, width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' }} />
              </span>
              <span><strong>Answered & Marked for Review:</strong> You answered the question and marked for review. <em>This will be evaluated!</em></span>
            </li>
          </ul>

          <h4 style={{ color: '#60a5fa', marginBottom: '8px' }}>3. Marking Scheme</h4>
          <div style={{ background: '#1e293b', padding: '12px 16px', borderRadius: '8px', marginBottom: '14px' }}>
            <p><strong>• Multiple Choice Questions (MCQs):</strong> +4 for correct response, -1 for incorrect response, 0 if unattempted.</p>
            <p style={{ marginTop: '6px' }}><strong>• Numerical Value Questions:</strong> +4 for correct numerical answer, 0 for incorrect answer (No negative marking in Numerical section).</p>
          </div>

          <h4 style={{ color: '#60a5fa', marginBottom: '8px' }}>4. Navigation & Submissions</h4>
          <p>
            Click <strong>Save & Next</strong> to save your answer and move to the next question.
            Click <strong>Mark for Review & Next</strong> if you wish to recheck your answer later.
            To change your response, click <strong>Clear Response</strong>.
          </p>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            I Understand the Instructions
          </button>
        </div>
      </div>
    </div>
  );
}
