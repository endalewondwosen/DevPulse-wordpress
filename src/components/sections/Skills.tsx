import { Cpu, Layout, Sparkles, Terminal } from 'lucide-react';
import type { Skill } from '../../types';

interface SkillsProps {
  skills: Skill[];
}

const CATEGORIES = [
  {
    id: 'frontend',
    title: 'Frontend Engineering',
    icon: <Layout className="w-6 h-6 text-emerald-500" />,
    iconBg: 'bg-emerald-500/10',
    proof:
      'React + Next.js + TypeScript across 4+ production apps. Multi-language UI (EN / Amharic / Afaan Oromo), real-time chat (Pusher), QR-verified workflows.',
    fallback: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Bootstrap'],
  },
  {
    id: 'backend',
    title: 'Backend & Systems',
    icon: <Cpu className="w-6 h-6 text-blue-500" />,
    iconBg: 'bg-blue-500/10',
    proof:
      'Laravel + Node.js APIs serving 4K+ users and 12 subcities. RBAC, RESTful integrations (Fayda National ID, TeleBirr payments), automated late-fee logic.',
    fallback: ['Node.js', 'Express.js', 'Nest.js', 'Laravel', 'REST APIs'],
  },
  {
    id: 'devops',
    title: 'Databases & DevOps',
    icon: <Terminal className="w-6 h-6 text-purple-500" />,
    iconBg: 'bg-purple-500/10',
    proof:
      'PostgreSQL, MySQL, MongoDB in production with Prisma ORM. Docker-based deploys, Git workflows, Jest test suites, and Vite build pipelines.',
    fallback: ['PostgreSQL', 'MySQL', 'MongoDB', 'Prisma ORM', 'Docker', 'Jest', 'Vite'],
  },
  {
    id: 'additional',
    title: 'State & Practice',
    icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    iconBg: 'bg-amber-500/10',
    proof:
      'Redux Toolkit / Zustand / React Context for predictable state. AI-augmented workflow (Copilot + LLMs) for faster prototyping while keeping human-reviewed architecture.',
    fallback: ['Redux Toolkit', 'Zustand', 'React Context', 'AI-augmented workflow'],
  },
];

export function Skills({ skills }: SkillsProps) {
  return (
    <section id="skills" className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.25em]">
            Tech Stack
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
            Tools I reach for, with proof.
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => {
          const dbSkills = skills.filter((s) => s.category === cat.id);
          const chips = dbSkills.length > 0 ? dbSkills.map((s) => s.name) : cat.fallback;
          return (
            <div
              key={cat.id}
              className="p-7 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl flex flex-col gap-5 transition-all duration-300 hover:bg-zinc-900/70 hover:-translate-y-0.5"
            >
              <div className={`w-12 h-12 ${cat.iconBg} rounded-2xl flex items-center justify-center`}>
                {cat.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">{cat.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{cat.proof}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-800/60">
                {chips.map((name) => (
                  <span
                    key={name}
                    className="text-[10px] font-bold px-2 py-1 bg-zinc-800/80 rounded-md text-zinc-400 border border-zinc-700/60"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
