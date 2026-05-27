import { motion } from 'motion/react';
import { Terminal } from 'lucide-react';

interface PageHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PageHeader({ searchQuery, onSearchChange }: PageHeaderProps) {
  return (
    <header className="mb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-4"
          >
            Engineering <span className="text-emerald-500">Scalable Systems</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-xl leading-relaxed"
          >
            A professional showcase of modern full-stack architecture. Focused on performance,
            maintainability, and building robust digital products that drive real-world impact.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full md:w-72"
        >
          <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </motion.div>
      </div>
    </header>
  );
}
