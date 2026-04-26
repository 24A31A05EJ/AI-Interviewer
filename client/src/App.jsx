import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { createContext, useEffect, useMemo, useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Results from './pages/Results';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NavBar from './components/NavBar';

export const AppContext = createContext(null);

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('aiInterviewToken');
    if (!token) return;
    fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const value = useMemo(() => ({ user, setUser, darkMode, setDarkMode }), [user, darkMode]);

  return (
    <AppContext.Provider value={value}>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-all duration-300">
          <NavBar />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/interview" element={user ? <Interview /> : <Navigate to="/login" />} />
              <Route path="/results" element={user ? <Results /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
