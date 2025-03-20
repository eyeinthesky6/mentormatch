import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Trophy, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Toaster } from 'react-hot-toast';

export function Layout() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">MentorMatch</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/browse" className="text-gray-600 hover:text-gray-900">
              Browse Mentors
            </Link>
            <Link to="/how-it-works" className="text-gray-600 hover:text-gray-900">
              How it Works
            </Link>
            {user?.is_mentor && (
              <Link to="/mentor/dashboard" className="text-gray-600 hover:text-gray-900">
                Mentor Dashboard
              </Link>
            )}
            {user?.is_admin && (
              <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <User className="h-5 w-5" />
                  <span>{user.full_name}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <Toaster position="top-right" />
    </div>
  );
}