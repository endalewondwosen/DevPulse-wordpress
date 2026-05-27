import { Activity, Box, ChevronRight, Cpu, Github, Layout, Linkedin, Mail, Terminal } from 'lucide-react';
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from '../../lib/constants';

export type FooterTab = 'home' | 'projects' | 'snippets' | 'admin';

interface FooterProps {
  settings: Record<string, string>;
  onNavigate: (tab: FooterTab) => void;
}

export function Footer({ settings, onNavigate }: FooterProps) {
  const navTabs: FooterTab[] = ['home', 'projects', 'snippets'];
  return (
    <footer className="border-t border-zinc-800 mt-24 pt-16 pb-28 md:pb-8 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Terminal className="w-5 h-5 text-zinc-950" />
              </div>
              <span className="font-bold tracking-tight text-xl">
                {settings.site_title || 'Wondwosen'}
              </span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mb-6">
              {settings.hero_subtitle ||
                'Full Stack Engineer focused on building scalable, high-performance web applications and robust system architectures.'}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-emerald-500 transition-all"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-emerald-500 transition-all"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${settings.contact_email || CONTACT_EMAIL}`}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-emerald-500 transition-all"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">
              Navigation
            </h4>
            <ul className="space-y-4">
              {navTabs.map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => {
                      onNavigate(tab);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-sm text-zinc-500 hover:text-emerald-500 transition-colors capitalize"
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">
              Technical Expertise
            </h4>
            <div className="space-y-6">
              <div className="flex gap-3">
                <Box className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-bold text-zinc-100 mb-1">Full Stack Development</p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    End-to-end scalable solutions with modern frameworks
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Cpu className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-bold text-zinc-100 mb-1">Architecture Design</p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    Designing robust, maintainable, and high-performance systems
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Layout className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-bold text-zinc-100 mb-1">UI/UX Engineering</p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    Creating fluid, accessible, and high-performance user interfaces
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-zinc-600 font-mono">
            &copy; {new Date().getFullYear()}{' '}
            {settings.hero_title?.split('.')[0] || 'Wondwosen Endale'}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-[10px] text-zinc-600 flex items-center gap-2">
              <Activity className="w-3 h-3 text-emerald-500" />
              System Status: <span className="text-emerald-500">Operational</span>
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[10px] text-zinc-500 hover:text-emerald-500 transition-colors flex items-center gap-1"
            >
              Back to Top <ChevronRight className="w-3 h-3 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
