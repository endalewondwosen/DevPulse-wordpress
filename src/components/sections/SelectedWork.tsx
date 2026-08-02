import { motion, useReducedMotion } from 'motion/react';
import { ChevronRight, Layers } from 'lucide-react';
import { FEATURED_PROJECTS, resolveFeaturedProject } from '../../lib/featuredProjects';
import type { Post } from '../../types';

interface SelectedWorkProps {
  projects: Post[];
  onSeeAllProjects: () => void;
  onOpenProject: (id: number) => void;
}

const RING_BY_ACCENT: Record<string, string> = {
  emerald: 'hover:border-emerald-500/40',
  blue: 'hover:border-blue-500/40',
  purple: 'hover:border-teal-500/40',
};

const MEDIA_BY_ACCENT: Record<string, string> = {
  emerald: 'from-emerald-500/25 via-zinc-900 to-zinc-950',
  blue: 'from-blue-500/25 via-zinc-900 to-zinc-950',
  purple: 'from-teal-500/25 via-zinc-900 to-zinc-950',
};

const EYEBROW_BY_ACCENT: Record<string, string> = {
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  purple: 'text-teal-400',
};

export function SelectedWork({ projects, onSeeAllProjects, onOpenProject }: SelectedWorkProps) {
  const reduceMotion = useReducedMotion();

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
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.45 }}
        className="flex items-end justify-between gap-4"
      >
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-500">
            Selected Work
          </span>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Production systems, real outcomes.
          </h2>
        </div>
        <button
          type="button"
          onClick={onSeeAllProjects}
          className="group hidden cursor-pointer items-center gap-1.5 text-sm font-semibold text-zinc-400 transition-colors hover:text-emerald-400 md:inline-flex"
        >
          See all projects
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {FEATURED_PROJECTS.map((proj, index) => {
          const matched = resolveFeaturedProject(proj, projects);
          const imageUrl = matched?.image_url;
          const ariaLabel = matched
            ? `Open case study: ${matched.title}`
            : `View projects: ${proj.title}`;

          return (
            <motion.button
              key={proj.title}
              type="button"
              aria-label={ariaLabel}
              onClick={() => handleFeaturedClick(index)}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              className={`surface-shimmer group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 text-left transition-colors duration-300 hover:bg-zinc-900/70 ${RING_BY_ACCENT[proj.accent] || ''}`}
            >
              <div
                className={`relative h-36 overflow-hidden bg-gradient-to-br ${MEDIA_BY_ACCENT[proj.accent] || MEDIA_BY_ACCENT.emerald}`}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Layers className="h-10 w-10 text-zinc-600/80 transition-colors group-hover:text-emerald-500/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <span
                  className={`absolute bottom-3 left-4 text-[10px] font-bold tracking-[0.2em] uppercase ${EYEBROW_BY_ACCENT[proj.accent] || 'text-zinc-400'}`}
                >
                  {proj.eyebrow}
                </span>
                <ChevronRight className="absolute right-3 bottom-3 h-4 w-4 text-zinc-400 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-100" />
              </div>

              <div className="flex flex-col gap-4 p-5 md:p-6">
                <h3 className="text-lg leading-snug font-bold text-zinc-100 md:text-xl">{proj.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{proj.summary}</p>
                <div className="grid grid-cols-3 gap-3 border-t border-zinc-800/80 pt-4">
                  {proj.metrics.map((m) => (
                    <div key={m.label}>
                      <span className="font-display block text-base leading-tight font-extrabold text-zinc-100 md:text-lg">
                        {m.value}
                      </span>
                      <span className="mt-0.5 block text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {proj.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded border border-zinc-700/60 bg-zinc-800/80 px-2 py-0.5 text-[10px] font-bold text-zinc-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-center md:hidden">
        <button
          type="button"
          onClick={onSeeAllProjects}
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-zinc-400 transition-colors hover:text-emerald-400"
        >
          See all projects
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
