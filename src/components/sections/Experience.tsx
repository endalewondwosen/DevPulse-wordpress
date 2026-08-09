import { motion, useReducedMotion } from 'motion/react';
import { revealViewport } from '../../lib/motion';
import type { Experience as ExperienceType } from '../../types';

interface ExperienceProps {
  experience: ExperienceType[];
}

const TECH_KEYWORDS = [
  'React', 'Next.js', 'Laravel', 'Node.js', 'PHP', 'MongoDB', 'MySQL',
  'PostgreSQL', 'Docker', 'CI/CD', 'AWS', 'Express', 'Redux', 'TypeScript', 'Tailwind',
];

interface StructuredProject {
  name: string;
  impact?: string;
  description: string;
}

interface StructuredExperienceContent {
  summary?: string;
  achievements: string[];
  projects: StructuredProject[];
}

function parseStructuredDescription(description: string): StructuredExperienceContent | null {
  const lines = description
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  let summary = '';
  let section: 'summary' | 'achievements' | 'projects' = 'summary';
  const achievements: string[] = [];
  const projects: StructuredProject[] = [];

  for (const line of lines) {
    const normalized = line.toLowerCase();
    if (normalized === 'summary:' || normalized === 'overview:') {
      section = 'summary';
      continue;
    }
    if (normalized === 'achievements:' || normalized === 'highlights:') {
      section = 'achievements';
      continue;
    }
    if (normalized === 'projects:' || normalized === 'selected projects:') {
      section = 'projects';
      continue;
    }

    if (section === 'summary') {
      summary = summary ? `${summary} ${line}` : line;
      continue;
    }

    if (section === 'achievements' && line.startsWith('-')) {
      achievements.push(line.replace(/^-+\s*/, '').trim());
      continue;
    }

    if (section === 'projects' && line.startsWith('-')) {
      const parts = line.replace(/^-+\s*/, '').split('|').map((p) => p.trim()).filter(Boolean);
      if (parts.length === 1) {
        projects.push({ name: parts[0], description: '' });
      } else if (parts.length === 2) {
        projects.push({ name: parts[0], description: parts[1] });
      } else {
        const [name, impact, ...rest] = parts;
        projects.push({ name, impact, description: rest.join(' | ') });
      }
    }
  }

  if (!summary && achievements.length === 0 && projects.length === 0) return null;
  return { summary: summary || undefined, achievements, projects };
}

function detectTechs(exp: ExperienceType): string[] {
  const haystack = `${exp.role} ${exp.company} ${exp.description}`.toLowerCase();
  return TECH_KEYWORDS.filter((tech) => haystack.includes(tech.toLowerCase()));
}

export function Experience({ experience }: ExperienceProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="experience" className="space-y-12">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={revealViewport}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-4"
      >
        <h2 className="font-display text-3xl font-bold tracking-tight">Professional Journey</h2>
        <div className="h-px flex-1 bg-zinc-800" />
      </motion.div>

      <div className="space-y-8">
        {experience.length === 0 ? (
          <p className="italic text-zinc-500">Experience history will appear here once added in admin.</p>
        ) : (
          experience.map((exp, cardIndex) => {
            const matchedTechs = detectTechs(exp);
            const structured = parseStructuredDescription(exp.description);
            return (
              <motion.div
                key={exp.id}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={revealViewport}
                transition={{ duration: 0.45, delay: Math.min(cardIndex, 4) * 0.06 }}
                className="group relative border-l-2 border-zinc-800/80 pb-8 pl-10 last:pb-0"
              >
                <div className="absolute top-1.5 left-[-6px] h-3 w-3 scale-100 rounded-full border-2 border-zinc-950 bg-zinc-800 transition-all duration-300 group-hover:scale-125 group-hover:border-emerald-500/30 group-hover:bg-emerald-500" />

                <div className="rounded-3xl border border-zinc-800/60 bg-zinc-900/30 p-6 shadow-sm transition-all duration-300 hover:border-emerald-500/25 hover:bg-zinc-900/50 hover:shadow-emerald-500/5">
                  <div className="mb-2 flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <h4 className="text-xl font-extrabold text-zinc-100 transition-colors group-hover:text-emerald-400">
                      {exp.role}
                    </h4>
                    <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                      {exp.period}
                    </span>
                  </div>
                  <p className="mb-4 text-sm font-semibold text-emerald-500">{exp.company}</p>

                  {structured ? (
                    <div className="mb-4 max-w-3xl space-y-4">
                      {structured.summary && (
                        <motion.p
                          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={revealViewport}
                          transition={{ duration: 0.35, delay: 0.05 }}
                          className="text-sm leading-relaxed text-zinc-400"
                        >
                          {structured.summary}
                        </motion.p>
                      )}

                      {structured.achievements.length > 0 && (
                        <div>
                          <h5 className="mb-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                            Key Achievements
                          </h5>
                          <ul className="space-y-1.5">
                            {structured.achievements.map((item, i) => (
                              <motion.li
                                key={item}
                                initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={revealViewport}
                                transition={{ duration: 0.3, delay: 0.08 + i * 0.05 }}
                                className="flex items-start gap-2 text-sm leading-relaxed text-zinc-400"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/80" />
                                <span>{item}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {structured.projects.length > 0 && (
                        <div>
                          <h5 className="mb-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                            Selected Projects
                          </h5>
                          <div className="space-y-2">
                            {structured.projects.map((project, i) => (
                              <motion.div
                                key={`${project.name}-${project.description}`}
                                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={revealViewport}
                                transition={{ duration: 0.35, delay: 0.1 + i * 0.06 }}
                                className="rounded-xl border border-zinc-800/70 bg-zinc-900/50 p-3"
                              >
                                <div className="mb-1 flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-bold text-zinc-100">{project.name}</span>
                                  {project.impact && (
                                    <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-emerald-400 uppercase">
                                      {project.impact}
                                    </span>
                                  )}
                                </div>
                                {project.description && (
                                  <p className="text-xs leading-relaxed text-zinc-400">
                                    {project.description}
                                  </p>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="mb-4 max-w-3xl text-sm leading-relaxed whitespace-pre-line text-zinc-400">
                      {exp.description}
                    </p>
                  )}

                  {matchedTechs.length > 0 && (
                    <motion.div
                      initial={reduceMotion ? false : { opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={revealViewport}
                      transition={{ duration: 0.35, delay: 0.15 }}
                      className="flex flex-wrap gap-1.5 pt-2"
                    >
                      {matchedTechs.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[9px] font-bold text-zinc-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
}
