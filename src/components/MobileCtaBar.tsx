import { FileText, MessageSquare, Sparkles } from 'lucide-react';

interface MobileCtaBarProps {
  onOpenChat: () => void;
  onOpenResume: () => void;
  onOpenRecruiter: () => void;
}

export function MobileCtaBar({ onOpenChat, onOpenResume, onOpenRecruiter }: MobileCtaBarProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="pointer-events-auto mx-3 mb-3 grid grid-cols-3 gap-2 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-md">
        <button
          type="button"
          onClick={onOpenChat}
          className="relative flex flex-col items-center justify-center gap-0.5 rounded-xl bg-zinc-900/60 py-2.5 text-zinc-100 transition-colors active:bg-zinc-800"
          aria-label="Open AI assistant"
        >
          <span className="relative">
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            <span
              className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border border-zinc-950 bg-red-500"
              aria-hidden
            />
          </span>
          <span className="text-[10px] font-bold tracking-wide">Ask AI</span>
        </button>
        <button
          type="button"
          onClick={onOpenResume}
          className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-zinc-900/60 py-2.5 text-zinc-100 transition-colors active:bg-zinc-800"
          aria-label="Resume"
        >
          <FileText className="h-4 w-4 text-emerald-400" />
          <span className="text-[10px] font-bold tracking-wide">Resume</span>
        </button>
        <button
          type="button"
          onClick={onOpenRecruiter}
          className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-emerald-500 py-2.5 text-black transition-colors active:bg-emerald-400"
          aria-label="Open recruiter console"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-[10px] font-extrabold tracking-wide">Hire me</span>
        </button>
      </div>
    </div>
  );
}
