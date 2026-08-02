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
  Layers,
  MapPin,
  Clock,
  FileText,
} from 'lucide-react';
import {
  AVAILABILITY_LINE,
  CONTACT_EMAIL,
  EXPERIENCE_YEARS,
  GITHUB_URL,
  LINKEDIN_URL,
  PHONE_NUMBER,
  ROLE_TITLE,
} from '../lib/constants';
import { openMailto } from '../lib/mail';

interface RecruiterConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResume: () => void;
  downloadUrl: string;
  contactEmail: string;
  onNotify?: (message: string, type?: 'success' | 'error') => void;
}

const STRENGTHS = [
  (years: string) => `${years} designing robust APIs & UI experiences`,
  () => 'Skilled at scaling PostgreSQL, MySQL, and MongoDB',
  () => 'DevOps & cloud proficient (Docker, AWS, CI/CD)',
  () => 'Engineered systems handling high concurrent loads',
  () => 'Proactive problem-solver with clean, testable code',
  () => 'Experienced with Laravel system optimization',
];

export function RecruiterConsole({
  isOpen,
  onClose,
  onOpenResume,
  downloadUrl,
  contactEmail,
  onNotify,
}: RecruiterConsoleProps) {
  const email = (contactEmail || CONTACT_EMAIL).trim() || CONTACT_EMAIL;

  const handleEmailToHire = async () => {
    try {
      const { copied } = await openMailto(email, {
        subject: 'Hiring inquiry — Full Stack Engineer role',
        body: 'Hi Wondwosen,\n\nI found your portfolio and would like to discuss a full-stack opportunity.\n\n',
      });
      onNotify?.(
        copied
          ? `Opening email… Address also copied: ${email}`
          : `Opening email app for ${email}`,
        'success'
      );
    } catch {
      onNotify?.('Could not open email. Please use the contact section.', 'error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md"
          />

          <div className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="pointer-events-auto flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] border border-zinc-800 bg-zinc-950/95 shadow-2xl"
            >
              <div className="relative flex items-start justify-between border-b border-zinc-800 bg-gradient-to-r from-emerald-500/10 to-teal-500/5 p-8">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                    <Sparkles className="h-3 w-3" /> Recruiter Quick-View
                  </div>
                  <h3 className="font-display text-2xl font-extrabold text-zinc-100">
                    Wondwosen Endale
                  </h3>
                  <p className="text-sm font-medium text-zinc-400">{ROLE_TITLE}</p>
                  <p className="text-[11px] font-semibold tracking-wide text-emerald-400/90">
                    {AVAILABILITY_LINE}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition-all hover:text-zinc-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-8 overflow-y-auto p-8">
                {/* Primary conversion strip */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleEmailToHire}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-extrabold text-black transition-colors hover:bg-emerald-400"
                  >
                    <Mail className="h-4 w-4" />
                    Email to hire
                  </button>
                  <a
                    href={downloadUrl}
                    download
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 text-sm font-bold text-emerald-400 transition-colors hover:bg-emerald-500/20"
                  >
                    <Download className="h-4 w-4" />
                    Download resume
                  </a>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <Clock className="h-5 w-5 shrink-0 text-emerald-500" />
                    <div>
                      <span className="block text-[10px] font-bold text-zinc-500 uppercase">
                        Notice Period
                      </span>
                      <span className="text-xs font-bold text-zinc-100">Immediate</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <MapPin className="h-5 w-5 shrink-0 text-blue-500" />
                    <div>
                      <span className="block text-[10px] font-bold text-zinc-500 uppercase">
                        Location/Work
                      </span>
                      <span className="text-xs font-bold text-zinc-100">Remote / Hybrid</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <Layers className="h-5 w-5 shrink-0 text-teal-400" />
                    <div>
                      <span className="block text-[10px] font-bold text-zinc-500 uppercase">
                        Focus Stack
                      </span>
                      <span className="text-xs font-bold text-zinc-100">MERN / Next / Laravel</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                    Why hire me?
                  </h4>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {STRENGTHS.map((fn, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-zinc-400">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        <span>{fn(EXPERIENCE_YEARS)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 border-t border-zinc-800 pt-6">
                  <h4 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                    Recruiter FAQs
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-bold text-zinc-100">
                        Q: What is your primary architectural expertise?
                      </h5>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                        A: Bridging scalable React/Next.js frontends with secure Node.js/Laravel
                        backends — optimized queries, indexes, state management, and CI/CD.
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-zinc-100">
                        Q: Are you open to technical assessments?
                      </h5>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                        A: Yes — take-homes, system design, and architecture reviews. I deliver
                        structured, testable work on schedule.
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-zinc-100">
                        Q: How do you keep velocity high without sacrificing quality?
                      </h5>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                        A: AI-augmented workflows for prototyping and boilerplate, with human-led
                        focus on architecture, security, and review.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 border-t border-zinc-800 pt-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                      Resume
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenResume();
                      }}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 py-3 text-sm font-bold text-zinc-300 transition-all hover:bg-zinc-800 hover:text-zinc-100"
                    >
                      <FileText className="h-4 w-4 text-emerald-500" /> Interactive CV Preview
                    </button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                      Direct Contact
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleEmailToHire}
                        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 p-3 text-center text-zinc-400 transition-all hover:border-emerald-500/40 hover:text-emerald-400"
                      >
                        <Mail className="mb-1.5 h-5 w-5" />
                        <span className="text-[10px] font-bold">Email</span>
                      </button>
                      <a
                        href={`tel:${PHONE_NUMBER}`}
                        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 p-3 text-center text-zinc-400 transition-all hover:border-emerald-500/40 hover:text-emerald-400"
                      >
                        <Phone className="mb-1.5 h-5 w-5" />
                        <span className="text-[10px] font-bold">Call</span>
                      </a>
                      <a
                        href={LINKEDIN_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 p-3 text-center text-zinc-400 transition-all hover:border-emerald-500/40 hover:text-emerald-400"
                      >
                        <Linkedin className="mb-1.5 h-5 w-5" />
                        <span className="text-[10px] font-bold">LinkedIn</span>
                      </a>
                      <a
                        href={GITHUB_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 p-3 text-center text-zinc-400 transition-all hover:border-emerald-500/40 hover:text-emerald-400"
                      >
                        <Github className="mb-1.5 h-5 w-5" />
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
