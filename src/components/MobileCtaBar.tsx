import { FileText, MessageSquare, Sparkles } from 'lucide-react';

interface MobileCtaBarProps {
  onOpenChat: () => void;
  onOpenResume: () => void;
  onOpenRecruiter: () => void;
}

export function MobileCtaBar({ onOpenChat, onOpenResume, onOpenRecruiter }: MobileCtaBarProps) {
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-[100] pointer-events-none">
      <div className="pointer-events-auto mx-3 mb-3 p-2 bg-zinc-950/95 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-2xl grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onOpenChat}
          className="relative flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-xl bg-zinc-900/60 active:bg-zinc-800 text-zinc-100 transition-colors"
          aria-label="Open AI assistant"
        >
          <span className="relative">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-zinc-950" aria-hidden />
          </span>
          <span className="text-[10px] font-bold tracking-wide">Ask AI</span>
        </button>
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
