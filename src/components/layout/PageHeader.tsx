import { motion } from 'motion/react';
import { Terminal } from 'lucide-react';

export type PageHeaderTab = 'projects' | 'snippets';

const TAB_CONFIG: Record<PageHeaderTab, { title: string; placeholder: string }> = {
  projects: { title: 'Projects', placeholder: 'Search projects…' },
  snippets: { title: 'Code Lab', placeholder: 'Search snippets…' },
};

interface PageHeaderProps {
  tab: PageHeaderTab;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PageHeader({ tab, searchQuery, onSearchChange }: PageHeaderProps) {
  const { title, placeholder } = TAB_CONFIG[tab];

  return (
    <header className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.h1
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full sm:w-72 shrink-0"
        >
          <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input
            type="search"
            aria-label={placeholder}
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </motion.div>
      </div>
    </header>
  );
}
