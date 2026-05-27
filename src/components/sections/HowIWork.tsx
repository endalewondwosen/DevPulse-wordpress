import { Activity, Code2, Layers, Send } from 'lucide-react';

const STAGES = [
  {
    step: '01',
    icon: <Layers className="w-5 h-5 text-emerald-500" />,
    title: 'Discover & Architect',
    desc: 'Map the real problem, constraints, and success metric. Sketch the smallest system that solves it cleanly — schemas, boundaries, and trade-offs first.',
  },
  {
    step: '02',
    icon: <Code2 className="w-5 h-5 text-blue-500" />,
    title: 'Build in thin slices',
    desc: 'Ship end-to-end vertical slices behind feature flags. Typed APIs, testable components, and clear data contracts at every layer.',
  },
  {
    step: '03',
    icon: <Send className="w-5 h-5 text-purple-500" />,
    title: 'Ship to production',
    desc: 'Continuous delivery with Docker, structured logs, and graceful error boundaries. Real users on real data within days, not quarters.',
  },
  {
    step: '04',
    icon: <Activity className="w-5 h-5 text-amber-500" />,
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
  return (
    <section aria-label="How I work" className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.25em]">
            Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
            How I work.
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {STAGES.map((stage) => (
          <div
            key={stage.step}
            className="p-6 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl flex flex-col gap-4 transition-all duration-300 hover:bg-zinc-900/70 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center">
                {stage.icon}
              </div>
              <span className="text-[10px] font-bold text-zinc-600 tracking-[0.2em]">
                {stage.step}
              </span>
            </div>
            <h3 className="text-base font-bold text-zinc-100">{stage.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{stage.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        {PRINCIPLES.map((p) => (
          <div key={p.title} className="p-5 bg-zinc-900/30 border border-zinc-800/60 rounded-2xl">
            <h4 className="text-sm font-bold text-zinc-100 mb-1.5">{p.title}</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
