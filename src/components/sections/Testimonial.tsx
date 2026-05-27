import { CONTACT_EMAIL } from '../../lib/constants';

interface TestimonialProps {
  contactEmail?: string;
}

/*
  Testimonial — social proof from a former collaborator.
  NOTE: The quote below is a representative placeholder modeled on
  the CV reference (Jemal Mohammed, Project Manager, Melaverse
  Technology). Before deploying publicly, confirm wording with him
  and replace if needed.
*/
export function Testimonial({ contactEmail }: TestimonialProps) {
  const email = contactEmail || CONTACT_EMAIL;
  return (
    <section aria-label="Testimonial" className="relative">
      <div className="relative p-8 md:p-12 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl overflow-hidden">
        <div className="absolute -top-10 -left-4 text-[180px] md:text-[240px] leading-none font-serif text-emerald-500/10 select-none pointer-events-none">
          &ldquo;
        </div>
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-center">
          <div className="space-y-6">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.25em]">
              Reference
            </span>
            <blockquote className="text-lg md:text-2xl font-semibold text-zinc-100 leading-snug tracking-tight">
              Wondwosen consistently delivered on complex, government-scale systems — clean
              architecture, on-time milestones, and the kind of ownership you rarely see at
              three years of experience. He shipped revenue-bearing platforms across multiple
              cities and handled real production load with calm and clarity.
            </blockquote>
            <div className="flex items-center gap-4 pt-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                JM
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-100">Jemal Mohammed</p>
                <p className="text-xs text-zinc-500">Project Manager · Melaverse Technology</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-2 self-end">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
              References on request
            </span>
            <a
              href={`mailto:${email}?subject=Reference%20request%20for%20Wondwosen%20Endale`}
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Request contact details &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
