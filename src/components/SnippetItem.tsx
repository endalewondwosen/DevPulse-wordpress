import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Terminal, ChevronRight } from 'lucide-react';
import { Post } from '../types';

function previewLines(code?: string): string {
  if (!code?.trim()) return '// Open to inspect implementation';
  return code
    .split('\n')
    .map((l) => l.trimEnd())
    .filter((l) => l.length > 0)
    .slice(0, 2)
    .join('\n');
}

export const SnippetItem: React.FC<{
  snippet: Post;
  onClick: () => void | Promise<void>;
  index?: number;
}> = ({ snippet, onClick, index = 0 }) => {
  const reduceMotion = useReducedMotion();
  const preview = previewLines(snippet.meta.code);

  return (
    <motion.div
      layoutId={`snippet-${snippet.id}`}
      initial={reduceMotion ? false : { opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
      whileHover={reduceMotion ? undefined : { x: 4 }}
      onClick={onClick}
      className="surface-shimmer group relative flex cursor-pointer items-stretch gap-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-emerald-500/35"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-800 transition-colors group-hover:bg-emerald-500/10">
        <Terminal className="h-5 w-5 text-zinc-400 group-hover:text-emerald-500" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <h4 className="font-bold transition-colors group-hover:text-emerald-400">{snippet.title}</h4>
          <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
            {snippet.meta.language || 'text'}
          </span>
        </div>
        <p className="mb-2 line-clamp-1 text-xs text-zinc-500">{snippet.content}</p>
        <pre className="overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-950/80 px-3 py-2 font-mono text-[11px] leading-relaxed text-emerald-500/70">
          <code className="line-clamp-2 whitespace-pre-wrap">{preview}</code>
        </pre>
      </div>

      <ChevronRight className="mt-1 h-5 w-5 shrink-0 self-center text-zinc-700 transition-colors group-hover:text-emerald-500" />
    </motion.div>
  );
};
