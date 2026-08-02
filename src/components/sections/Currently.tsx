import { AVAILABILITY_SHORT } from '../../lib/constants';

export function Currently() {
  return (
    <section aria-label="Currently" className="relative">
      <div className="relative p-6 md:p-8 bg-gradient-to-br from-zinc-900/60 via-zinc-900/30 to-transparent border border-zinc-800/80 rounded-3xl overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start">
          <div className="flex items-center gap-3 md:flex-col md:items-start">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-[0.2em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Now
            </span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] md:mt-1">
              August 2026
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2">
                Building
              </h4>
              <p className="text-sm text-zinc-100 font-semibold leading-snug">
                Public-sector platforms in production — payments, city services, and multi-tenant workflows.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2">
                Exploring
              </h4>
              <p className="text-sm text-zinc-100 font-semibold leading-snug">
                AI-augmented engineering workflows, edge runtimes, and Prisma + Postgres on serverless.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2">
                Open to
              </h4>
              <p className="text-sm text-zinc-100 font-semibold leading-snug">
                {AVAILABILITY_SHORT}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
