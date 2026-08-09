import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Github,
  ExternalLink,
  Cpu,
  Target,
  Zap,
  Layers,
  CheckCircle2,
  FileText,
  Mail,
  Expand,
} from 'lucide-react';
import { Post } from '../types';
import { CONTACT_EMAIL } from '../lib/constants';
import { openMailto } from '../lib/mail';

interface ProjectDeepDiveProps {
  project: Post | null;
  isOpen: boolean;
  onClose: () => void;
  contactEmail?: string;
  onOpenResume?: () => void;
  onNotify?: (message: string, type?: 'success' | 'error') => void;
}

function firstSentences(text: string, count: number): string {
  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.slice(0, count).join(' ');
}

export const ProjectDeepDive: React.FC<ProjectDeepDiveProps> = ({
  project,
  isOpen,
  onClose,
  contactEmail,
  onOpenResume,
  onNotify,
}) => {
  const [mediaExpanded, setMediaExpanded] = useState(false);

  if (!project) return null;

  const email = (contactEmail || CONTACT_EMAIL).trim() || CONTACT_EMAIL;
  const challenge = project.meta.challenge?.trim();
  const solution = project.meta.solution?.trim();
  const impact = project.meta.impact?.trim();
  const architecture = project.meta.architecture?.trim();
  const techStack = project.meta.tech_stack?.trim();
  const overview = project.content?.trim() || '';

  const handleDiscuss = async () => {
    try {
      const { copied } = await openMailto(email, {
        subject: `Regarding your project: ${project.title}`,
        body: `Hi Wondwosen,\n\nI reviewed "${project.title}" and would like to discuss a role.\n\n`,
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

  const caseCards = [
    challenge && { icon: Target, label: 'The Challenge', body: challenge, tone: 'text-emerald-500' },
    solution && { icon: Zap, label: 'The Solution', body: solution, tone: 'text-blue-500' },
    impact && { icon: CheckCircle2, label: 'The Impact', body: impact, tone: 'text-teal-400' },
  ].filter(Boolean) as Array<{
    icon: typeof Target;
    label: string;
    body: string;
    tone: string;
  }>;

  const featureSentences = overview
    .split('.')
    .map((s) => s.trim())
    .filter((s) => s.length > 12);

  const closeAll = () => {
    setMediaExpanded(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAll}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative flex max-h-[min(92dvh,90vh)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl sm:rounded-[2.5rem]"
          >
            <div className="relative h-40 shrink-0 sm:h-52 md:h-72">
              {project.image_url ? (
                <button
                  type="button"
                  onClick={() => setMediaExpanded(true)}
                  className="group/media relative h-full w-full cursor-zoom-in"
                  aria-label="Expand project image"
                >
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/media:scale-[1.02]"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute right-5 bottom-5 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/55 px-3 py-1.5 text-[10px] font-bold tracking-wider text-zinc-100 uppercase opacity-0 backdrop-blur-md transition-opacity group-hover/media:opacity-100">
                    <Expand className="h-3.5 w-3.5" />
                    Expand
                  </span>
                </button>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-zinc-950">
                  <Layers className="h-12 w-12 text-emerald-500/40" />
                  <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
                    Case study media
                  </span>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/50 via-transparent to-transparent" />

              <button
                type="button"
                onClick={closeAll}
                className="absolute top-6 right-6 rounded-2xl border border-white/10 bg-black/50 p-3 text-white backdrop-blur-md transition-all hover:bg-emerald-500 hover:text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="scrollbar-hide min-h-0 flex-1 space-y-8 overflow-y-auto p-5 sm:space-y-12 sm:p-8 md:p-12">
              <div className="space-y-4 border-b border-zinc-800/80 pb-2">
                <h2 className="font-display text-3xl font-black leading-tight text-zinc-100 md:text-4xl">
                  {project.title}
                </h2>
                {techStack && (
                  <div className="flex flex-wrap gap-2">
                    {techStack.split(',').map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-emerald-400 uppercase"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {caseCards.length > 0 ? (
                <div
                  className={`grid grid-cols-1 gap-6 ${
                    caseCards.length === 1
                      ? 'md:grid-cols-1'
                      : caseCards.length === 2
                        ? 'md:grid-cols-2'
                        : 'md:grid-cols-3'
                  }`}
                >
                  {caseCards.map(({ icon: Icon, label, body, tone }) => (
                    <div
                      key={label}
                      className="rounded-3xl border border-zinc-700/30 bg-zinc-800/30 p-6"
                    >
                      <div className={`mb-4 flex items-center gap-3 ${tone}`}>
                        <Icon className="h-5 w-5" />
                        <h3 className="text-xs font-bold tracking-widest uppercase">{label}</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-400">{body}</p>
                    </div>
                  ))}
                </div>
              ) : overview ? (
                <div className="rounded-3xl border border-zinc-700/30 bg-zinc-800/30 p-6 md:p-8">
                  <h3 className="mb-3 text-xs font-bold tracking-widest text-emerald-500 uppercase">
                    Overview
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-300 md:text-base">
                    {firstSentences(overview, 3) || overview}
                  </p>
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                <div className="space-y-6">
                  <h3 className="flex items-center gap-3 text-xl font-bold">
                    <Layers className="h-6 w-6 text-emerald-500" />
                    Technical Architecture
                  </h3>
                  <div className="prose prose-invert prose-sm max-w-none leading-relaxed text-zinc-400">
                    {architecture ? (
                      <p>{architecture}</p>
                    ) : techStack ? (
                      <p>
                        Built with {techStack.split(',').map((t) => t.trim()).join(', ')} — focused
                        on maintainable modules, clear API boundaries, and production reliability.
                      </p>
                    ) : (
                      <p>
                        Architecture details for this project are available on request — open the
                        live demo or source when linked below.
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="flex items-center gap-3 text-xl font-bold">
                    <Cpu className="h-6 w-6 text-emerald-500" />
                    Key Features & Logic
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {featureSentences.length > 0 ? (
                      featureSentences.map((sentence, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 rounded-2xl border border-zinc-700/70 bg-zinc-800/60 p-4"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-xs font-bold text-emerald-400">
                            {String(idx + 1).padStart(2, '0')}
                          </div>
                          <p className="text-sm leading-relaxed text-zinc-100 md:text-[15px]">
                            {sentence}.
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500">
                        Feature breakdown will appear here once project content is added in admin.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-zinc-800 bg-zinc-950 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex flex-wrap items-center gap-4">
                {project.meta.github_url && (
                  <a
                    href={project.meta.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-bold text-zinc-400 transition-colors hover:text-emerald-500"
                  >
                    <Github className="h-5 w-5" />
                    Source
                  </a>
                )}
                {project.meta.project_url && (
                  <a
                    href={project.meta.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-bold text-zinc-400 transition-colors hover:text-emerald-500"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Live Demo
                  </a>
                )}
              </div>

              <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
                {onOpenResume && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenResume();
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-100 transition-colors hover:border-zinc-700"
                  >
                    <FileText className="h-4 w-4 text-emerald-500" />
                    Resume
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDiscuss}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-black transition-colors hover:bg-emerald-400"
                >
                  <Mail className="h-4 w-4" />
                  Discuss this work
                </button>
              </div>
            </div>
          </motion.div>

          {/* Media lightbox */}
          <AnimatePresence>
            {mediaExpanded && project.image_url && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[180] flex items-center justify-center bg-black/95 p-4"
                onClick={() => setMediaExpanded(false)}
              >
                <button
                  type="button"
                  onClick={() => setMediaExpanded(false)}
                  className="absolute top-6 right-6 rounded-2xl border border-white/10 bg-zinc-900/80 p-3 text-white"
                  aria-label="Close expanded image"
                >
                  <X className="h-5 w-5" />
                </button>
                <motion.img
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  src={project.image_url}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[88vh] max-w-full rounded-2xl object-contain shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
};
