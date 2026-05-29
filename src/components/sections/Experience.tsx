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
      // Format: - Project Name | Impact (optional) | Description
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
  const structured = parseStructuredDescription(exp.description);
  const projectText = structured?.projects.map((p) => `${p.name} ${p.description} ${p.impact || ''}`).join(' ') || '';
  const achievementText = structured?.achievements.join(' ') || '';
  const summaryText = structured?.summary || '';
  const haystack = `${exp.description} ${summaryText} ${achievementText} ${projectText} ${exp.role} ${exp.company}`.toLowerCase();
  return Array.from(
    new Set(TECH_KEYWORDS.filter((t) => haystack.includes(t.toLowerCase())))
  );
}

export function Experience({ experience }: ExperienceProps) {
  return (
    <section id="experience" className="space-y-12">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Professional Journey</h2>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>
      <div className="space-y-8">
        {experience.length === 0 ? (
          <p className="text-zinc-500 italic">Experience history will appear here once added in admin.</p>
        ) : (
          experience.map((exp) => {
            const matchedTechs = detectTechs(exp);
            const structured = parseStructuredDescription(exp.description);
            return (
              <div key={exp.id} className="relative pl-10 pb-8 border-l-2 border-zinc-800/80 last:pb-0 group">
                {/* Pulsing timeline dot */}
                <div className="absolute left-[-6px] top-1.5 w-3 h-3 rounded-full bg-zinc-800 border-2 border-zinc-950 group-hover:bg-emerald-500 group-hover:border-emerald-500/30 transition-all duration-300 scale-100 group-hover:scale-125" />

                <div className="p-6 bg-zinc-900/30 border border-zinc-800/60 rounded-3xl hover:border-emerald-500/25 transition-all duration-300 hover:bg-zinc-900/50 shadow-sm hover:shadow-emerald-500/5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <h4 className="text-xl font-extrabold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                      {exp.role}
                    </h4>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-emerald-500 font-semibold text-sm mb-4">{exp.company}</p>
                  {structured ? (
                    <div className="space-y-4 mb-4 max-w-3xl">
                      {structured.summary && (
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          {structured.summary}
                        </p>
                      )}

                      {structured.achievements.length > 0 && (
                        <div>
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                            Key Achievements
                          </h5>
                          <ul className="space-y-1.5">
                            {structured.achievements.map((item) => (
                              <li key={item} className="text-sm text-zinc-400 leading-relaxed flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/80 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {structured.projects.length > 0 && (
                        <div>
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                            Selected Projects
                          </h5>
                          <div className="space-y-2">
                            {structured.projects.map((project) => (
                              <div key={`${project.name}-${project.description}`} className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/70">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="text-xs font-bold text-zinc-100">{project.name}</span>
                                  {project.impact && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                                      {project.impact}
                                    </span>
                                  )}
                                </div>
                                {project.description && (
                                  <p className="text-xs text-zinc-400 leading-relaxed">{project.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-zinc-400 text-sm leading-relaxed mb-4 max-w-3xl whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}

                  {matchedTechs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {matchedTechs.map((tech) => (
                        <span
                          key={tech}
                          className="text-[9px] font-bold px-2 py-0.5 bg-zinc-900 text-zinc-400 border border-zinc-800 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
