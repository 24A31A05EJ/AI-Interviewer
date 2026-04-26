import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'general' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      localStorage.setItem('aiInterviewToken', data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Sign up</h2>
      <form onSubmit={submit} className="space-y-4">
        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" required className="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-900" />
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required className="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-900" />
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" required className="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-900" />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-900">
          <option value="general">General</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="ai_ml">AI/ML</option>
        </select>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full py-3 bg-brand-700 text-white rounded-lg hover:bg-brand-500 transition">Create account</button>
      </form>
    </motion.div>
  );
}
