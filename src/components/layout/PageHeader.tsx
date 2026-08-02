import { motion, useReducedMotion } from 'motion/react';
import { Terminal } from 'lucide-react';

export type PageHeaderTab = 'projects' | 'snippets';

const TAB_CONFIG: Record<
  PageHeaderTab,
  { title: string; subtitle: string; placeholder: string }
> = {
  projects: {
    title: 'Projects',
    subtitle: 'Case studies from production systems.',
    placeholder: 'Search projects…',
  },
  snippets: {
    title: 'Code Lab',
    subtitle: 'Reusable patterns and implementation notes.',
    placeholder: 'Search snippets…',
  },
};

interface PageHeaderProps {
  tab: PageHeaderTab;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PageHeader({ tab, searchQuery, onSearchChange }: PageHeaderProps) {
  const { title, subtitle, placeholder } = TAB_CONFIG[tab];
  const reduceMotion = useReducedMotion();

  return (
    <header className="mb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <motion.div
          key={tab}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-100 md:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full shrink-0 sm:w-72"
        >
          <Terminal className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            aria-label={placeholder}
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-2.5 pr-4 pl-11 text-sm text-zinc-100 transition-colors placeholder:text-zinc-500 focus:border-emerald-500/50 focus:outline-none"
          />
        </motion.div>
      </div>
    </header>
  );
}
