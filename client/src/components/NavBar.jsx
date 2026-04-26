import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { motion } from 'framer-motion';

export default function NavBar() {
  const { user, setUser, darkMode, setDarkMode } = useContext(AppContext);
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aiInterviewToken');
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full py-4 px-6 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 backdrop-blur sticky top-0 z-20"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="font-bold text-2xl text-brand-700 dark:text-brand-100">AI Interview Pro</Link>
        <div className="flex items-center gap-3">
          <button onClick={() => setDarkMode(!darkMode)} className="text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">{darkMode ? 'Light' : 'Dark'}</button>
          <Link to="/" className="text-sm">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm">Dashboard</Link>
              <Link to="/interview" className="text-sm">Interview</Link>
              <Link to="/profile" className="text-sm">Profile</Link>
              <button onClick={logout} className="text-sm text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/signup" className="text-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
