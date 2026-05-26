import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Download, 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  CheckCircle2, 
  Calendar,
  Layers,
  MapPin,
  Clock
} from 'lucide-react';

interface RecruiterConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResume: () => void;
  downloadUrl: string;
  contactEmail: string;
}

export function RecruiterConsole({ isOpen, onClose, onOpenResume, downloadUrl, contactEmail }: RecruiterConsoleProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md"
          />

          {/* Interactive Recruiter Center Modal */}
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="pointer-events-auto bg-zinc-950/95 border border-zinc-800 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header Banner */}
              <div className="relative p-8 border-b border-zinc-800 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 flex justify-between items-start">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> Recruiter Cheat Sheet
                  </div>
                  <h3 className="text-2xl font-extrabold text-zinc-100 mt-2">Wondwosen Endale</h3>
                  <p className="text-zinc-400 text-sm font-medium">Full Stack Engineer &amp; Systems Architect</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-900 border border-zinc-800 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Console Body */}
              <div className="p-8 overflow-y-auto space-y-8">
                {/* At-a-glance Info Pill Bar */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center gap-3">
                    <Clock className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-zinc-500 font-bold uppercase">Notice Period</span>
                      <span className="text-xs font-bold text-zinc-100">Immediate</span>
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-zinc-500 font-bold uppercase">Location/Work</span>
                      <span className="text-xs font-bold text-zinc-100">Remote / Hybrid</span>
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center gap-3">
                    <Layers className="w-5 h-5 text-purple-500 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-zinc-500 font-bold uppercase">Focus Stack</span>
                      <span className="text-xs font-bold text-zinc-100">MERN / Next / Laravel</span>
                    </div>
                  </div>
                </div>

                {/* Core Strengths */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Why hire me?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      '3+ Years designing robust APIs & UI experiences',
                      'Skilled at scaling PostgreSQL, MySQL, and MongoDB',
                      'DevOps & cloud proficient (Docker, AWS, CI/CD)',
                      'Engineered systems handling high concurrent loads',
                      'Proactive problem-solver with clean, testable code',
                      'Experienced with Laravel system optimization'
                    ].map((strength, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-zinc-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick FAQs */}
                <div className="space-y-4 border-t border-zinc-800 pt-6">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Recruiter FAQs</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-bold text-zinc-100">Q: What is your primary architectural expertise?</h5>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        A: Bridging scalable React/NextJS frontends with secure NodeJS/Laravel backends. I design systems with optimized query paths, database indexes, state management (Redux), and CI/CD pipelines.
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-zinc-100">Q: Are you open to technical interviews and coding tasks?</h5>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        A: Yes! I write highly structured, clean, and testable code. I welcome live coding sessions, system design assessments, and architectural challenges.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Express Contact & Actions Section */}
                <div className="pt-6 border-t border-zinc-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">One-Click Actions</h4>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenResume();
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 font-bold text-sm py-3 rounded-2xl transition-all cursor-pointer"
                      >
                        <Layers className="w-4 h-4 text-emerald-500" /> Interactive CV Preview
                      </button>
                      <a
                        href={downloadUrl}
                        download
                        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm py-3 rounded-2xl transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
                      >
                        <Download className="w-4 h-4" /> Download ATS-friendly Resume
                      </a>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Direct Contact</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`mailto:${contactEmail}`}
                        className="flex flex-col items-center justify-center p-3 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl text-zinc-400 hover:text-emerald-400 transition-all text-center cursor-pointer"
                      >
                        <Mail className="w-5 h-5 mb-1.5" />
                        <span className="text-[10px] font-bold">Email Direct</span>
                      </a>
                      <a
                        href="tel:+251955143592"
                        className="flex flex-col items-center justify-center p-3 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl text-zinc-400 hover:text-emerald-400 transition-all text-center cursor-pointer"
                      >
                        <Phone className="w-5 h-5 mb-1.5" />
                        <span className="text-[10px] font-bold">Call Phone</span>
                      </a>
                      <a
                        href="https://www.linkedin.com/in/wondwosen-endale-498a86280"
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center p-3 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl text-zinc-400 hover:text-emerald-400 transition-all text-center cursor-pointer"
                      >
                        <Linkedin className="w-5 h-5 mb-1.5" />
                        <span className="text-[10px] font-bold">LinkedIn</span>
                      </a>
                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center p-3 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl text-zinc-400 hover:text-emerald-400 transition-all text-center cursor-pointer"
                      >
                        <Github className="w-5 h-5 mb-1.5" />
                        <span className="text-[10px] font-bold">GitHub</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
