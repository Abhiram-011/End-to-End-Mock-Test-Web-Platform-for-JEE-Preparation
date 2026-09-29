import React from 'react';

export default function QuestionPalette({
  sectionName = 'Physics',
  questions = [],
  responses = {},
  currentQuestionIndex = 0,
  onSelectQuestion
}) {
  // Compute counts for the legend
  let countAnswered = 0;
  let countNotAnswered = 0;
  let countNotVisited = 0;
  let countReview = 0;
  let countAnsReview = 0;

  questions.forEach(q => {
    const qId = q.id || q._id;
    const resp = responses[qId];
    const status = resp?.status || 'not_visited';

    if (status === 'answered') countAnswered++;
    else if (status === 'not_answered') countNotAnswered++;
    else if (status === 'marked_for_review') countReview++;
    else if (status === 'answered_marked') countAnsReview++;
    else countNotVisited++;
  });

  return (
    <div style={{
      background: '#111827',
      borderLeft: '1px solid var(--border-color)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      width: '320px',
      flexShrink: 0
    }}>
      {/* Palette Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border-color)',
        background: '#0e1626'
      }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
          Question Palette
        </h3>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
          Section: <span style={{ color: '#38bdf8', fontWeight: 600 }}>{sectionName}</span>
        </div>
      </div>

      {/* Official NTA 5-State Legend */}
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(15, 23, 42, 0.4)',
        fontSize: '0.76rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px 12px'
      }}>
        {/* Answered */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            background: 'var(--cbt-answered)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.7rem'
          }}>
            {countAnswered}
          </div>
          <span style={{ color: '#cbd5e1' }}>Answered</span>
        </div>

        {/* Not Answered */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            background: 'var(--cbt-not-answered)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.7rem'
          }}>
            {countNotAnswered}
          </div>
          <span style={{ color: '#cbd5e1' }}>Not Answered</span>
        </div>

        {/* Not Visited */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            background: 'var(--cbt-not-visited)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.7rem'
          }}>
            {countNotVisited}
          </div>
          <span style={{ color: '#cbd5e1' }}>Not Visited</span>
        </div>

        {/* Marked for Review */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'var(--cbt-review)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.7rem'
          }}>
            {countReview}
          </div>
          <span style={{ color: '#cbd5e1' }}>Marked Review</span>
        </div>

        {/* Answered & Marked for Review */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: 'span 2' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'var(--cbt-review-ans)',
            color: '#fff',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.7rem'
          }}>
            {countAnsReview}
            <span style={{
              position: 'absolute',
              bottom: '1px',
              right: '1px',
              width: '7px',
              height: '7px',
              background: '#22c55e',
              borderRadius: '50%',
              border: '1px solid #111827'
            }} />
          </div>
          <span style={{ color: '#cbd5e1' }}>Ans & Marked for Review (Evaluated)</span>
        </div>
      </div>

      {/* Question Number Buttons Grid */}
      <div style={{
        padding: '16px',
        overflowY: 'auto',
        flex: 1
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px'
        }}>
          {questions.map((q, idx) => {
            const qId = q.id || q._id;
            const resp = responses[qId];
            const status = resp?.status || 'not_visited';
            const isCurrent = idx === currentQuestionIndex;

            let bgColor = 'var(--cbt-not-visited)';
            let isCircle = false;
            let showGreenDot = false;

            if (status === 'answered') {
              bgColor = 'var(--cbt-answered)';
            } else if (status === 'not_answered') {
              bgColor = 'var(--cbt-not-answered)';
            } else if (status === 'marked_for_review') {
              bgColor = 'var(--cbt-review)';
              isCircle = true;
            } else if (status === 'answered_marked') {
              bgColor = 'var(--cbt-review-ans)';
              isCircle = true;
              showGreenDot = true;
            }

            return (
              <button
                key={qId}
                onClick={() => onSelectQuestion(idx)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: isCircle ? '50%' : '6px',
                  background: bgColor,
                  color: '#ffffff',
                  border: isCurrent ? '2px solid #ffffff' : '1px solid rgba(0,0,0,0.2)',
                  boxShadow: isCurrent ? '0 0 10px rgba(255,255,255,0.7)' : 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.1s ease',
                  transform: isCurrent ? 'scale(1.08)' : 'scale(1)'
                }}
                title={`Question ${idx + 1} (${status})`}
              >
                {idx + 1}
                {showGreenDot && (
                  <span style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '8px',
                    height: '8px',
                    background: '#22c55e',
                    borderRadius: '50%',
                    border: '1.5px solid #ffffff'
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
