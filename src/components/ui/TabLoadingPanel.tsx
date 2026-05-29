import { motion } from 'motion/react';
import { Activity } from 'lucide-react';
import type { ReactNode } from 'react';

interface TabLoadingPanelProps {
  title: string;
  loadingMessage: string;
  showSlowConnectionWarning: boolean;
  skeleton: ReactNode;
}

export function TabLoadingPanel({
  title,
  loadingMessage,
  showSlowConnectionWarning,
  skeleton,
}: TabLoadingPanelProps) {
  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col items-center justify-center text-center py-12 md:py-16 min-h-[240px]">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-6">
          <Activity className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>

        <h3 className="text-xl font-semibold text-zinc-100 mb-2">{title}</h3>

        <p className="text-zinc-400 mb-6 max-w-md mx-auto">{loadingMessage}</p>

        {showSlowConnectionWarning && (
          <div className="max-w-md mx-auto p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-center gap-3 text-amber-400">
              <Activity className="w-5 h-5 animate-pulse" />
              <div className="text-left">
                <p className="font-medium text-sm">First load takes a moment</p>
                <p className="text-xs opacity-80">
                  Spinning up resources. Thanks for your patience — it&apos;ll be snappy after this.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-emerald-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto">{skeleton}</div>
    </div>
  );
}
