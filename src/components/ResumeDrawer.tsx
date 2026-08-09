import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, FileText } from 'lucide-react';

interface ResumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl: string;
  downloadUrl: string;
}

export function ResumeDrawer({ isOpen, onClose, resumeUrl, downloadUrl }: ResumeDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-[200] flex w-full max-w-4xl flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl"
          >
            <div className="flex flex-col gap-3 border-b border-zinc-800 bg-zinc-900/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                  <FileText className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-zinc-100 sm:text-lg">Curriculum Vitae</h3>
                  <p className="truncate text-xs text-zinc-500">
                    Wondwosen Endale — Full Stack Developer
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href={downloadUrl}
                  download
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-2.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/10 transition-all hover:bg-emerald-400 sm:flex-none sm:px-4"
                >
                  <Download className="h-4 w-4" />
                  <span className="sm:hidden">PDF</span>
                  <span className="hidden sm:inline">Download PDF</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition-colors hover:text-zinc-100"
                  aria-label="Close resume"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden bg-zinc-900 p-3 sm:p-4">
              <iframe
                src={`${resumeUrl}#toolbar=0`}
                className="h-full w-full rounded-2xl border border-zinc-800 bg-white"
                title="Wondwosen Endale Resume"
              />
              <p className="mt-2 text-center text-[10px] text-zinc-500 sm:hidden">
                If the preview looks blank, use Download PDF.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
