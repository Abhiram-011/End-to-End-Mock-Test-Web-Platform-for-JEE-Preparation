const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserDB } = require('../storage/db');
const { authenticate } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'jee_mock_test_jwt_secret_key_2026_super_secure';

// Helper to generate token
function generateToken(user) {
  const id = user._id || user.id;
  return jwt.sign(
    { id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student', targetExam = 'JEE Main 2026' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    // Check existing
    const existing = await UserDB.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserDB.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role === 'teacher' ? 'teacher' : 'student',
      targetExam
    });

    const token = generateToken(newUser);
    const { password: _, ...userData } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: userData
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await UserDB.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password. Please check your credentials.' });
    }

    const token = generateToken(user);
    const { password: _, ...userData } = user;

    return res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: userData
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

// GET /api/auth/demo-accounts
router.get('/demo-accounts', (req, res) => {
  return res.json({
    success: true,
    accounts: [
      { role: 'student', email: 'student@jee.com', password: 'student123', label: 'Sample Student' },
      { role: 'teacher', email: 'teacher@jee.com', password: 'teacher123', label: 'Faculty / Admin' }
    ]
  });
});

module.exports = router;
