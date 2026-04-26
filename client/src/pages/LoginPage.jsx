import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed');
      localStorage.setItem('aiInterviewToken', data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-4">
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required className="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-900" />
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" required className="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-900" />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full py-3 bg-brand-700 text-white rounded-lg hover:bg-brand-500 transition">Login</button>
      </form>
    </motion.div>
  );
}
