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
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-out Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-[200] w-full max-w-4xl bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Curriculum Vitae</h3>
                  <p className="text-xs text-zinc-500">Wondwosen Endale — Full Stack Developer</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={downloadUrl}
                  download
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </a>
                <button
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-900 border border-zinc-800 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Resume Content / PDF Viewer */}
            <div className="flex-1 bg-zinc-900 p-4 overflow-hidden relative">
              <iframe
                src={`${resumeUrl}#toolbar=0`}
                className="w-full h-full rounded-2xl border border-zinc-800 bg-white"
                title="Wondwosen Endale Resume"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
