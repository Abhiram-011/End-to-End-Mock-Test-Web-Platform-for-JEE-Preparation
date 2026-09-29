const express = require('express');
const router = express.Router();
const { TestDB, SubmissionDB, UserDB } = require('../storage/db');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/analytics/dashboard - Teacher / Admin Analytics
router.get('/dashboard', authenticate, requireRole('teacher'), async (req, res) => {
  try {
    const tests = await TestDB.find({});
    const submissions = await SubmissionDB.find({});

    const totalTests = tests.length;
    const totalSubmissions = submissions.length;

    let totalScoreSum = 0;
    let totalAccuracySum = 0;

    const testAttemptCounts = {};
    tests.forEach(t => {
      testAttemptCounts[t._id || t.id] = {
        title: t.title,
        attempts: 0,
        avgScore: 0,
        highestScore: 0
      };
    });

    submissions.forEach(sub => {
      totalScoreSum += (sub.totalScore || 0);
      totalAccuracySum += (sub.accuracy || 0);

      const tStats = testAttemptCounts[sub.testId];
      if (tStats) {
        tStats.attempts += 1;
        tStats.highestScore = Math.max(tStats.highestScore, sub.totalScore);
      }
    });

    // Compute averages per test
    Object.keys(testAttemptCounts).forEach(id => {
      const tSubs = submissions.filter(s => s.testId === id);
      if (tSubs.length > 0) {
        const sum = tSubs.reduce((acc, s) => acc + (s.totalScore || 0), 0);
        testAttemptCounts[id].avgScore = Math.round(sum / tSubs.length);
      }
    });

    const overallAvgScore = totalSubmissions > 0 ? Math.round(totalScoreSum / totalSubmissions) : 0;
    const overallAvgAccuracy = totalSubmissions > 0 ? Math.round(totalAccuracySum / totalSubmissions) : 0;

    return res.json({
      success: true,
      stats: {
        totalTests,
        totalSubmissions,
        overallAvgScore,
        overallAvgAccuracy,
        testStats: Object.values(testAttemptCounts),
        recentSubmissions: submissions.slice(0, 10).map(s => ({
          id: s._id || s.id,
          studentName: s.studentName,
          testTitle: s.testTitle,
          totalScore: s.totalScore,
          maxMarks: s.maxMarks,
          accuracy: s.accuracy,
          submittedAt: s.submittedAt
        }))
      }
    });
  } catch (err) {
    console.error('Teacher analytics error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load teacher analytics', error: err.message });
  }
});

// GET /api/analytics/leaderboard/:testId - Test Leaderboard
router.get('/leaderboard/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await TestDB.findById(testId);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    const submissions = await SubmissionDB.find({ testId });
    // Sort descending by score, then ascending by time taken
    const sorted = [...submissions].sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      return (a.timeTakenSeconds || 0) - (b.timeTakenSeconds || 0);
    });

    const leaderboard = sorted.slice(0, 50).map((sub, index) => ({
      rank: index + 1,
      studentName: sub.studentName,
      totalScore: sub.totalScore,
      maxMarks: sub.maxMarks || test.totalMarks,
      accuracy: sub.accuracy,
      timeTakenSeconds: sub.timeTakenSeconds,
      submittedAt: sub.submittedAt
    }));

    return res.json({
      success: true,
      testTitle: test.title,
      totalAttempts: submissions.length,
      leaderboard
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not fetch leaderboard', error: err.message });
  }
});

module.exports = router;
