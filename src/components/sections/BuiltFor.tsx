const ORGS = [
  'Shaggar City Administration',
  'Oromia Regional Government',
  'One Stop Service Centers',
  'Soft Valley',
];

export function BuiltFor() {
  return (
    <section aria-label="Built for" className="border-y border-zinc-800/80 py-5 md:py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.25em]">
          Built for
        </span>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {ORGS.map((org) => (
            <span
              key={org}
              className="text-sm font-semibold text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {org}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
