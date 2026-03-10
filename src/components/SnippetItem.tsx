import React from 'react';
import { motion } from 'motion/react';
import { Terminal, ChevronRight } from 'lucide-react';
import { Post } from '../types';

export const SnippetItem: React.FC<{ snippet: Post, onClick: () => void | Promise<void> }> = ({ snippet, onClick }) => {
  return (
    <motion.div 
      layoutId={`snippet-${snippet.id}`}
      whileHover={{ x: 5 }}
      onClick={onClick}
      className="group flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-emerald-500/30 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
          <Terminal className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500" />
        </div>
        <div>
          <h4 className="font-bold group-hover:text-emerald-400 transition-colors">{snippet.title}</h4>
          <span className="text-xs text-zinc-500 uppercase tracking-widest">{snippet.meta.language || 'text'}</span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-emerald-500 transition-colors" />
    </motion.div>
  );
}
