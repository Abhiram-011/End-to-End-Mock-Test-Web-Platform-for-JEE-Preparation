const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { sampleTests } = require('../data/seedData');
const { UserModel, TestModel, SubmissionModel } = require('../models/schemas');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

let isMongoConnected = false;
let memoryStore = {
  users: [],
  tests: [],
  submissions: []
};

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadLocalStore() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, 'utf-8');
      memoryStore = JSON.parse(data);
    }
  } catch (err) {
    console.warn('[DB] Could not read local store, starting fresh:', err.message);
  }
}

function saveLocalStore() {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Failed to save local store:', err.message);
  }
}

async function seedInitialData() {
  const salt = await bcrypt.genSalt(10);
  const studentPassword = await bcrypt.hash('student123', salt);
  const teacherPassword = await bcrypt.hash('teacher123', salt);

  const defaultUsers = [
    {
      name: 'Aarav Sharma',
      email: 'student@jee.com',
      password: studentPassword,
      role: 'student',
      targetExam: 'JEE Main 2026'
    },
    {
      name: 'Dr. Vikramaditya Verma (HOD Physics)',
      email: 'teacher@jee.com',
      password: teacherPassword,
      role: 'teacher',
      targetExam: 'Faculty'
    }
  ];

  if (isMongoConnected) {
    // Seed Mongo if empty
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      await UserModel.insertMany(defaultUsers);
      console.log('✅ [DB-Mongo] Seeded default student and teacher accounts');
    }

    const testCount = await TestModel.countDocuments();
    if (testCount === 0) {
      const formattedTests = sampleTests.map(t => ({
        ...t,
        testCode: t.id
      }));
      await TestModel.insertMany(formattedTests);
      console.log(`✅ [DB-Mongo] Seeded ${sampleTests.length} JEE mock tests`);
    }
  } else {
    // Seed Local Store if empty
    if (!memoryStore.users || memoryStore.users.length === 0) {
      memoryStore.users = defaultUsers.map((u, i) => ({
        _id: 'usr-' + (i + 1),
        ...u,
        createdAt: new Date().toISOString()
      }));
    }
    if (!memoryStore.tests || memoryStore.tests.length === 0) {
      memoryStore.tests = sampleTests.map(t => ({
        _id: t.id,
        testCode: t.id,
        ...t
      }));
    }
    if (!memoryStore.submissions) {
      memoryStore.submissions = [];
    }
    saveLocalStore();
    console.log('✅ [DB-Local] Seeded default tests and accounts in embedded store');
  }
}

async function initDB() {
  loadLocalStore();

  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jee_prep';
  try {
    console.log(`[DB] Attempting MongoDB connection at: ${mongoURI}...`);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log('🚀 [DB] Connected to MongoDB database successfully!');
  } catch (err) {
    isMongoConnected = false;
    console.log('ℹ️ [DB] MongoDB not detected or timed out. Activating high-performance Embedded Store.');
  }

  await seedInitialData();
}

// Unified User DB
const UserDB = {
  async findOne(query) {
    if (isMongoConnected) {
      return await UserModel.findOne(query).lean();
    }
    return memoryStore.users.find(u => {
      for (const k in query) {
        if (u[k] !== query[k]) return false;
      }
      return true;
    }) || null;
  },

  async findById(id) {
    if (isMongoConnected) {
      if (mongoose.isValidObjectId(id)) {
        return await UserModel.findById(id).lean();
      }
      return await UserModel.findOne({ _id: id }).lean();
    }
    return memoryStore.users.find(u => String(u._id) === String(id) || String(u.id) === String(id)) || null;
  },

  async create(userData) {
    if (isMongoConnected) {
      const user = new UserModel(userData);
      return (await user.save()).toObject();
    }
    const newUser = {
      _id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      ...userData,
      createdAt: new Date().toISOString()
    };
    memoryStore.users.push(newUser);
    saveLocalStore();
    return newUser;
  }
};

// Unified Test DB
const TestDB = {
  async find(filter = {}) {
    if (isMongoConnected) {
      return await TestModel.find(filter).lean();
    }
    return memoryStore.tests.filter(t => {
      for (const k in filter) {
        if (t[k] !== filter[k]) return false;
      }
      return true;
    });
  },

  async findById(id) {
    if (isMongoConnected) {
      if (mongoose.isValidObjectId(id)) {
        const found = await TestModel.findById(id).lean();
        if (found) return found;
      }
      return await TestModel.findOne({ $or: [{ testCode: id }, { _id: id }] }).lean();
    }
    return memoryStore.tests.find(t => String(t._id) === String(id) || String(t.id) === String(id) || t.testCode === id) || null;
  },

  async create(testData) {
    if (isMongoConnected) {
      const test = new TestModel(testData);
      return (await test.save()).toObject();
    }
    const newTest = {
      _id: 'test-' + Date.now(),
      id: 'test-' + Date.now(),
      testCode: 'test-' + Date.now(),
      ...testData,
      createdAt: new Date().toISOString()
    };
    memoryStore.tests.push(newTest);
    saveLocalStore();
    return newTest;
  },

  async findByIdAndUpdate(id, updateData) {
    if (isMongoConnected) {
      if (mongoose.isValidObjectId(id)) {
        return await TestModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
      }
      return await TestModel.findOneAndUpdate({ $or: [{ testCode: id }, { _id: id }] }, updateData, { new: true }).lean();
    }
    const idx = memoryStore.tests.findIndex(t => String(t._id) === String(id) || String(t.id) === String(id) || t.testCode === id);
    if (idx === -1) return null;
    memoryStore.tests[idx] = { ...memoryStore.tests[idx], ...updateData };
    saveLocalStore();
    return memoryStore.tests[idx];
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected) {
      if (mongoose.isValidObjectId(id)) {
        return await TestModel.findByIdAndDelete(id).lean();
      }
      return await TestModel.findOneAndDelete({ $or: [{ testCode: id }, { _id: id }] }).lean();
    }
    const idx = memoryStore.tests.findIndex(t => String(t._id) === String(id) || String(t.id) === String(id) || t.testCode === id);
    if (idx === -1) return null;
    const deleted = memoryStore.tests.splice(idx, 1)[0];
    saveLocalStore();
    return deleted;
  }
};

// Unified Submission DB
const SubmissionDB = {
  async find(filter = {}) {
    if (isMongoConnected) {
      return await SubmissionModel.find(filter).sort({ submittedAt: -1 }).lean();
    }
    let list = memoryStore.submissions.filter(s => {
      for (const k in filter) {
        if (s[k] !== filter[k]) return false;
      }
      return true;
    });
    return list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  },

  async findById(id) {
    if (isMongoConnected) {
      if (mongoose.isValidObjectId(id)) {
        return await SubmissionModel.findById(id).lean();
      }
      return await SubmissionModel.findOne({ _id: id }).lean();
    }
    return memoryStore.submissions.find(s => String(s._id) === String(id) || String(s.id) === String(id)) || null;
  },

  async create(subData) {
    if (isMongoConnected) {
      const sub = new SubmissionModel(subData);
      return (await sub.save()).toObject();
    }
    const newSub = {
      _id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      id: 'sub-' + Date.now(),
      ...subData,
      submittedAt: new Date().toISOString()
    };
    memoryStore.submissions.push(newSub);
    saveLocalStore();
    return newSub;
  },

  async count(filter = {}) {
    if (isMongoConnected) {
      return await SubmissionModel.countDocuments(filter);
    }
    return (await this.find(filter)).length;
  }
};

module.exports = {
  initDB,
  UserDB,
  TestDB,
  SubmissionDB,
  isUsingMongo: () => isMongoConnected
};
