import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ExamInterface from './pages/ExamInterface';
import ResultAnalysis from './pages/ResultAnalysis';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AuthModal from './pages/AuthModal';
import LeaderboardModal from './pages/LeaderboardModal';

function AppContent() {
  const { user, isAuthenticated, isTeacher } = useAuth();

  // Navigation state: 'home' | 'exam' | 'result' | 'student-dashboard' | 'teacher-dashboard'
  const [currentPage, setCurrentPage] = useState('home');
  const [currentTestId, setCurrentTestId] = useState(null);
  const [currentSubmissionId, setCurrentSubmissionId] = useState(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login');
  
  const [leaderboardModal, setLeaderboardModal] = useState({
    isOpen: false,
    testId: null,
    testTitle: ''
  });

  const handleStartExam = (testId) => {
    setCurrentTestId(testId);
    setCurrentPage('exam');
  };

  const handleFinishExam = (submissionId) => {
    setCurrentSubmissionId(submissionId);
    setCurrentPage('result');
  };

  const handleOpenAuth = (tab = 'login') => {
    setAuthInitialTab(tab);
    setIsAuthOpen(true);
  };

  const handleOpenLeaderboard = (testId, testTitle) => {
    setLeaderboardModal({
      isOpen: true,
      testId,
      testTitle
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar is visible everywhere except during the live exam to guarantee full immersion */}
      {currentPage !== 'exam' && (
        <Navbar
          onOpenAuth={handleOpenAuth}
          onNavigate={(page) => setCurrentPage(page)}
          currentPage={currentPage}
        />
      )}

      {/* Main Page Router */}
      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <HomePage
            onStartExam={handleStartExam}
            onOpenLeaderboard={handleOpenLeaderboard}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentPage === 'exam' && currentTestId && (
          <ExamInterface
            testId={currentTestId}
            candidateName={user?.name || 'Aarav Sharma'}
            onFinishExam={handleFinishExam}
          />
        )}

        {currentPage === 'result' && currentSubmissionId && (
          <ResultAnalysis
            submissionId={currentSubmissionId}
            onNavigateHome={() => setCurrentPage('home')}
            onOpenLeaderboard={handleOpenLeaderboard}
          />
        )}

        {currentPage === 'student-dashboard' && (
          <StudentDashboard
            onSelectSubmission={(subId) => {
              setCurrentSubmissionId(subId);
              setCurrentPage('result');
            }}
            onStartExam={handleStartExam}
          />
        )}

        {currentPage === 'teacher-dashboard' && (
          <TeacherDashboard
            onStartExam={handleStartExam}
            onSelectSubmission={(subId) => {
              setCurrentSubmissionId(subId);
              setCurrentPage('result');
            }}
          />
        )}
      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authInitialTab}
      />

      <LeaderboardModal
        isOpen={leaderboardModal.isOpen}
        onClose={() => setLeaderboardModal({ isOpen: false, testId: null, testTitle: '' })}
        testId={leaderboardModal.testId}
        testTitle={leaderboardModal.testTitle}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
