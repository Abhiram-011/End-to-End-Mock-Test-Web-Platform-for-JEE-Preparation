const express = require('express');
const router = express.Router();
const { TestDB } = require('../storage/db');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/tests - list tests
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isPublished: true };
    if (category && category !== 'All') {
      filter.category = category;
    }

    const tests = await TestDB.find(filter);
    
    // Format response with summary stats
    const summaries = tests.map(t => {
      let totalQuestions = 0;
      const sectionBreakdown = {};

      (t.sections || []).forEach(sec => {
        const count = (sec.questions || []).length;
        totalQuestions += count;
        sectionBreakdown[sec.name] = count;
      });

      return {
        id: t._id || t.id,
        _id: t._id || t.id,
        title: t.title,
        description: t.description,
        category: t.category,
        durationMinutes: t.durationMinutes,
        totalMarks: t.totalMarks,
        totalQuestions,
        sectionBreakdown,
        isPublished: t.isPublished,
        createdAt: t.createdAt
      };
    });

    return res.json({ success: true, tests: summaries });
  } catch (err) {
    console.error('Fetch tests error:', err);
    return res.status(500).json({ success: false, message: 'Could not fetch tests', error: err.message });
  }
});

// GET /api/tests/:id - get test overview
router.get('/:id', async (req, res) => {
  try {
    const test = await TestDB.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    let totalQuestions = 0;
    const sections = (test.sections || []).map(sec => {
      const qCount = (sec.questions || []).length;
      totalQuestions += qCount;
      return {
        name: sec.name,
        instructions: sec.instructions,
        questionCount: qCount
      };
    });

    return res.json({
      success: true,
      test: {
        id: test._id || test.id,
        _id: test._id || test.id,
        title: test.title,
        description: test.description,
        category: test.category,
        durationMinutes: test.durationMinutes,
        totalMarks: test.totalMarks,
        totalQuestions,
        sections,
        createdAt: test.createdAt
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving test', error: err.message });
  }
});

// GET /api/tests/:id/take - Start exam session (returns questions with answers STRIPPED for anti-cheat)
router.get('/:id/take', authenticate, async (req, res) => {
  try {
    const test = await TestDB.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    // Sanitize questions to protect test integrity
    const sanitizedSections = (test.sections || []).map(sec => ({
      name: sec.name,
      instructions: sec.instructions,
      questions: (sec.questions || []).map(q => ({
        id: q.id || q._id,
        type: q.type,
        questionText: q.questionText,
        options: q.options || [],
        positiveMarks: q.positiveMarks,
        negativeMarks: q.negativeMarks,
        topic: q.topic,
        difficulty: q.difficulty,
        diagramSvg: q.diagramSvg || ''
        // correctAnswer and explanation deliberately omitted!
      }))
    }));

    return res.json({
      success: true,
      test: {
        id: test._id || test.id,
        _id: test._id || test.id,
        title: test.title,
        durationMinutes: test.durationMinutes,
        totalMarks: test.totalMarks,
        sections: sanitizedSections
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not load exam', error: err.message });
  }
});

// POST /api/tests - Create new test (Teacher role)
router.post('/', authenticate, requireRole('teacher'), async (req, res) => {
  try {
    const { title, description, category, durationMinutes, totalMarks, sections } = req.body;

    if (!title || !sections || sections.length === 0) {
      return res.status(400).json({ success: false, message: 'Title and at least one section with questions are required.' });
    }

    // Process questions and ensure IDs
    const processedSections = sections.map((sec, secIdx) => ({
      name: sec.name || `Section ${secIdx + 1}`,
      instructions: sec.instructions || '',
      questions: (sec.questions || []).map((q, qIdx) => ({
        id: q.id || `q-${sec.name ? sec.name.toLowerCase().substring(0, 3) : 'sec'}-${Date.now()}-${qIdx}`,
        type: q.type || 'mcq',
        questionText: q.questionText || '',
        options: q.options || [],
        correctAnswer: q.correctAnswer || '',
        positiveMarks: Number(q.positiveMarks) || 4,
        negativeMarks: Number(q.negativeMarks) >= 0 ? Number(q.negativeMarks) : 1,
        explanation: q.explanation || '',
        topic: q.topic || 'General',
        difficulty: q.difficulty || 'Medium'
      }))
    }));

    const newTest = await TestDB.create({
      title: title.trim(),
      description: description || '',
      category: category || 'JEE Main',
      durationMinutes: Number(durationMinutes) || 180,
      totalMarks: Number(totalMarks) || 300,
      sections: processedSections,
      createdBy: req.user._id || req.user.id,
      isPublished: true
    });

    return res.status(201).json({
      success: true,
      message: 'Test created successfully',
      test: newTest
    });
  } catch (err) {
    console.error('Create test error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create test', error: err.message });
  }
});

// PUT /api/tests/:id - Update test (Teacher role)
router.put('/:id', authenticate, requireRole('teacher'), async (req, res) => {
  try {
    const updated = await TestDB.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    return res.json({ success: true, message: 'Test updated successfully', test: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update test', error: err.message });
  }
});

// DELETE /api/tests/:id - Delete test (Teacher role)
router.delete('/:id', authenticate, requireRole('teacher'), async (req, res) => {
  try {
    const deleted = await TestDB.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    return res.json({ success: true, message: 'Test deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete test', error: err.message });
  }
});

module.exports = router;
