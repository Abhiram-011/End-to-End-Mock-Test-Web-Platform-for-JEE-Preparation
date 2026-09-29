const express = require('express');
const router = express.Router();
const { TestDB, SubmissionDB } = require('../storage/db');
const { authenticate } = require('../middleware/auth');

// Helper to compare numerical answers within small tolerance
function isNumericalMatch(userVal, correctVal) {
  if (userVal === null || userVal === undefined || userVal === '') return false;
  const u = parseFloat(String(userVal).trim());
  const c = parseFloat(String(correctVal).trim());
  if (isNaN(u) || isNaN(c)) {
    return String(userVal).trim().toLowerCase() === String(correctVal).trim().toLowerCase();
  }
  return Math.abs(u - c) < 0.01;
}

// Helper to compare MCQ answers
function isOptionMatch(userVal, correctVal) {
  if (!userVal || !correctVal) return false;
  const u = String(userVal).trim().toUpperCase();
  const c = String(correctVal).trim().toUpperCase();
  if (u === c) return true;
  // If user selected option text like "A) ..." and correct is "A"
  if (u.startsWith(c) || c.startsWith(u)) return true;
  return false;
}

// POST /api/submissions/:testId - Submit exam responses & auto-evaluate
router.post('/:testId', authenticate, async (req, res) => {
  try {
    const { testId } = req.params;
    const { responses = {}, timeTakenSeconds = 0 } = req.body;
    const userId = req.user._id || req.user.id;
    const studentName = req.user.name;

    const test = await TestDB.findById(testId);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    let totalScore = 0;
    let positiveMarks = 0;
    let negativeMarks = 0;
    let totalAttempted = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;

    const sectionScores = {};
    const evaluatedAnswers = [];

    // Initialize section aggregates
    (test.sections || []).forEach(sec => {
      sectionScores[sec.name] = {
        name: sec.name,
        score: 0,
        totalQuestions: (sec.questions || []).length,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        timeSpentSeconds: 0
      };

      (sec.questions || []).forEach(q => {
        const qId = q.id || q._id;
        const studentResp = responses[qId] || {};
        const selected = studentResp.selectedOption;
        const status = studentResp.status || 'not_visited';
        const timeSpent = studentResp.timeSpentSeconds || 0;

        sectionScores[sec.name].timeSpentSeconds += timeSpent;

        // Is it attempted? Only if selectedOption has a value AND status is 'answered' or 'answered_marked'
        const isAttempted = (selected !== null && selected !== undefined && String(selected).trim() !== '') && 
                            (status === 'answered' || status === 'answered_marked');

        let isCorrect = false;
        let marks = 0;

        if (isAttempted) {
          totalAttempted++;
          sectionScores[sec.name].attempted++;

          if (q.type === 'numerical') {
            isCorrect = isNumericalMatch(selected, q.correctAnswer);
          } else {
            isCorrect = isOptionMatch(selected, q.correctAnswer);
          }

          if (isCorrect) {
            marks = q.positiveMarks || 4;
            positiveMarks += marks;
            totalCorrect++;
            sectionScores[sec.name].correct++;
          } else {
            marks = -(q.negativeMarks !== undefined ? q.negativeMarks : 1);
            negativeMarks += Math.abs(marks);
            totalIncorrect++;
            sectionScores[sec.name].incorrect++;
          }
        } else {
          sectionScores[sec.name].unattempted++;
        }

        totalScore += marks;
        sectionScores[sec.name].score += marks;

        evaluatedAnswers.push({
          questionId: qId,
          sectionName: sec.name,
          selectedOption: selected ?? null,
          status,
          timeSpentSeconds: timeSpent,
          isCorrect,
          marksAwarded: marks
        });
      });
    });

    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

    const submissionData = {
      testId,
      testTitle: test.title,
      userId,
      studentName,
      studentEmail: req.user.email,
      answers: evaluatedAnswers,
      totalScore,
      maxMarks: test.totalMarks || 300,
      positiveMarks,
      negativeMarks,
      accuracy,
      sectionScores,
      timeTakenSeconds,
      submittedAt: new Date().toISOString()
    };

    const savedSubmission = await SubmissionDB.create(submissionData);

    return res.status(201).json({
      success: true,
      message: 'Exam submitted successfully',
      submissionId: savedSubmission._id || savedSubmission.id,
      summary: {
        totalScore,
        maxMarks: test.totalMarks || 300,
        positiveMarks,
        negativeMarks,
        accuracy,
        totalAttempted,
        totalCorrect,
        totalIncorrect,
        sectionScores,
        timeTakenSeconds
      }
    });
  } catch (err) {
    console.error('Submission evaluation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process submission', error: err.message });
  }
});

// GET /api/submissions/my - Get user's test history
router.get('/my', authenticate, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const submissions = await SubmissionDB.find({ userId });
    return res.json({ success: true, submissions });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not fetch history', error: err.message });
  }
});

// GET /api/submissions/:id - Get complete test report and solutions review
router.get('/:id', authenticate, async (req, res) => {
  try {
    const submission = await SubmissionDB.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    const test = await TestDB.findById(submission.testId);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Associated test not found' });
    }

    // Map answers with complete questions, solutions, and explanations
    const detailedReview = [];
    const answerMap = {};
    (submission.answers || []).forEach(a => {
      answerMap[a.questionId] = a;
    });

    (test.sections || []).forEach(sec => {
      (sec.questions || []).forEach((q, idx) => {
        const qId = q.id || q._id;
        const userAns = answerMap[qId] || {};

        detailedReview.push({
          questionNumber: idx + 1,
          questionId: qId,
          sectionName: sec.name,
          type: q.type,
          questionText: q.questionText,
          options: q.options || [],
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          topic: q.topic,
          difficulty: q.difficulty,
          selectedOption: userAns.selectedOption ?? null,
          status: userAns.status || 'not_visited',
          isCorrect: userAns.isCorrect || false,
          marksAwarded: userAns.marksAwarded || 0,
          timeSpentSeconds: userAns.timeSpentSeconds || 0
        });
      });
    });

    // Calculate rank and percentile among all submissions for this test
    const allSubs = await SubmissionDB.find({ testId: submission.testId });
    const sorted = [...allSubs].sort((a, b) => b.totalScore - a.totalScore);
    const myRank = sorted.findIndex(s => (s._id || s.id) === (submission._id || submission.id)) + 1;
    const totalCandidates = sorted.length;
    const percentile = totalCandidates > 1
      ? Math.max(0, Math.min(100, Math.round(((totalCandidates - myRank) / totalCandidates) * 1000) / 10))
      : 99.9;

    return res.json({
      success: true,
      submission: {
        ...submission,
        rank: myRank || 1,
        totalCandidates: totalCandidates || 1,
        percentile: percentile
      },
      detailedReview
    });
  } catch (err) {
    console.error('Error fetching result analysis:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve analysis', error: err.message });
  }
});

module.exports = router;
