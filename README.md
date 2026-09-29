# 🚀 End-to-End Mock-Test Web Platform for JEE Preparation

An authentic, production-ready web platform that empowers teachers to create and administer examinations while providing students with a high-fidelity **National Testing Agency (NTA) Computer Based Test (CBT)** simulation, auto-evaluation, subject-wise analytics, and solution walkthroughs.

---

## 🌟 Highlights & Features

### 🖥️ Authentic NTA CBT Exam Interface
- **Official 5-State Question Palette**:
  - ⚪ **Not Visited** (Gray)
  - 🔴 **Not Answered** (Red)
  - 🟢 **Answered** (Green)
  - 🟣 **Marked for Review** (Violet)
  - 🟣🟢 **Answered & Marked for Review** (Violet with Green indicator - evaluated in scoring)
- **Live Countdown Timer**: Real-time timer with pulse-glow alerts during the final 5 minutes and automatic exam submission upon expiry.
- **Multi-Subject Section Tabs**: Instant switching between **Physics**, **Chemistry**, and **Mathematics** with active question counts.
- **Multiple Question Formats**:
  - **Single Choice (MCQ)** with +4 for correct, -1 for incorrect.
  - **Numerical Value Questions** with on-screen virtual keypad (0-9, decimal, negative) and non-negative marking.
- **Live Utilities**: Full "Question Paper" overview modal and NTA official instructions sheet modal.

### 📊 Deep Diagnostic Scorecard & Analytics
- **Granular Scoring**: Total Marks, Positive marks gained, Negative marks lost, and Accuracy percentage.
- **All-India Rank & Percentile Estimation**: Computed dynamically against all cohort submissions.
- **Subject-Wise Breakdowns**: Dedicated metric cards for Physics, Chemistry, and Mathematics showing attempted, correct, incorrect, and subject accuracy.
- **Question-by-Question Solution Review**: Interactive review filterable by *All*, *Correct*, *Incorrect*, and *Skipped*, complete with step-by-step mathematical explanations.
- **Celebration Confetti**: Dynamic celebration animations upon exam completion.

### 👨‍🏫 Teacher & Faculty Portal
- **Test Authoring Studio**: Create custom full-length or topic tests with custom durations, categories, and markings.
- **Multi-Section Builder**: Add multiple sections and question types (MCQ / Numerical) with mathematical formulas, topics, and step-by-step solutions.
- **Cohort Performance Dashboard**: Track total test attempts, batch average score, accuracy rates, and a real-time student submissions feed.
- **Leaderboards**: Official ranking board displaying top rankers, scores, and time taken.

### ⚡ Seamless Dual-Mode Database Architecture
- **MongoDB Native Support**: Connects directly to local MongoDB or MongoDB Atlas via `MONGODB_URI`.
- **Zero-Setup Embedded Store**: Automatically falls back to an embedded JSON database if MongoDB is not running, ensuring **100% crash-free out-of-the-box operation**.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Vanilla CSS (Design Tokens, Glassmorphism, NTA CBT Color Palette), Canvas-Confetti
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), BCrypt.js
- **Database**: MongoDB & Mongoose (with embedded JSON fallback in `server/data/store.json`)
- **Typography**: Google Fonts (*Outfit* & *JetBrains Mono*)

---

## 🔑 Pre-Seeded Demo Accounts (1-Click Login)

The platform includes 1-click login buttons in the navigation bar and authentication modal:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Student** | `student@jee.com` | `student123` | Take tests, view performance, review solutions |
| **Faculty / Teacher** | `teacher@jee.com` | `teacher123` | Author tests, manage catalog, view batch analytics |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- MongoDB (optional - embedded store activates automatically if MongoDB is not running)

### 2. Starting the Application

#### Option A: Run from Root
```bash
# Terminal 1 - Start Backend API
npm run server

# Terminal 2 - Start Frontend Client
npm run client
```

#### Option B: Run Individually
```bash
# In server/
cd server
npm start
# Server starts on http://localhost:5000

# In client/ (separate terminal)
cd client
npm run dev
# Web app starts on http://localhost:3000
```

Open your browser and navigate to **`http://localhost:3000`**.

---

## 📁 Project Structure

