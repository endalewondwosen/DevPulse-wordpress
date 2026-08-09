import { motion, useReducedMotion } from 'motion/react';
import { ChevronRight, FileText, User } from 'lucide-react';
import { AVAILABILITY_LINE, EXPERIENCE_YEARS } from '../../lib/constants';
import { revealViewport } from '../../lib/motion';

interface HeroProps {
  settings: Record<string, string>;
  loading: boolean;
  onExploreProjects: () => void;
  onOpenResume: () => void;
}

const STATS = [
  { value: '500M+', label: 'ETB Revenue Processed', accent: true },
  { value: '4K+', label: 'Users Served', accent: false },
  { value: '6+', label: 'Cities Deployed', accent: false },
];

export function Hero({ settings, loading, onExploreProjects, onOpenResume }: HeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="relative pt-2 md:pt-4">
      {/* Atmosphere — soft depth, not flat fill */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-16 h-[420px] w-[420px] rounded-full bg-emerald-500/[0.08] blur-[110px]" />
        <div className="absolute top-32 right-0 h-[360px] w-[360px] rounded-full bg-teal-500/[0.06] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* First viewport: brand · headline · line · CTAs · portrait */}
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14 lg:min-h-[min(78vh,720px)]">
        <div className="order-2 flex flex-col items-start text-left lg:order-1 lg:col-span-6">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-5 text-[10px] font-semibold tracking-[0.12em] text-emerald-400/90 uppercase sm:text-[11px] sm:tracking-[0.18em]"
          >
            {AVAILABILITY_LINE}
          </motion.p>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-display mb-5 text-4xl font-extrabold leading-[0.98] tracking-tight text-zinc-100 sm:text-6xl md:text-7xl"
          >
            Wondwosen
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Endale
            </span>
          </motion.h1>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hero-shimmer-line mb-6 h-px w-28 origin-left"
          />

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mb-3 max-w-md text-xl font-semibold leading-snug text-zinc-100 md:text-2xl"
          >
            Government-scale platforms in production.
          </motion.p>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="mb-9 max-w-md text-base leading-relaxed text-zinc-400 md:text-lg"
          >
            {EXPERIENCE_YEARS} shipping MERN, Next.js, and Laravel systems used daily across cities.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="flex flex-wrap gap-3"
          >
            <button
              type="button"
              onClick={onExploreProjects}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-emerald-500 px-7 py-3.5 font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              Explore Case Studies
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={onOpenResume}
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-7 py-3.5 font-bold text-zinc-100 transition-colors hover:border-zinc-700 hover:bg-zinc-900 cursor-pointer"
            >
              <FileText className="h-4 w-4 text-emerald-500" />
              View Resume
            </button>
          </motion.div>
        </div>

        <div className="relative order-1 lg:order-2 lg:col-span-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="relative mx-auto w-full max-w-xs sm:max-w-md lg:max-w-none"
          >
            <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-emerald-500/15 via-transparent to-teal-500/10 blur-2xl" />
            <div className="relative aspect-[4/5] max-h-[52vh] overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900 sm:max-h-none">
              {loading ? (
                <div className="flex h-full w-full items-center justify-center bg-zinc-800/80">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-700/80">
                    <User className="h-8 w-8 animate-pulse text-zinc-500" />
                  </div>
                </div>
              ) : (
                <img
                  src={settings.profile_image || '/profile.png'}
                  alt="Wondwosen Endale"
                  className={`h-full w-full object-cover ${reduceMotion ? '' : 'hero-ken'}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full bg-zinc-800 flex items-center justify-center">
                          <div class="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center">
                            <svg class="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-zinc-950/10" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Impact strip — just below the first composition for recruiter skim */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={revealViewport}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-10 grid grid-cols-3 gap-2 border-y border-zinc-800/80 py-6 sm:gap-4 md:mt-16 md:gap-8 md:py-8"
      >
        {STATS.map((s) => (
          <div key={s.label} className="min-w-0">
            <span
              className={`font-display block text-xl font-extrabold tracking-tight sm:text-2xl md:text-4xl ${
                s.accent ? 'text-emerald-400' : 'text-zinc-100'
              }`}
            >
              {s.value}
            </span>
            <span className="mt-1 block text-[9px] leading-snug font-bold tracking-wide text-zinc-500 uppercase sm:text-[10px] sm:tracking-[0.14em]">
              {s.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
