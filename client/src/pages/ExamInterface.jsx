import React, { useState, useEffect, useRef } from 'react';
import { testsAPI, submissionsAPI } from '../services/api';
import CBTHeader from '../components/CBTHeader';
import QuestionPalette from '../components/QuestionPalette';
import QuestionPaperModal from '../components/QuestionPaperModal';
import InstructionsModal from '../components/InstructionsModal';
import MathRenderer from '../components/MathRenderer';

export default function ExamInterface({ testId, candidateName = 'Aarav Sharma', onFinishExam }) {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Exam navigation
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  // Responses state: { [qId]: { selectedOption, status, timeSpentSeconds } }
  const [responses, setResponses] = useState({});
  const [currentSelectedOption, setCurrentSelectedOption] = useState(null);

  // Time tracking
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(180 * 60);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  // Modals
  const [isQuestionPaperOpen, setIsQuestionPaperOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer Ref
  const timerRef = useRef(null);

  // Load test data
  useEffect(() => {
    async function loadExam() {
      setLoading(true);
      try {
        const res = await testsAPI.getExamSession(testId);
        if (res.success && res.test) {
          setTest(res.test);
          setTimeLeftSeconds((res.test.durationMinutes || 180) * 60);
          
          // Initialize responses map
          const initResp = {};
          (res.test.sections || []).forEach(sec => {
            (sec.questions || []).forEach(q => {
              const qId = q.id || q._id;
              initResp[qId] = {
                selectedOption: null,
                status: 'not_visited',
                timeSpentSeconds: 0
              };
            });
          });

          // Mark first question as not_answered (visited)
          const firstSection = res.test.sections[0];
          if (firstSection && firstSection.questions[0]) {
            const firstQId = firstSection.questions[0].id || firstSection.questions[0]._id;
            initResp[firstQId].status = 'not_answered';
          }

          setResponses(initResp);
        } else {
          setError('Failed to load exam details.');
        }
      } catch (err) {
        setError(err.message || 'Error initializing exam session.');
      } finally {
        setLoading(false);
      }
    }
    loadExam();
  }, [testId]);

  // Main countdown timer
  useEffect(() => {
    if (!loading && test && timeLeftSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });

        setTotalTimeSpent((prev) => prev + 1);

        // Track time spent on active question
        if (test && test.sections[activeSectionIdx]) {
          const curQ = test.sections[activeSectionIdx].questions[activeQuestionIdx];
          if (curQ) {
            const qId = curQ.id || curQ._id;
            setResponses((prev) => ({
              ...prev,
              [qId]: {
                ...(prev[qId] || {}),
                timeSpentSeconds: ((prev[qId]?.timeSpentSeconds) || 0) + 1
              }
            }));
          }
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [loading, test, activeSectionIdx, activeQuestionIdx]);

  // Sync selected option when switching questions
  useEffect(() => {
    if (test && test.sections[activeSectionIdx]) {
      const curQ = test.sections[activeSectionIdx].questions[activeQuestionIdx];
      if (curQ) {
        const qId = curQ.id || curQ._id;
        const saved = responses[qId];
        setCurrentSelectedOption(saved?.selectedOption ?? null);

        // Mark as visited (not_answered if still not_visited)
        if (saved && saved.status === 'not_visited') {
          setResponses(prev => ({
            ...prev,
            [qId]: {
              ...prev[qId],
              status: 'not_answered'
            }
          }));
        }
      }
    }
  }, [activeSectionIdx, activeQuestionIdx, test]);

  // Get current active question & section
  const currentSection = test?.sections?.[activeSectionIdx];
  const currentQuestions = currentSection?.questions || [];
  const currentQuestion = currentQuestions[activeQuestionIdx];
  const currentQId = currentQuestion ? (currentQuestion.id || currentQuestion._id) : null;

  // Actions
  const handleSaveAndNext = () => {
    if (!currentQId) return;

    const hasSelection = currentSelectedOption !== null && currentSelectedOption !== undefined && String(currentSelectedOption).trim() !== '';
    const newStatus = hasSelection ? 'answered' : 'not_answered';

    setResponses(prev => ({
      ...prev,
      [currentQId]: {
        ...(prev[currentQId] || {}),
        selectedOption: currentSelectedOption,
        status: newStatus
      }
    }));

    goToNextQuestion();
  };

  const handleMarkForReviewAndNext = () => {
    if (!currentQId) return;

    const hasSelection = currentSelectedOption !== null && currentSelectedOption !== undefined && String(currentSelectedOption).trim() !== '';
    const newStatus = hasSelection ? 'answered_marked' : 'marked_for_review';

    setResponses(prev => ({
      ...prev,
      [currentQId]: {
        ...(prev[currentQId] || {}),
        selectedOption: currentSelectedOption,
        status: newStatus
      }
    }));

    goToNextQuestion();
  };

  const handleClearResponse = () => {
    if (!currentQId) return;
    setCurrentSelectedOption(null);
    setResponses(prev => ({
      ...prev,
      [currentQId]: {
        ...(prev[currentQId] || {}),
        selectedOption: null,
        status: 'not_answered'
      }
    }));
  };

  const goToNextQuestion = () => {
    if (activeQuestionIdx < currentQuestions.length - 1) {
      setActiveQuestionIdx(prev => prev + 1);
    } else if (activeSectionIdx < (test.sections.length - 1)) {
      // Move to next section
      setActiveSectionIdx(prev => prev + 1);
      setActiveQuestionIdx(0);
    }
  };

  const handleAutoSubmit = () => {
    alert('⏱️ Time has expired! Your exam will now be automatically evaluated and submitted.');
    finalizeSubmission();
  };

  const finalizeSubmission = async () => {
    setIsSubmitting(true);
    try {
      const res = await submissionsAPI.submitExam(testId, {
        responses,
        timeTakenSeconds: totalTimeSpent
      });
      if (res.success && res.submissionId) {
        onFinishExam(res.submissionId);
      } else {
        alert('Could not submit exam. Please try again.');
      }
    } catch (err) {
      alert('Error during submission: ' + err.message);
    } finally {
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
    }
  };

  // Compute status summary for submit modal
  const getExamSummary = () => {
    let answered = 0;
    let notAnswered = 0;
    let review = 0;
    let reviewAns = 0;
    let notVisited = 0;

    Object.values(responses).forEach(r => {
      if (r.status === 'answered') answered++;
      else if (r.status === 'not_answered') notAnswered++;
      else if (r.status === 'marked_for_review') review++;
      else if (r.status === 'answered_marked') reviewAns++;
      else notVisited++;
    });

    return { answered, notAnswered, review, reviewAns, notVisited, total: Object.keys(responses).length };
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ color: '#94a3b8' }}>Loading secure examination portal...</div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Failed to Load Exam</h2>
        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">Try Again</button>
      </div>
    );
  }

  const examSummary = getExamSummary();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#0b0f19' }}>
      {/* NTA Top Banner */}
      <CBTHeader
        testTitle={test.title}
        candidateName={candidateName}
        sections={test.sections}
        activeSectionIndex={activeSectionIdx}
        onSelectSection={(idx) => {
          setActiveSectionIdx(idx);
          setActiveQuestionIdx(0);
        }}
        timeLeftSeconds={timeLeftSeconds}
        onOpenQuestionPaper={() => setIsQuestionPaperOpen(true)}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
      />

      {/* Main Examination Center Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left / Center Question Pane */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#0d1322' }}>
          {/* Question Metadata Bar */}
          <div style={{
            padding: '12px 24px',
            background: '#131b2e',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.9rem',
                padding: '4px 12px',
                borderRadius: '6px'
              }}>
                Question No. {activeQuestionIdx + 1}
              </span>
              <span className="badge badge-blue">
                {currentQuestion?.type === 'numerical' ? 'NUMERICAL VALUE' : 'SINGLE CHOICE (MCQ)'}
              </span>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Topic: <strong style={{ color: '#e2e8f0' }}>{currentQuestion?.topic || 'General'}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem' }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>+{currentQuestion?.positiveMarks || 4} Marks</span>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>-{currentQuestion?.negativeMarks !== undefined ? currentQuestion.negativeMarks : 1} Negative</span>
            </div>
          </div>

          {/* Question Body */}
          <div style={{ padding: '24px 30px', flex: 1, overflowY: 'auto' }}>
            <div style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '24px', lineHeight: 1.7 }}>
              <MathRenderer text={currentQuestion?.questionText} />
            </div>

            {/* MCQ Options */}
            {currentQuestion?.type === 'mcq' && (
              <div style={{ display: 'grid', gap: '14px', maxWidth: '850px' }}>
                {(currentQuestion.options || []).map((opt, oIdx) => {
                  const letter = String.fromCharCode(65 + oIdx); // 'A', 'B', 'C', 'D'
                  const isSelected = currentSelectedOption === letter || currentSelectedOption === opt;

                  return (
                    <div
                      key={oIdx}
                      onClick={() => setCurrentSelectedOption(letter)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: '10px',
                        background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: isSelected ? '6px solid #3b82f6' : '2px solid #64748b',
                        background: isSelected ? '#ffffff' : 'transparent',
                        flexShrink: 0
                      }} />
                      <div style={{ fontSize: '0.98rem', color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                        <MathRenderer text={opt} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Numerical Value Input + Keypad */}
            {currentQuestion?.type === 'numerical' && (
              <div style={{ maxWidth: '420px', marginTop: '16px', background: 'rgba(15, 23, 42, 0.8)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
                  Enter Numerical Value (Decimal / Integer):
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.25rem',
                    textAlign: 'center',
                    letterSpacing: '2px',
                    fontWeight: 700,
                    marginBottom: '16px'
                  }}
                  placeholder="0.00"
                  value={currentSelectedOption ?? ''}
                  onChange={(e) => setCurrentSelectedOption(e.target.value)}
                />

                {/* Virtual Numeric Keypad */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px'
                }}>
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '-'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        const cur = String(currentSelectedOption || '');
                        setCurrentSelectedOption(cur + val);
                      }}
                      className="btn btn-secondary"
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', padding: '10px' }}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = String(currentSelectedOption || '');
                      setCurrentSelectedOption(cur.slice(0, -1));
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.85rem' }}
                  >
                    ⌫ Backspace
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSelectedOption('')}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.85rem' }}
                  >
                    Clear Input
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div style={{
            padding: '14px 24px',
            background: '#0d1527',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            {/* Left Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={handleSaveAndNext}
                className="btn btn-success"
                style={{ padding: '10px 22px' }}
              >
                Save & Next ➔
              </button>

              <button
                onClick={handleMarkForReviewAndNext}
                className="btn btn-purple"
                style={{ padding: '10px 20px' }}
              >
                Mark for Review & Next
              </button>

              <button
                onClick={handleClearResponse}
                className="btn btn-secondary"
                style={{ padding: '10px 18px' }}
              >
                Clear Response
              </button>
            </div>

            {/* Right Action: Final Submit */}
            <div>
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="btn btn-danger"
                style={{ padding: '10px 24px', fontWeight: 700 }}
              >
                Submit Exam 🏁
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Question Palette */}
        <QuestionPalette
          sectionName={currentSection?.name || 'Physics'}
          questions={currentQuestions}
          responses={responses}
          currentQuestionIndex={activeQuestionIdx}
          onSelectQuestion={(idx) => setActiveQuestionIdx(idx)}
        />
      </div>

      {/* Question Paper Preview Modal */}
      <QuestionPaperModal
        isOpen={isQuestionPaperOpen}
        onClose={() => setIsQuestionPaperOpen(false)}
        sections={test.sections}
      />

      {/* Exam Instructions Modal */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />

      {/* Submit Confirmation Dialog */}
      {isSubmitModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSubmitModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '560px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>⚠️ Final Exam Submission</h2>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="btn btn-sm btn-secondary"
                style={{ borderRadius: '50%', width: '30px', height: '30px', padding: 0 }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>
                Please review your question attempt summary before submitting:
              </p>

              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '8px',
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '20px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--cbt-answered)' }} />
                  <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Answered:</span>
                  <strong style={{ color: '#ffffff' }}>{examSummary.answered}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--cbt-not-answered)' }} />
                  <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Not Answered:</span>
                  <strong style={{ color: '#ffffff' }}>{examSummary.notAnswered}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--cbt-review)' }} />
                  <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Marked Review:</span>
                  <strong style={{ color: '#ffffff' }}>{examSummary.review}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--cbt-review-ans)' }} />
                  <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Ans & Review:</span>
                  <strong style={{ color: '#ffffff' }}>{examSummary.reviewAns}</strong>
                </div>
              </div>

              <p style={{ color: '#f87171', fontSize: '0.85rem' }}>
                Note: Once submitted, you cannot change your answers. Detailed scorecard and step-by-step solutions will be generated instantly.
              </p>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Resume Test
              </button>
              <button
                onClick={finalizeSubmission}
                className="btn btn-danger"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Evaluating Responses...' : 'Yes, Submit Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
