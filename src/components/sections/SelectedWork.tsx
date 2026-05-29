import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { FEATURED_PROJECTS, resolveFeaturedProject } from '../../lib/featuredProjects';
import type { Post } from '../../types';

interface SelectedWorkProps {
  projects: Post[];
  onSeeAllProjects: () => void;
  onOpenProject: (id: number) => void;
}

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

export function SelectedWork({ projects, onSeeAllProjects, onOpenProject }: SelectedWorkProps) {
  const handleFeaturedClick = (featuredIndex: number) => {
    const featured = FEATURED_PROJECTS[featuredIndex];
    const matched = resolveFeaturedProject(featured, projects);
    if (matched) {
      onOpenProject(matched.id);
      return;
    }
    onSeeAllProjects();
  };

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
          type="button"
          onClick={onSeeAllProjects}
          className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-400 hover:text-emerald-400 transition-colors group cursor-pointer"
        >
          See all projects
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURED_PROJECTS.map((proj, index) => {
          const matched = resolveFeaturedProject(proj, projects);
          const ariaLabel = matched
            ? `Open case study: ${matched.title}`
            : `View projects: ${proj.title}`;

          return (
            <button
              key={proj.title}
              type="button"
              aria-label={ariaLabel}
              onClick={() => handleFeaturedClick(index)}
              className={`group text-left flex flex-col gap-5 p-6 md:p-7 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl transition-all duration-300 hover:bg-zinc-900/70 hover:-translate-y-0.5 shadow-sm ${RING_BY_ACCENT[proj.accent] || ''}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] ${EYEBROW_BY_ACCENT[proj.accent] || 'text-zinc-400'}`}
                >
                  {proj.eyebrow}
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-100 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-zinc-100 leading-snug">{proj.title}</h3>
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
          );
        })}
      </div>

      <div className="md:hidden flex justify-center">
        <button
          type="button"
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
