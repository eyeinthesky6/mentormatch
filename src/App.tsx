import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useAuthStore } from './store/authStore';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { BrowseMentorsPage } from './pages/BrowseMentorsPage';
import { MentorProfilePage } from './pages/MentorProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import { BookingPage } from './pages/BookingPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MentorDashboard } from './pages/mentor/MentorDashboard';
import { MentorRegistration } from './pages/mentor/MentorRegistration';
import { PaymentPage } from './pages/PaymentPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';

function App() {
  const { checkSession, loading, user } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="browse" element={<BrowseMentorsPage />} />
        <Route path="mentor/:id" element={<MentorProfilePage />} />
        <Route path="book/:mentorId" element={<BookingPage />} />
        <Route path="payment/:bookingId" element={<PaymentPage />} />
        <Route path="payment/success" element={<PaymentSuccessPage />} />
        
        {/* Protected routes */}
        <Route
          path="dashboard"
          element={user ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route
          path="mentor/register"
          element={user ? <MentorRegistration /> : <Navigate to="/login" />}
        />
        <Route
          path="mentor/dashboard"
          element={user?.is_mentor ? <MentorDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="admin/*"
          element={user?.is_admin ? <AdminDashboard /> : <Navigate to="/" />}
        />
      </Route>
    </Routes>
  );
}

export default App;