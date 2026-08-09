import { motion, useReducedMotion } from 'motion/react';
import { Cpu, Layout, Sparkles, Terminal } from 'lucide-react';
import { revealViewport } from '../../lib/motion';
import type { Skill } from '../../types';

interface SkillsProps {
  skills: Skill[];
}

const CATEGORIES = [
  {
    id: 'frontend',
    title: 'Frontend Engineering',
    icon: <Layout className="h-6 w-6 text-emerald-500" />,
    iconBg: 'bg-emerald-500/10',
    proof:
      'React + Next.js + TypeScript across 4+ production apps. Multi-language UI (EN / Amharic / Afaan Oromo), real-time chat (Pusher), QR-verified workflows.',
    fallback: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Bootstrap'],
  },
  {
    id: 'backend',
    title: 'Backend & Systems',
    icon: <Cpu className="h-6 w-6 text-blue-500" />,
    iconBg: 'bg-blue-500/10',
    proof:
      'Laravel + Node.js APIs serving 4K+ users and 12 subcities. RBAC, RESTful integrations (Fayda National ID, TeleBirr payments), automated late-fee logic.',
    fallback: ['Node.js', 'Express.js', 'Nest.js', 'Laravel', 'REST APIs'],
  },
  {
    id: 'devops',
    title: 'Databases & DevOps',
    icon: <Terminal className="h-6 w-6 text-teal-400" />,
    iconBg: 'bg-teal-500/10',
    proof:
      'PostgreSQL, MySQL, MongoDB in production with Prisma ORM. Docker-based deploys, Git workflows, Jest test suites, and Vite build pipelines.',
    fallback: ['PostgreSQL', 'MySQL', 'MongoDB', 'Prisma ORM', 'Docker', 'Jest', 'Vite'],
  },
  {
    id: 'additional',
    title: 'State & Practice',
    icon: <Sparkles className="h-6 w-6 text-amber-500" />,
    iconBg: 'bg-amber-500/10',
    proof:
      'Redux Toolkit / Zustand / React Context for predictable state. AI-augmented workflow (Copilot + LLMs) for faster prototyping while keeping human-reviewed architecture.',
    fallback: ['Redux Toolkit', 'Zustand', 'React Context', 'AI-augmented workflow'],
  },
];

export function Skills({ skills }: SkillsProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="skills" className="space-y-8">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={revealViewport}
        transition={{ duration: 0.4 }}
        className="flex items-end justify-between gap-4"
      >
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-emerald-500 uppercase">
            Tech Stack
          </span>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Tools I reach for, with proof.
          </h2>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat, index) => {
          const dbSkills = skills.filter((s) => s.category === cat.id);
          const chips = dbSkills.length > 0 ? dbSkills.map((s) => s.name) : cat.fallback;
          return (
            <motion.div
              key={cat.id}
              initial={reduceMotion ? false : { opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={revealViewport}
              transition={{
                duration: 0.55,
                delay: index * 0.14,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col gap-5 rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-7 transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-900/70"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${cat.iconBg}`}>
                {cat.icon}
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-zinc-100">{cat.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{cat.proof}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 border-t border-zinc-800/60 pt-4">
                {chips.map((name) => (
                  <span
                    key={name}
                    className="rounded-md border border-zinc-700/60 bg-zinc-800/80 px-2 py-1 text-[10px] font-bold text-zinc-400"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
