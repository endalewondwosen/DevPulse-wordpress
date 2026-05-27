import type { Experience as ExperienceType } from '../../types';

interface ExperienceProps {
  experience: ExperienceType[];
}

const TECH_KEYWORDS = [
  'React', 'Next.js', 'Laravel', 'Node.js', 'PHP', 'MongoDB', 'MySQL',
  'PostgreSQL', 'Docker', 'CI/CD', 'AWS', 'Express', 'Redux', 'TypeScript', 'Tailwind',
];

function detectTechs(exp: ExperienceType): string[] {
  const haystack = `${exp.description} ${exp.role} ${exp.company}`.toLowerCase();
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
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4 max-w-3xl whitespace-pre-line">
                    {exp.description}
                  </p>

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
