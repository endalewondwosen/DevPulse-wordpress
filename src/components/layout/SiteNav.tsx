import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Github,
  Linkedin,
  LogOut,
  Menu,
  Moon,
  Sun,
  Terminal,
  X,
} from 'lucide-react';
import { GITHUB_URL, LINKEDIN_URL } from '../../lib/constants';

export type AppTab = 'home' | 'projects' | 'snippets' | 'admin';

const NAV_ITEMS = [
  { name: 'About', id: 'about', type: 'scroll' as const },
  { name: 'Skills', id: 'skills', type: 'scroll' as const },
  { name: 'Projects', id: 'projects', type: 'tab' as const },
  { name: 'Experience', id: 'experience', type: 'scroll' as const },
  { name: 'Contact', id: 'contact', type: 'scroll' as const },
];

interface SiteNavProps {
  activeTab: AppTab;
  activeSection: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  token: string | null;
  onLogout: () => void;
  onTabChange: (tab: AppTab) => void;
  onSectionChange?: (sectionId: string) => void;
}

export function SiteNav({
  activeTab,
  activeSection,
  isMenuOpen,
  setIsMenuOpen,
  theme,
  setTheme,
  token,
  onLogout,
  onTabChange,
  onSectionChange,
}: SiteNavProps) {
  const isNavItemActive = (item: { id: string; type: string }) =>
    (item.type === 'tab' && activeTab === item.id) ||
    (item.type === 'scroll' && activeTab === 'home' && activeSection === item.id);

  const navLinkClass = (active: boolean) =>
    `text-sm font-medium transition-all duration-200 cursor-pointer rounded-lg px-3 py-2 ${
      active
        ? 'text-emerald-500 bg-emerald-500/10'
        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
    }`;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    const offset = 80;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth',
    });
  };

  const handleNavClick = (item: { name: string; id: string; type: string }) => {
    setIsMenuOpen(false);
    if (item.type === 'tab') {
      onTabChange(item.id as AppTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Optimistic active badge (don't wait for scroll spy).
    onSectionChange?.(item.id);

    if (activeTab !== 'home') {
      onTabChange('home');
      setTimeout(() => scrollToSection(item.id), 100);
    } else {
      scrollToSection(item.id);
    }
  };

  return (
    <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <div
          className="flex min-w-0 items-center gap-2 cursor-pointer"
          onClick={() => {
            onTabChange('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500">
            <Terminal className="h-5 w-5 text-black" />
          </div>
          <span className="font-display truncate text-base font-bold tracking-tight sm:text-xl">
            <span className="sm:hidden">Wondwosen</span>
            <span className="hidden sm:inline">Wondwosen Endale</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item)}
              className={navLinkClass(isNavItemActive(item))}
            >
              {item.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onTabChange('snippets')}
            className={navLinkClass(activeTab === 'snippets')}
          >
            Code Lab
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {/* Public Admin nav hidden — keep portfolio clean for recruiters.
              Uncomment to show Admin entry when VITE_SHOW_ADMIN_LOGIN=true,
              or Dashboard after login.
          {(token || SHOW_ADMIN_LOGIN) && (
            <button
              onClick={() => {
                onTabChange('admin');
                setIsMenuOpen(false);
              }}
              className={`flex items-center gap-2 text-lg font-medium transition-colors ${
                activeTab === 'admin' ? 'text-emerald-500' : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              <Activity className="w-5 h-5" />
              {token ? 'Dashboard' : 'Admin'}
            </button>
          )}
          */}

          {/* Dashboard after login — desktop only; mobile uses drawer */}
          {token && (
            <button
              type="button"
              onClick={() => {
                onTabChange('admin');
                setIsMenuOpen(false);
              }}
              className={`hidden items-center gap-2 text-sm font-medium transition-colors md:flex ${
                activeTab === 'admin' ? 'text-emerald-500' : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              <Activity className="h-5 w-5" />
              Dashboard
            </button>
          )}

          <div className="hidden h-4 w-px bg-zinc-800 md:block" />

          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-2 text-zinc-400 transition-colors hover:text-emerald-500"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-2 text-zinc-400 transition-colors hover:text-emerald-500"
              title="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-2 text-zinc-400 transition-colors hover:text-emerald-500"
              title="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>

          {token ? (
            <button
              type="button"
              onClick={onLogout}
              className={`hidden md:flex items-center gap-2 ${navLinkClass(false)}`}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          ) : null}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-800 bg-zinc-900 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`text-left text-lg font-medium transition-all duration-200 cursor-pointer rounded-xl px-3 py-2 ${
                    isNavItemActive(item)
                      ? 'text-emerald-500 bg-emerald-500/10'
                      : 'text-zinc-400 hover:text-emerald-500 hover:bg-zinc-800/50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  onTabChange('snippets');
                  setIsMenuOpen(false);
                }}
                className={`text-left text-lg font-medium transition-all duration-200 cursor-pointer rounded-xl px-3 py-2 ${
                  activeTab === 'snippets'
                    ? 'text-emerald-500 bg-emerald-500/10'
                    : 'text-zinc-400 hover:text-emerald-500 hover:bg-zinc-800/50'
                }`}
              >
                Code Lab
              </button>
              {token && (
                <button
                  type="button"
                  onClick={() => {
                    onTabChange('admin');
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 text-left text-lg font-medium transition-all duration-200 cursor-pointer rounded-xl px-3 py-2 ${
                    activeTab === 'admin'
                      ? 'text-emerald-500 bg-emerald-500/10'
                      : 'text-zinc-400 hover:text-emerald-500 hover:bg-zinc-800/50'
                  }`}
                >
                  <Activity className="h-5 w-5" />
                  Dashboard
                </button>
              )}
              <div className="my-2 h-px bg-zinc-800" />
              <div className="flex items-center gap-3 px-1">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-2.5 text-zinc-400"
                  title="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-2.5 text-zinc-400"
                  title="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                {token && (
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="ml-auto flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-zinc-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
