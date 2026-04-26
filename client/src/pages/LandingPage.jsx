import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 p-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6">AI-Powered Interview Preparation. Practice like a pro.</h1>
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-8">Dynamic technical and HR mock interviews, AI feedback, performance analytics, and resume-based personalization.</p>
        <div className="flex justify-center gap-4">
          <Link to="/signup" className="px-8 py-3 bg-brand-700 text-white rounded-lg shadow-lg hover:bg-brand-500 transition">Get started</Link>
          <Link to="/dashboard" className="px-8 py-3 border border-brand-500 text-brand-700 rounded-lg hover:bg-brand-100 transition">Live demo</Link>
        </div>
      </motion.div>

      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-14 max-w-6xl mx-auto grid md:grid-cols-3 gap-5">
        {[
          { title: 'Adaptive Interview', desc: 'Difficulty adjusts automatically based on your performance.' },
          { title: 'AI Evaluation', desc: 'Get detailed scoring on relevance, clarity, and accuracy.' },
          { title: 'Resume IQ', desc: 'Upload your resume for personalized questions.' },
        ].map((item) => (
          <div key={item.title} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-xl transition">
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-slate-600 dark:text-slate-300">{item.desc}</p>
          </div>
        ))}
      </motion.section>
    </div>
  );
}
