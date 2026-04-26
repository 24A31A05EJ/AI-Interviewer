import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const COLORS = ['#634FC0', '#00BBF9', '#FF8A65', '#FFD54F', '#A389F4'];

export default function Dashboard() {
  const { user } = useContext(AppContext);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem('aiInterviewToken');
    const res = await fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } });
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  if (!data) return <div className="p-10">Loading...</div>;

  const trendData = data.history.map((item) => ({ date: new Date(item.createdAt).toLocaleDateString(), score: item.overallScore }));

  return (
    <Layout title="Dashboard">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-5">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
          <p className="text-sm text-slate-500">Interview Sessions</p>
          <h2 className="text-3xl font-bold">{data.metrics.interviewCount}</h2>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
          <p className="text-sm text-slate-500">Average Score</p>
          <h2 className="text-3xl font-bold">{data.metrics.avgScore}</h2>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
          <p className="text-sm text-slate-500">Weak Topics</p>
          <h2 className="text-3xl font-bold">{data.metrics.weakTopics.length}</h2>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-3">Score Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-3">Weak Topics</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.metrics.weakTopics} dataKey="avgScore" nameKey="topic" cx="50%" cy="50%" outerRadius={90} fill="#8884d8" label>
                {data.metrics.weakTopics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="mt-8 p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-3">Personalized recommendations</h3>
        <ul className="list-disc pl-5 text-slate-700 dark:text-slate-200">
          <li>Practice more on topics with scores below 70.</li>
          <li>Try a timed mock interview to improve speed and clarity.</li>
          <li>Upload your resume for tailored questions.</li>
        </ul>
      </div>
    </Layout>
  );
}
