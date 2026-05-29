import { motion } from 'motion/react';
import { ChevronRight, FileText, User } from 'lucide-react';

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
  return (
    <section id="about" className="pt-4 pb-0 md:pt-8 relative">
      {/* Modern Ambient Glow */}
      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-40 right-10 w-[250px] h-[250px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col items-start text-left order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold tracking-wider uppercase mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Open to Senior Full-Stack roles
            <span className="text-emerald-500/40">·</span>
            <span className="text-emerald-400/90">Remote / Hybrid</span>
            <span className="text-emerald-500/40">·</span>
            <span className="text-emerald-400/90">Immediate</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-zinc-100 leading-[1.05]"
          >
            Wondwosen{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
              Endale.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-zinc-100 text-xl md:text-2xl font-semibold leading-snug mb-5 max-w-xl"
          >
            I build government-scale platforms in production — serving cities, processing payments, and digitizing public services.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-base md:text-lg leading-relaxed mb-8 max-w-xl"
          >
            Full-Stack Engineer with 3+ years shipping production systems on the{' '}
            <span className="text-zinc-100 font-semibold">MERN stack, Next.js, and Laravel</span>, with PostgreSQL, MySQL, and MongoDB. Currently building public-sector platforms used daily across 6+ cities.
          </motion.p>

          {/* Real Impact Stats */}
          <div className="grid grid-cols-3 gap-6 mb-10 w-full border-y border-zinc-800 py-6">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
              >
                <span className={`block text-3xl md:text-4xl font-extrabold ${s.accent ? 'text-emerald-500' : 'text-zinc-100'}`}>
                  {s.value}
                </span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Hero Interactive CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={onExploreProjects}
              className="bg-emerald-500 text-black font-bold px-8 py-4 rounded-2xl hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20 flex items-center gap-2 group cursor-pointer"
            >
              Explore Case Studies
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onOpenResume}
              className="bg-zinc-900 text-zinc-100 font-bold px-8 py-4 rounded-2xl hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] border border-zinc-800 flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              View Resume
            </button>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-full max-w-[380px] aspect-[4/5]"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 blur-2xl rounded-[3rem] animate-pulse" />

            <div className="w-full h-full bg-zinc-900 rounded-[2.5rem] border-2 border-zinc-800/80 overflow-hidden relative shadow-2xl group">
              {loading ? (
                <div className="w-full h-full bg-zinc-800 animate-pulse flex items-center justify-center">
                  <div className="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-zinc-600 animate-pulse" />
                  </div>
                </div>
              ) : (
                <img
                  src={settings.profile_image || '/profile.png'}
                  alt={settings.site_title || 'Wondwosen Endale'}
                  className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-100"
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
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-85" />

              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Stack Focus</h4>
                <div className="flex gap-2 mt-2">
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                    MERN
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                    NEXT.JS
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">
                    LARAVEL
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
