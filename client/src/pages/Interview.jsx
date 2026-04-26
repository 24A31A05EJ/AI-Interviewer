import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const roles = ['general', 'frontend', 'backend', 'ai_ml'];
const difficulties = ['easy', 'medium', 'hard'];

export default function Interview() {
  const { user } = useContext(AppContext);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState('technical');
  const [topic, setTopic] = useState('technical');
  const [role, setRole] = useState(user?.role || 'general');
  const [difficulty, setDifficulty] = useState('easy');
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState([]);
  const [timer, setTimer] = useState(60);
  const [evaluations, setEvaluations] = useState(null);

  useEffect(() => {
    if (!question) return;
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [question, timer]);

  const generateQuestion = async () => {
    const res = await fetch(`/api/questions/generate?role=${role}&topic=${topic}&difficulty=${difficulty}`);
    const data = await res.json();
    setQuestion(data);
    setTimer(60);
  };

  const submitAnswer = async () => {
    const token = localStorage.getItem('aiInterviewToken');
    const body = { question: question.question, answer, role, topic, difficulty };
    const res = await fetch('/api/interview/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setEvaluations(data.evaluation);
    setHistory((h) => [...h, { ...body, ...data.evaluation }]);
    setDifficulty(data.nextDifficulty);
    setStep(step + 1);
    setAnswer('');
  };

  useEffect(() => {
    if (!question) generateQuestion();
  }, [topic, role, difficulty]);

  return (
    <Layout title="Mock Interview">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm">Mode</span>
            <select value={mode} onChange={(e) => setMode(e.target.value)} className="p-2 border rounded-lg bg-slate-50 dark:bg-slate-800">
              <option value="technical">Technical</option>
              <option value="hr">HR</option>
              <option value="role_based">Role-based</option>
            </select>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2">
            <select value={topic} onChange={(e) => setTopic(e.target.value)} className="p-2 border rounded-lg bg-slate-50 dark:bg-slate-800">
              <option value="technical">DSA</option>
              <option value="dbms">DBMS</option>
              <option value="os">OS</option>
              <option value="cn">CN</option>
              <option value="behavioral">Behavioral</option>
            </select>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 border rounded-lg bg-slate-50 dark:bg-slate-800">
              {roles.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="p-2 border rounded-lg bg-slate-50 dark:bg-slate-800">
              {difficulties.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <button onClick={generateQuestion} className="px-3 py-2 bg-brand-600 text-white rounded-lg">Next question</button>
          </div>

          <div className="p-5 border rounded-xl bg-slate-50 dark:bg-slate-800">
            <div className="mb-3 text-sm text-slate-500">Question {step + 1}</div>
            <div className="text-xl font-semibold">{question?.question || 'Loading question...'}</div>
            <div className="mt-1 text-slate-600 dark:text-slate-300">Topic: {topic} • Difficulty: {difficulty} • Role: {role}</div>
          </div>

          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={6} placeholder="Type your answer..." className="w-full mt-4 p-3 border rounded-lg bg-slate-50 dark:bg-slate-900"></textarea>

          <div className="mt-4 flex items-center justify-between gap-2">
            <button onClick={submitAnswer} className="px-6 py-2 bg-brand-700 text-white rounded-lg">Submit</button>
            <span className="text-sm text-slate-500">Time left: {timer}s</span>
          </div>

          {evaluations && (
            <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border">
              <h4 className="font-semibold">AI Feedback</h4>
              <p>Score: {evaluations.score}</p>
              <p>Clarity: {evaluations.clarity}</p>
              <p>Relevance: {evaluations.relevance}</p>
              <p>Technical: {evaluations.technical}</p>
              <p>{evaluations.feedback}</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-3">Session summary</h3>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {history.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border">
                <p className="text-sm font-medium">{item.question}</p>
                <p className="text-xs text-slate-500">Score: {item.score}</p>
                <p className="text-xs text-green-600 dark:text-green-400">Next difficulty: {difficulty}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