```
end_end project/
├── package.json               # Root scripts for client & server
├── README.md                  # Complete documentation
│
├── server/                    # Backend API (Node.js & Express)
│   ├── .env                   # Server environment configuration
│   ├── .env.example           # Example environment template
│   ├── package.json           # Server dependencies & scripts
│   ├── server.js              # Express app entry point
│   ├── models/
│   │   └── schemas.js         # Mongoose schemas (User, Test, Submission)
│   ├── storage/
│   │   └── db.js              # Dual-mode storage engine (MongoDB + JSON fallback)
│   ├── middleware/
│   │   └── auth.js            # JWT verification & role authorization
│   ├── routes/
│   │   ├── authRoutes.js      # Register, Login, Me, Demo accounts
│   │   ├── testRoutes.js      # Test CRUD & sanitized exam loading
│   │   ├── submissionRoutes.js# Auto-grading, scoring, results analysis
│   │   └── analyticsRoutes.js # Teacher metrics & test leaderboard
│   └── data/
│       ├── seedData.js        # High-yield Physics, Chemistry, and Math questions
│       └── store.json         # Embedded database persistence file
│
└── client/                    # Frontend Application (React + Vite)
    ├── index.html             # HTML entry with SEO metadata and Google Fonts
    ├── package.json           # Client dependencies
    ├── vite.config.js         # Vite configuration with API proxy to port 5000
    └── src/
        ├── index.css          # Design system & NTA official CBT styling
        ├── main.jsx           # React DOM root
        ├── App.jsx            # Routing and view orchestration
        ├── context/
        │   └── AuthContext.jsx# Authentication state & 1-click demo logins
        ├── services/
        │   └── api.js         # Unified API client
        ├── components/
        │   ├── Navbar.jsx     # Header navigation & role badges
        │   ├── CBTHeader.jsx  # NTA Exam banner, candidate card, timer
        │   ├── QuestionPalette.jsx # 5-state official CBT question tracker
        │   ├── MathRenderer.jsx    # Formula and mathematical formatter
        │   ├── QuestionPaperModal.jsx # Full question paper preview
        │   └── InstructionsModal.jsx  # Official exam instructions sheet
        └── pages/
            ├── HomePage.jsx          # Landing page & test catalog
            ├── AuthModal.jsx         # Sign in, sign up, demo buttons
            ├── ExamInterface.jsx     # Centerpiece: Fullscreen JEE CBT Exam
            ├── ResultAnalysis.jsx    # Scorecard, analytics, solution review
            ├── StudentDashboard.jsx  # Student past attempts & performance
            ├── TeacherDashboard.jsx  # Author new tests & batch diagnostics
            └── LeaderboardModal.jsx  # Rank board and percentiles
```

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create student or teacher account
- `POST /api/auth/login` - Authenticate and obtain JWT
- `GET /api/auth/me` - Get current session user profile
- `GET /api/auth/demo-accounts` - List 1-click demo credentials

### Tests (`/api/tests`)
- `GET /api/tests` - List published mock tests with metadata
- `GET /api/tests/:id` - Get overview of a test
- `GET /api/tests/:id/take` - Load sanitized questions for active exam session
- `POST /api/tests` - Create a new test *(Teacher only)*
- `PUT /api/tests/:id` - Update a test *(Teacher only)*
- `DELETE /api/tests/:id` - Delete a test *(Teacher only)*

### Submissions & Grading (`/api/submissions`)
- `POST /api/submissions/:testId` - Submit responses, auto-grade, calculate scores & percentiles
- `GET /api/submissions/my` - Fetch test attempt history for current student
- `GET /api/submissions/:id` - Detailed diagnostic scorecard with full solutions

### Analytics (`/api/analytics`)
- `GET /api/analytics/dashboard` - Cohort stats and recent submissions *(Teacher only)*
- `GET /api/analytics/leaderboard/:testId` - Test leaderboard rankings

---

## 🧪 Testing the Platform

1. Launch both servers or confirm they are running (`http://localhost:3000` & `http://localhost:5000`).
2. Click **🎓 Student Demo** to log in as Aarav Sharma.
3. On the homepage, click **Take Mock Exam ➔** on *JEE Main 2026 - All India Full Mock Test 01*.
4. Experience the **NTA CBT** interface:
   - Try selecting answers and clicking **Save & Next**.
   - Notice the **Question Palette** dynamically changing question colors.
   - Switch sections between **Physics**, **Chemistry**, and **Mathematics**.
   - Open **Question Paper** or **Instructions** to verify modal views.
5. Click **Submit Exam 🏁** to finalize your attempt.
6. Review the **Performance Diagnostics**: total score, rank, percentile, subject progress, and question-by-question step-by-step solutions!
7. Click **Switch to Teacher** in the top bar to inspect the **Teacher Portal**, author custom tests, or monitor student submissions.
