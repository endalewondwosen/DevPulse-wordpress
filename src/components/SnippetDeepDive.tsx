import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Terminal, Copy, Check } from 'lucide-react';
import { Post } from '../types';

interface SnippetDeepDiveProps {
  snippet: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SnippetDeepDive: React.FC<SnippetDeepDiveProps> = ({ snippet, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!snippet) return null;

  const handleCopy = () => {
    if (snippet.meta.code) {
      navigator.clipboard.writeText(snippet.meta.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900 sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                  <Terminal className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-100">
                    {snippet.title}
                  </h2>
                  <span className="inline-flex mt-2 px-2.5 py-1 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-full uppercase tracking-[0.14em] font-bold">
                    {snippet.meta.language || 'text'}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                aria-label="Close snippet"
                className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Description</h3>
                <p className="text-zinc-100 leading-relaxed">
                  {snippet.content}
                </p>
              </div>
              {/* Code Block */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Implementation</h3>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500 rounded-xl border border-emerald-500/30 transition-all text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-black"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
                
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative p-6 bg-zinc-950 rounded-2xl border border-zinc-800 font-mono text-sm leading-relaxed overflow-x-auto">
                    <pre className="text-emerald-400/90 whitespace-pre">
                      <code>{snippet.meta.code || '// No code provided'}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
              <div className="text-xs text-zinc-500 font-medium">
                Part of the Code Lab collection
              </div>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all border border-emerald-500/50"
              >
                Close Snippet
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
