import { FileText, Mail, Sparkles } from 'lucide-react';
import { CONTACT_EMAIL } from '../lib/constants';

interface MobileCtaBarProps {
  contactEmail?: string;
  onOpenResume: () => void;
  onOpenRecruiter: () => void;
}

export function MobileCtaBar({ contactEmail, onOpenResume, onOpenRecruiter }: MobileCtaBarProps) {
  const email = contactEmail || CONTACT_EMAIL;
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-[100] pointer-events-none">
      <div className="pointer-events-auto mx-3 mb-3 p-2 bg-zinc-950/95 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-2xl grid grid-cols-3 gap-2">
        <a
          href={`mailto:${email}?subject=Hello%20Wondwosen`}
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-xl bg-zinc-900/60 active:bg-zinc-800 text-zinc-100 transition-colors"
          aria-label="Email"
        >
          <Mail className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-bold tracking-wide">Email</span>
        </a>
        <button
          type="button"
          onClick={onOpenResume}
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-xl bg-zinc-900/60 active:bg-zinc-800 text-zinc-100 transition-colors"
          aria-label="Resume"
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-bold tracking-wide">Resume</span>
        </button>
        <button
          type="button"
          onClick={onOpenRecruiter}
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-xl bg-emerald-500 active:bg-emerald-400 text-black transition-colors"
          aria-label="Open recruiter console"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-extrabold tracking-wide">Hire me</span>
        </button>
      </div>
    </div>
  );
}
