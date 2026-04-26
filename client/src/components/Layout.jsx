import { motion } from 'framer-motion';

export default function Layout({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto p-6"
    >
      {title && <h1 className="text-3xl font-bold mb-6">{title}</h1>}
      {children}
    </motion.div>
  );
}
