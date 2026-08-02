import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ExternalLink, Code2, Lock, Github, ChevronRight } from 'lucide-react';
import { Post } from '../types';

export const ProjectCard: React.FC<{
  project: Post;
  onClick: () => void | Promise<void>;
  index?: number;
}> = ({ project, onClick, index = 0 }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      layoutId={`project-${project.id}`}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      onClick={onClick}
      className="surface-shimmer group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 transition-colors hover:border-emerald-500/50"
    >
      <div className="relative h-48 overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
            <Code2 className="h-12 w-12 text-zinc-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />

        <div className="absolute top-4 right-4 translate-y-2 rounded-full border border-white/10 bg-black/50 p-2 opacity-0 backdrop-blur-md transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <ExternalLink className="h-4 w-4 text-emerald-500" />
        </div>

        {project.status === 'private' && (
          <div className="absolute top-4 left-4 flex items-center gap-1 rounded-lg border border-amber-500/30 bg-black/60 px-2 py-1 text-[10px] font-bold text-amber-500 backdrop-blur-md">
            <Lock className="h-2.5 w-2.5" />
            PRIVATE
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-3">
          <h3 className="line-clamp-1 text-xl font-bold transition-colors group-hover:text-emerald-400">
            {project.title}
          </h3>
        </div>

        <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-zinc-400">{project.content}</p>

        <div className="mt-auto">
          <div className="mb-6 flex flex-wrap gap-2">
            {project.meta.tech_stack?.split(',').map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-emerald-500/10 bg-emerald-500/5 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-500/80 uppercase"
              >
                {tech.trim()}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4">
            <div className="flex items-center gap-4">
              {project.meta.github_url && (
                <a
                  href={project.meta.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-emerald-400"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>Source</span>
                </a>
              )}
              {project.meta.project_url && (
                <a
                  href={project.meta.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-emerald-400"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Demo</span>
                </a>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
