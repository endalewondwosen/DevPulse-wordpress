import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Github, ExternalLink, Cpu, Target, Zap, Layers, CheckCircle2 } from 'lucide-react';
import { Post } from '../types';

interface ProjectDeepDiveProps {
    project: Post | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProjectDeepDive: React.FC<ProjectDeepDiveProps> = ({ project, isOpen, onClose }) => {
    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-5xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Header Image/Banner */}
                        <div className="relative h-48 md:h-64 flex-shrink-0">
                            {project.image_url ? (
                                <img
                                    src={project.image_url}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-zinc-900" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/30 via-transparent to-transparent" />

                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-3 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 text-white hover:bg-emerald-500 hover:text-black transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>

                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 scrollbar-hide">
                            {/* Project Identity */}
                            <div className="space-y-4 pb-2 border-b border-zinc-800/80">
                                <h2 className="text-3xl md:text-4xl font-black text-zinc-100 leading-tight">
                                    {project.title}
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {project.meta.tech_stack?.split(',').map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-[0.14em] border border-emerald-500/25"
                                        >
                                            {tech.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 bg-zinc-800/30 rounded-3xl border border-zinc-700/30">
                                    <div className="flex items-center gap-3 mb-4 text-emerald-500">
                                        <Target className="w-5 h-5" />
                                        <h3 className="font-bold uppercase tracking-widest text-xs">The Challenge</h3>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        {project.meta.challenge || "Building a scalable solution that addresses complex user needs while maintaining high performance and reliability."}
                                    </p>
                                </div>

                                <div className="p-6 bg-zinc-800/30 rounded-3xl border border-zinc-700/30">
                                    <div className="flex items-center gap-3 mb-4 text-blue-500">
                                        <Zap className="w-5 h-5" />
                                        <h3 className="font-bold uppercase tracking-widest text-xs">The Solution</h3>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        {project.meta.solution || "Implemented a modern full-stack architecture using industry best practices to ensure a seamless and efficient user experience."}
                                    </p>
                                </div>

                                <div className="p-6 bg-zinc-800/30 rounded-3xl border border-zinc-700/30">
                                    <div className="flex items-center gap-3 mb-4 text-purple-500">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <h3 className="font-bold uppercase tracking-widest text-xs">The Impact</h3>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        {project.meta.impact || "Delivered a production-ready application that significantly improved workflow efficiency and user engagement metrics."}
                                    </p>
                                </div>
                            </div>

                            {/* Detailed Breakdown */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold flex items-center gap-3">
                                        <Layers className="w-6 h-6 text-emerald-500" />
                                        Technical Architecture
                                    </h3>
                                    <div className="prose prose-invert prose-sm max-w-none text-zinc-400 leading-relaxed">
                                        {project.meta.architecture ? (
                                            <p>{project.meta.architecture}</p>
                                        ) : (
                                            <p>
                                                The system was built with a decoupled architecture, separating the concerns of data management,
                                                business logic, and user interface. This approach allowed for independent scaling and
                                                easier maintenance of the codebase.
                                            </p>
                                        )}
                                        <ul className="space-y-2 mt-4">
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                                                <span>High-performance frontend built with React and optimized for speed.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                                                <span>Robust backend API handling complex data operations and security.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                                                <span>Scalable database schema designed for data integrity and fast retrieval.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold flex items-center gap-3">
                                        <Cpu className="w-6 h-6 text-emerald-500" />
                                        Key Features & Logic
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {project.content.split('.').filter(s => s.trim().length > 0).map((sentence, idx) => (
                                            <div key={idx} className="p-4 bg-zinc-800/60 rounded-2xl border border-zinc-700/70 flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                                                    0{idx + 1}
                                                </div>
                                                <p className="text-sm md:text-[15px] leading-relaxed text-zinc-100">{sentence.trim()}.</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-8 bg-zinc-950 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                {project.meta.github_url && (
                                    <a
                                        href={project.meta.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-zinc-400 hover:text-emerald-500 transition-colors font-bold text-sm"
                                    >
                                        <Github className="w-5 h-5" />
                                        View Source Code
                                    </a>
                                )}
                                {project.meta.project_url && (
                                    <a
                                        href={project.meta.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-zinc-400 hover:text-emerald-500 transition-colors font-bold text-sm"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        Live Demo
                                    </a>
                                )}
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full md:w-auto px-8 py-3 bg-emerald-500 text-black font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                Close Case Study
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
