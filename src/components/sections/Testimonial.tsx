import { CONTACT_EMAIL } from '../../lib/constants';

interface TestimonialProps {
  contactEmail?: string;
}

const PROOF_POINTS = [
  {
    title: 'Production ownership',
    body: 'Shipped and maintained government-scale platforms under real load — not demos.',
  },
  {
    title: 'Measurable outcomes',
    body: 'Systems processing ETB 500M+, serving 4K+ users, and deployed across 6+ cities.',
  },
  {
    title: 'Delivery under constraints',
    body: 'Clean architecture, milestone ownership, and calm execution when timelines are tight.',
  },
];

/**
 * Social proof without an unverified named quote.
 * Named references stay available on request (email).
 */
export function Testimonial({ contactEmail }: TestimonialProps) {
  const email = contactEmail || CONTACT_EMAIL;
  return (
    <section aria-label="Proof and references" className="relative">
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-8 md:p-12">
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="relative grid grid-cols-1 items-start gap-10 md:grid-cols-[1fr_auto]">
          <div className="space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-500">
              Proof in production
            </span>
            <h2 className="font-display max-w-xl text-2xl font-bold tracking-tight text-zinc-100 md:text-3xl">
              Built for teams that need systems that ship — and stay up.
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {PROOF_POINTS.map((point) => (
                <div
                  key={point.title}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-4"
                >
                  <h3 className="mb-2 text-sm font-bold text-zinc-100">{point.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{point.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 md:items-end md:self-end">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              References on request
            </span>
            <a
              href={`mailto:${email}?subject=Reference%20request%20for%20Wondwosen%20Endale`}
              className="text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
            >
              Request contact details →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
