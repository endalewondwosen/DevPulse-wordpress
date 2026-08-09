import { motion, useReducedMotion } from 'motion/react';
import { Activity, Code2, Layers, Send } from 'lucide-react';
import { revealViewport } from '../../lib/motion';

const STAGES = [
  {
    step: '01',
    icon: <Layers className="h-5 w-5 text-emerald-500" />,
    title: 'Discover & Architect',
    desc: 'Map the real problem, constraints, and success metric. Sketch the smallest system that solves it cleanly — schemas, boundaries, and trade-offs first.',
  },
  {
    step: '02',
    icon: <Code2 className="h-5 w-5 text-blue-500" />,
    title: 'Build in thin slices',
    desc: 'Ship end-to-end vertical slices behind feature flags. Typed APIs, testable components, and clear data contracts at every layer.',
  },
  {
    step: '03',
    icon: <Send className="h-5 w-5 text-teal-400" />,
    title: 'Ship to production',
    desc: 'Continuous delivery with Docker, structured logs, and graceful error boundaries. Real users on real data within days, not quarters.',
  },
  {
    step: '04',
    icon: <Activity className="h-5 w-5 text-amber-500" />,
    title: 'Operate & improve',
    desc: 'Measure what matters, instrument the slow paths, and harden the rough edges. Refactor with confidence backed by tests and metrics.',
  },
];

const PRINCIPLES = [
  {
    title: 'AI-augmented, human-reviewed',
    desc: 'Copilot and LLMs accelerate prototyping and boilerplate. Architecture, security, and reviews stay deliberate and human.',
  },
  {
    title: 'Clear, async-friendly communication',
    desc: 'Concise written updates, structured PRs, and decision records. I work well across time zones and remote teams.',
  },
  {
    title: 'Outcome-first, not output-first',
    desc: 'I optimize for the metric that moves the business — revenue, adoption, latency — not lines of code shipped.',
  },
];

export function HowIWork() {
  const reduceMotion = useReducedMotion();

  return (
    <section aria-label="How I work" className="space-y-8">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={revealViewport}
        transition={{ duration: 0.4 }}
        className="flex items-end justify-between gap-4"
      >
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-emerald-500 uppercase">
            Process
          </span>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            How I work.
          </h2>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((stage, index) => (
          <motion.div
            key={stage.step}
            initial={reduceMotion ? false : { opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={revealViewport}
            transition={{
              duration: 0.55,
              delay: index * 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col gap-4 rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-900/70"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                {stage.icon}
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-600">
                {stage.step}
              </span>
            </div>
            <h3 className="text-base font-bold text-zinc-100">{stage.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-400">{stage.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 pt-2 md:grid-cols-3">
        {PRINCIPLES.map((p, index) => (
          <motion.div
            key={p.title}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={{
              duration: 0.5,
              delay: 0.15 + index * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-5"
          >
            <h4 className="mb-1.5 text-sm font-bold text-zinc-100">{p.title}</h4>
            <p className="text-xs leading-relaxed text-zinc-500">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
