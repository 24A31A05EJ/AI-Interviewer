import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import Layout from '../components/Layout';

export default function ProfilePage() {
  const { user } = useContext(AppContext);
  const [skills, setSkills] = useState([]);
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    if (!user) return;
    setSkills(['React', 'Node', 'MongoDB']);
    setSuggested(['Graph Algorithms', 'System Design', 'Cloud Architecture']);
  }, [user]);

  return (
    <Layout title="Profile">
      <div className="grid md:grid-cols-2 gap-5">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
          <h3 className="font-semibold">Account</h3>
          <p>Name: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
          <h3 className="font-semibold">Progress</h3>
          <p>Current streak: {user?.stats?.streak || 0}</p>
          <p>Badges: {(user?.stats?.badges || []).join(', ') || 'No badges yet'}</p>
        </div>
      </div>

      <div className="mt-6 p-5 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
        <h3 className="font-semibold">Suggested topics</h3>
        <ul className="list-disc pl-5 mt-2">
          {suggested.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
