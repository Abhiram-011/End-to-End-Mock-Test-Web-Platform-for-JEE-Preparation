import React, { useState, useEffect } from 'react';
import { testsAPI, analyticsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TeacherDashboard({ onStartExam, onSelectSubmission }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Test Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('JEE Main');
  const [durationMinutes, setDurationMinutes] = useState(180);
  const [totalMarks, setTotalMarks] = useState(300);

  // Sections builder
  const [sections, setSections] = useState([
    {
      name: 'Physics',
      instructions: '+4 for correct, -1 for incorrect',
      questions: [
        {
          id: 'q1',
          type: 'mcq',
          questionText: 'A particle executes simple harmonic motion with amplitude A. At what displacement from the mean position is its kinetic energy equal to its potential energy?',
          options: ['A) A / √2', 'B) A / 2', 'C) A / 4', 'D) A / (2√2)'],
          correctAnswer: 'A',
          positiveMarks: 4,
          negativeMarks: 1,
          topic: 'Simple Harmonic Motion',
          difficulty: 'Easy',
          explanation: 'KE = 1/2 m ω² (A² - x²) and PE = 1/2 m ω² x². Setting KE = PE gives A² - x² = x² => 2x² = A² => x = A / √2.'
        }
      ]
    }
  ]);

  const [activeSecIdx, setActiveSecIdx] = useState(0);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadTeacherData();
  }, []);

  async function loadTeacherData() {
    setLoading(true);
    try {
      const [statsRes, testsRes] = await Promise.all([
        analyticsAPI.getTeacherDashboard(),
        testsAPI.getAll()
      ]);
      if (statsRes.success) setStats(statsRes.stats);
      if (testsRes.success) setTests(testsRes.tests || []);
    } catch (err) {
      console.error('Failed to load teacher portal data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Question Changes
  const handleAddQuestion = (secIdx) => {
    const newQ = {
      id: `q-${Date.now()}`,
      type: 'mcq',
      questionText: 'Enter question text here...',
      options: ['A) Option 1', 'B) Option 2', 'C) Option 3', 'D) Option 4'],
      correctAnswer: 'A',
      positiveMarks: 4,
      negativeMarks: 1,
      topic: 'Mechanics',
      difficulty: 'Medium',
      explanation: 'Detailed solution goes here...'
    };
    const updated = [...sections];
    updated[secIdx].questions.push(newQ);
    setSections(updated);
  };

  const handleAddSection = () => {
    const secNames = ['Chemistry', 'Mathematics', 'General'];
    const nextName = secNames[sections.length - 1] || `Section ${sections.length + 1}`;
    setSections([...sections, {
      name: nextName,
      instructions: '+4 for correct, -1 for incorrect',
      questions: []
    }]);
    setActiveSecIdx(sections.length);
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;
    try {
      await testsAPI.deleteTest(testId);
      loadTeacherData();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert('Test title is required');

    setCreating(true);
    try {
      const res = await testsAPI.createTest({
        title,
        description,
        category,
        durationMinutes: Number(durationMinutes),
        totalMarks: Number(totalMarks),
        sections
      });

      if (res.success) {
        setIsCreateModalOpen(false);
        setTitle('');
        setDescription('');
        loadTeacherData();
      }
    } catch (err) {
      alert('Failed to create test: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span className="badge badge-purple">⚡ Faculty Portal</span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Test Authoring & Cohort Analytics</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f8fafc' }}>
            {user?.name || 'Faculty / Admin'} Dashboard
          </h1>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary btn-lg"
          style={{ padding: '12px 24px' }}
        >
          ➕ Author New Mock Test
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '44px'
      }}>
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Active Tests</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
            {stats?.totalTests ?? tests.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Published on platform</div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Student Submissions</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#34d399', marginTop: '6px' }}>
            {stats?.totalSubmissions ?? 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Total evaluated papers</div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Cohort Avg Score</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fbbf24', marginTop: '6px' }}>
            {stats?.overallAvgScore ?? 0} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 300</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Overall candidate average</div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Batch Accuracy</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#c084fc', marginTop: '6px' }}>
            {stats?.overallAvgAccuracy ?? 0}%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Correct response ratio</div>
        </div>
      </div>

      {/* Tests Management Table */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px', color: '#f8fafc' }}>
          Managed Mock Test Catalog
        </h2>

        <div className="glass-panel" style={{ overflowX: 'auto', padding: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#94a3b8' }}>
                <th style={{ padding: '14px 18px' }}>Test Title</th>
                <th style={{ padding: '14px 18px' }}>Category</th>
                <th style={{ padding: '14px 18px' }}>Duration</th>
                <th style={{ padding: '14px 18px' }}>Questions</th>
                <th style={{ padding: '14px 18px' }}>Max Marks</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(test => {
                const tId = test.id || test._id;
                return (
                  <tr key={tId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 600, color: '#f8fafc' }}>
                      {test.title}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className="badge badge-blue">{test.category}</span>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>{test.durationMinutes} mins</td>
                    <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>{test.totalQuestions || 'Multi'} Qs</td>
                    <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>{test.totalMarks} M</td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => onStartExam(tId)}
                          className="btn btn-sm btn-secondary"
                        >
                          Preview CBT
                        </button>
                        <button
                          onClick={() => handleDeleteTest(tId)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Submissions Feed */}
      {stats?.recentSubmissions && stats.recentSubmissions.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px', color: '#f8fafc' }}>
            Recent Student Submissions Feed
          </h2>

          <div style={{ display: 'grid', gap: '10px' }}>
            {stats.recentSubmissions.map((sub, idx) => (
              <div
                key={sub.id || idx}
                className="glass-panel"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#f8fafc' }}>{sub.studentName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {sub.testTitle} • {new Date(sub.submittedAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#38bdf8' }}>{sub.totalScore} / {sub.maxMarks}</div>
                    <div style={{ fontSize: '0.75rem', color: '#34d399' }}>{sub.accuracy}% accuracy</div>
                  </div>
                  <button
                    onClick={() => onSelectSubmission(sub.id)}
                    className="btn btn-sm btn-secondary"
                  >
                    View Diagnostic ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Author New Test Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '850px', width: '95%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>➕ Author New JEE Mock Examination</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="btn btn-sm btn-secondary"
                style={{ borderRadius: '50%', width: '30px', height: '30px', padding: 0 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {/* Meta details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>
                      Examination Title *
                    </label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. JEE Main 2026 - Sprint Mock Test 03"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>
                      Category
                    </label>
                    <select
                      className="form-control"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="JEE Main">JEE Main</option>
                      <option value="JEE Advanced">JEE Advanced</option>
                      <option value="Subject Test">Subject Test</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                    />
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>
                    Description & Syllabus Coverage
                  </label>
                  <textarea
                    rows={2}
                    className="form-control"
                    placeholder="Brief description of the test syllabus..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Section & Question Builder */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.05rem', color: '#38bdf8' }}>Exam Sections & Questions</h3>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="btn btn-sm btn-secondary"
                    >
                      + Add Subject Section
                    </button>
                  </div>

                  {/* Section Tabs */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', overflowX: 'auto' }}>
                    {sections.map((sec, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSecIdx(idx)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: activeSecIdx === idx ? '1px solid #3b82f6' : '1px solid var(--border-color)',
                          background: activeSecIdx === idx ? '#1e3a8a' : '#131b2e',
                          color: activeSecIdx === idx ? '#ffffff' : '#94a3b8',
                          cursor: 'pointer'
                        }}
                      >
                        {sec.name} ({sec.questions.length})
                      </button>
                    ))}
                  </div>

                  {/* Active Section Questions */}
                  {sections[activeSecIdx] && (
                    <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ fontWeight: 700, color: '#f8fafc' }}>
                          Editing Section: {sections[activeSecIdx].name}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddQuestion(activeSecIdx)}
                          className="btn btn-sm btn-primary"
                        >
                          + Add Question
                        </button>
                      </div>

                      {sections[activeSecIdx].questions.map((q, qIdx) => (
                        <div key={q.id || qIdx} style={{ background: '#111827', padding: '14px', borderRadius: '8px', marginBottom: '12px', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 700, color: '#60a5fa' }}>Q{qIdx + 1}</span>
                            <select
                              className="form-control"
                              style={{ width: '160px', padding: '4px 8px', fontSize: '0.8rem' }}
                              value={q.type}
                              onChange={(e) => {
                                const updated = [...sections];
                                updated[activeSecIdx].questions[qIdx].type = e.target.value;
                                setSections(updated);
                              }}
                            >
                              <option value="mcq">Single Choice (MCQ)</option>
                              <option value="numerical">Numerical Value</option>
                            </select>

                            <input
                              type="text"
                              placeholder="Topic (e.g. Thermodynamics)"
                              className="form-control"
                              style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                              value={q.topic}
                              onChange={(e) => {
                                const updated = [...sections];
                                updated[activeSecIdx].questions[qIdx].topic = e.target.value;
                                setSections(updated);
                              }}
                            />
                          </div>

                          <textarea
                            rows={2}
                            className="form-control"
                            placeholder="Question statement..."
                            value={q.questionText}
                            onChange={(e) => {
                              const updated = [...sections];
                              updated[activeSecIdx].questions[qIdx].questionText = e.target.value;
                              setSections(updated);
                            }}
                            style={{ marginBottom: '8px' }}
                          />

                          {q.type === 'mcq' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                              {(q.options || []).map((opt, oIdx) => (
                                <input
                                  key={oIdx}
                                  type="text"
                                  className="form-control"
                                  placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                  value={opt}
                                  onChange={(e) => {
                                    const updated = [...sections];
                                    updated[activeSecIdx].questions[qIdx].options[oIdx] = e.target.value;
                                    setSections(updated);
                                  }}
                                  style={{ fontSize: '0.85rem' }}
                                />
                              ))}
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Correct Answer:</span>
                              <input
                                type="text"
                                className="form-control"
                                style={{ width: '80px', padding: '4px 8px', textAlign: 'center', fontWeight: 700 }}
                                value={q.correctAnswer}
                                onChange={(e) => {
                                  const updated = [...sections];
                                  updated[activeSecIdx].questions[qIdx].correctAnswer = e.target.value;
                                  setSections(updated);
                                }}
                              />
                            </div>

                            <input
                              type="text"
                              placeholder="Explanation / Solution details..."
                              className="form-control"
                              style={{ flex: 1, padding: '4px 8px', fontSize: '0.8rem' }}
                              value={q.explanation}
                              onChange={(e) => {
                                const updated = [...sections];
                                updated[activeSecIdx].questions[qIdx].explanation = e.target.value;
                                setSections(updated);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating}
                >
                  {creating ? 'Saving Exam...' : 'Publish Mock Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
