import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Code2, Lock, Github, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { Post } from '../types';

export interface ProjectCardProps {
  project: Post;
  onClick: () => void | Promise<void>;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <motion.div 
      layoutId={`project-${project.id}`}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-emerald-500/50 transition-all cursor-pointer relative overflow-hidden flex flex-col"
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        {project.image_url ? (
          <img 
            src={project.image_url} 
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <Code2 className="w-12 h-12 text-zinc-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
        
        {project.status === 'private' && (
          <div className="absolute top-4 left-4 flex items-center gap-1 text-[10px] font-bold bg-black/60 backdrop-blur-md text-amber-500 px-2 py-1 rounded-lg border border-amber-500/30">
            <Lock className="w-2.5 h-2.5" />
            PRIVATE
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-xl font-bold group-hover:text-emerald-400 transition-colors line-clamp-1">{project.title}</h3>
        </div>
        
        <p className="text-zinc-400 mb-6 line-clamp-2 text-sm leading-relaxed">{project.content}</p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {project.meta.tech_stack?.split(',').map((tech) => (
              <span key={tech} className="px-2 py-0.5 bg-emerald-500/5 rounded-md text-[10px] font-bold text-emerald-500/80 border border-emerald-500/10 uppercase tracking-wider">
                {tech.trim()}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
            <div className="flex items-center gap-4">
              {project.meta.github_url && (
                <a 
                  href={project.meta.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-500 text-xs hover:text-emerald-400 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Source</span>
                </a>
              )}
              {project.meta.project_url && (
                <a 
                  href={project.meta.project_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-500 text-xs hover:text-emerald-400 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Demo</span>
                </a>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
