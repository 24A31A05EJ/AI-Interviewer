import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

export default function Results() {
  const navigate = useNavigate();

  return (
    <Layout title="Results">
      <div className="p-8 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold">Interview session complete</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">Review your history and check targeted recommendations in your dashboard.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-5 px-6 py-2 bg-brand-600 text-white rounded-lg">Go to Dashboard</button>
      </div>
    </Layout>
  );
}
