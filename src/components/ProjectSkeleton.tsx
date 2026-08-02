import { motion } from 'motion/react';

export const ProjectSkeleton = () => (
  <div className="h-[400px] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50">
    <div className="skeleton-shimmer h-48" />
    <div className="space-y-4 p-6">
      <div className="skeleton-shimmer h-6 w-3/4 rounded-lg" />
      <div className="skeleton-shimmer h-4 w-full rounded-lg" />
      <div className="skeleton-shimmer h-4 w-2/3 rounded-lg" />
      <div className="flex gap-2 pt-4">
        <div className="skeleton-shimmer h-6 w-16 rounded-full" />
        <div className="skeleton-shimmer h-6 w-16 rounded-full" />
      </div>
    </div>
  </div>
);

export const SnippetSkeleton = () => (
  <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
    <div className="skeleton-shimmer h-10 w-10 rounded-xl" />
    <div className="flex-1 space-y-2">
      <div className="skeleton-shimmer h-4 w-1/3 rounded-lg" />
      <div className="skeleton-shimmer h-3 w-1/4 rounded-lg" />
      <div className="skeleton-shimmer h-10 w-full rounded-lg" />
    </div>
  </div>
);

export const GenericSkeleton = ({
  width = 'w-full',
  height = 'h-4',
}: {
  width?: string;
  height?: string;
}) => <div className={`skeleton-shimmer ${width} ${height} rounded-lg`} />;

export const WakingUpLoader = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-emerald-500 px-6 py-3 font-bold text-black shadow-2xl"
  >
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
    <span className="text-sm">Waking up secure database... Just a second</span>
  </motion.div>
);
