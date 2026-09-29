const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['mcq', 'numerical'], default: 'mcq' },
  questionText: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  positiveMarks: { type: Number, default: 4 },
  negativeMarks: { type: Number, default: 1 },
  explanation: { type: String, default: '' },
  topic: { type: String, default: 'General' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  diagramSvg: { type: String, default: '' }
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  instructions: { type: String, default: '' },
  questions: [questionSchema]
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], default: 'student' },
  avatar: { type: String, default: '' },
  targetExam: { type: String, default: 'JEE Main 2026' },
  createdAt: { type: Date, default: Date.now }
});

const testSchema = new mongoose.Schema({
  testCode: { type: String, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, enum: ['JEE Main', 'JEE Advanced', 'Subject Test'], default: 'JEE Main' },
  durationMinutes: { type: Number, default: 180 },
  totalMarks: { type: Number, default: 300 },
  sections: [sectionSchema],
  createdBy: { type: String, default: 'system' },
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const submissionSchema = new mongoose.Schema({
  testId: { type: String, required: true },
  testTitle: { type: String, required: true },
  userId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, default: '' },
  answers: [{
    questionId: { type: String, required: true },
    sectionName: { type: String, required: true },
    selectedOption: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, default: 'not_visited' },
    timeSpentSeconds: { type: Number, default: 0 },
    isCorrect: { type: Boolean, default: false },
    marksAwarded: { type: Number, default: 0 }
  }],
  totalScore: { type: Number, default: 0 },
  maxMarks: { type: Number, default: 300 },
  positiveMarks: { type: Number, default: 0 },
  negativeMarks: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  sectionScores: { type: mongoose.Schema.Types.Mixed, default: {} },
  timeTakenSeconds: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
const TestModel = mongoose.models.Test || mongoose.model('Test', testSchema);
const SubmissionModel = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);

module.exports = {
  UserModel,
  TestModel,
  SubmissionModel
};
