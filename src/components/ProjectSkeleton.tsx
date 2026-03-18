import React from 'react';
import { motion } from 'framer-motion';

export const ProjectSkeleton = () => (
  <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden h-[400px]">
    <div className="h-48 bg-zinc-800/50 animate-pulse" />
    <div className="p-6 space-y-4">
      <div className="h-6 w-3/4 bg-zinc-800/50 rounded-lg animate-pulse" />
      <div className="h-4 w-full bg-zinc-800/50 rounded-lg animate-pulse" />
      <div className="h-4 w-2/3 bg-zinc-800/50 rounded-lg animate-pulse" />
      <div className="pt-4 flex gap-2">
        <div className="h-6 w-16 bg-zinc-800/50 rounded-full animate-pulse" />
        <div className="h-6 w-16 bg-zinc-800/50 rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

export const SnippetSkeleton = () => (
  <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center gap-4">
    <div className="w-10 h-10 bg-zinc-800/50 rounded-xl animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-1/3 bg-zinc-800/50 rounded-lg animate-pulse" />
      <div className="h-3 w-1/4 bg-zinc-800/50 rounded-lg animate-pulse" />
    </div>
    <div className="w-20 h-6 bg-zinc-800/50 rounded-full animate-pulse" />
  </div>
);

export const GenericSkeleton = ({ width = 'w-full', height = 'h-4' }: { width?: string, height?: string }) => (
  <div className={`${width} ${height} bg-zinc-800/50 rounded-lg animate-pulse`} />
);

export const WakingUpLoader = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-emerald-500 text-black font-bold rounded-full shadow-2xl flex items-center gap-3"
  >
    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
    <span className="text-sm">Waking up secure database... Just a second</span>
  </motion.div>
);
