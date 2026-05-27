import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface SelectedWorkProps {
  onSeeAllProjects: () => void;
}

const PROJECTS = [
  {
    eyebrow: 'e-Government',
    title: 'Government Service Portal',
    summary:
      'Citizen platform digitizing public services across Shaggar City — RBAC, Fayda National ID, QR-verified certificates, and multi-language support.',
    stack: ['Laravel', 'Next.js', 'MySQL', 'TypeScript'],
    metrics: [
      { value: '4K+', label: 'Users' },
      { value: '140+', label: 'Services' },
      { value: '97%', label: 'Satisfaction' },
    ],
    accent: 'emerald',
  },
  {
    eyebrow: 'Public Sector · Fintech',
    title: 'Shaggar City Traffic Management',
    summary:
      'Revenue-bearing platform for 450+ government users across 12 subcities — TeleBirr integration, automated late-fee calculation, public REST API.',
    stack: ['Laravel', 'Next.js', 'MySQL', 'TeleBirr'],
    metrics: [
      { value: 'ETB 500M+', label: 'Revenue' },
      { value: '400K+', label: 'Charges' },
      { value: '12', label: 'Subcities' },
    ],
    accent: 'blue',
  },
  {
    eyebrow: 'Queue Management',
    title: 'One Stop Service Center (Mesob)',
    summary:
      'Multi-city queue & service-token system with self-service kiosks, real-time TV displays, citizen feedback, and multi-language reporting.',
    stack: ['Laravel', 'MySQL', 'REST API'],
    metrics: [
      { value: '70K+', label: 'Tokens' },
      { value: '6+', label: 'Cities' },
      { value: '500+', label: 'Daily Citizens' },
    ],
    accent: 'purple',
  },
];

const RING_BY_ACCENT: Record<string, string> = {
  emerald: 'hover:border-emerald-500/40 hover:shadow-emerald-500/5',
  blue: 'hover:border-blue-500/40 hover:shadow-blue-500/5',
  purple: 'hover:border-purple-500/40 hover:shadow-purple-500/5',
};

const EYEBROW_BY_ACCENT: Record<string, string> = {
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
};

export function SelectedWork({ onSeeAllProjects }: SelectedWorkProps) {
  return (
    <section aria-label="Featured Work" className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.25em]">
            Selected Work
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
            Production systems, real outcomes.
          </h2>
        </div>
        <button
          onClick={onSeeAllProjects}
          className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-400 hover:text-emerald-400 transition-colors group cursor-pointer"
        >
          See all projects
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROJECTS.map((proj) => (
          <button
            key={proj.title}
            type="button"
            onClick={onSeeAllProjects}
            className={`group text-left flex flex-col gap-5 p-6 md:p-7 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl transition-all duration-300 hover:bg-zinc-900/70 hover:-translate-y-0.5 shadow-sm ${RING_BY_ACCENT[proj.accent] || ''}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${EYEBROW_BY_ACCENT[proj.accent] || 'text-zinc-400'}`}>
                {proj.eyebrow}
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-100 group-hover:translate-x-0.5 transition-all" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-zinc-100 leading-snug">
              {proj.title}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{proj.summary}</p>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800/80">
              {proj.metrics.map((m, mi) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: mi * 0.08, duration: 0.4, ease: 'easeOut' }}
                >
                  <span className="block text-base md:text-lg font-extrabold text-zinc-100 leading-tight">
                    {m.value}
                  </span>
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                    {m.label}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {proj.stack.map((s) => (
                <span
                  key={s}
                  className="text-[10px] font-bold px-2 py-0.5 bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 rounded"
                >
                  {s}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="md:hidden flex justify-center">
        <button
          onClick={onSeeAllProjects}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
        >
          See all projects
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
