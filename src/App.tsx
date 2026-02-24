import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Code2, 
  ExternalLink, 
  Github, 
  Layout, 
  Activity,
  ChevronRight,
  Box,
  Cpu,
  Lock,
  User,
  LogOut
} from 'lucide-react';

interface Post {
  id: number;
  title: string;
  content: string;
  type: 'project' | 'snippet';
  status: 'publish' | 'private';
  meta: {
    github_url?: string;
    project_url?: string;
    tech_stack?: string;
    language?: string;
  };
  created_at: string;
}

interface Stat {
  endpoint: string;
  views: number;
}

export default function App() {
  const [projects, setProjects] = useState<Post[]>([]);
  const [snippets, setSnippets] = useState<Post[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'snippets' | 'admin'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('devpulse_token'));
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'project' as 'project' | 'snippet',
    status: 'publish' as 'publish' | 'private',
    meta: {
      github_url: '',
      project_url: '',
      tech_stack: '',
      language: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [token, searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers: any = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';

      const [projRes, snipRes, statRes] = await Promise.all([
        fetch(`/api/posts?type=project${searchParam}`, { headers }),
        fetch(`/api/posts?type=snippet${searchParam}`, { headers }),
        fetch('/api/stats')
      ]);
      
      const [projData, snipData, statData] = await Promise.all([
        projRes.json(),
        snipRes.json(),
        statRes.json()
      ]);

      setProjects(projData);
      setSnippets(snipData);
      setStats(statData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = async (id: number) => {
    // Trigger the logging middleware on the server
    await fetch(`/api/posts/${id}`);
    fetchData(); // Refresh stats
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('devpulse_token', data.token);
        setToken(data.token);
        setShowLogin(false);
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('devpulse_token');
    setToken(null);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPost)
      });

      if (res.ok) {
        setNewPost({
          title: '',
          content: '',
          type: 'project',
          status: 'publish',
          meta: { github_url: '', project_url: '', tech_stack: '', language: '' }
        });
        fetchData();
        alert("Content published successfully!");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to publish content");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold tracking-tight text-xl">DevPulse</span>
          </div>
          
          <div className="flex gap-1 bg-zinc-800/50 p-1 rounded-xl border border-zinc-700/50">
            {(['projects', 'snippets', 'admin'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {token ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <button 
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 text-sm transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showLogin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold">Developer Login</h2>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Username</label>
                  <input 
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    placeholder="admin"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Password</label>
                  <input 
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="password"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="submit"
                    className="flex-1 bg-emerald-500 text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition-colors"
                  >
                    Authenticate
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowLogin(false)}
                    className="px-6 bg-zinc-800 text-zinc-300 font-bold py-3 rounded-xl hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
            <div className="max-w-2xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-bold tracking-tighter mb-4"
              >
                Headless <span className="text-emerald-500">Architecture</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-zinc-400 text-xl leading-relaxed"
              >
                A professional showcase of decoupled content management. 
                WordPress-style API logic powering a high-performance React interface.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full md:w-72"
            >
              <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </motion.div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onClick={() => handlePostClick(project.id)}
                />
              ))}
            </motion.div>
          )}

          {activeTab === 'snippets' && (
            <motion.div
              key="snippets"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {snippets.map((snippet) => (
                <SnippetItem 
                  key={snippet.id} 
                  snippet={snippet}
                  onClick={() => handlePostClick(snippet.id)}
                />
              ))}
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-8">
                {/* Create Post Form */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <Box className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-2xl font-bold">Content Management</h2>
                  </div>

                  {!token ? (
                    <div className="text-center py-12 bg-zinc-800/30 rounded-2xl border border-dashed border-zinc-700">
                      <Lock className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                      <p className="text-zinc-400 mb-6">You must be authenticated to manage content.</p>
                      <button 
                        onClick={() => setShowLogin(true)}
                        className="bg-emerald-500 text-black font-bold px-8 py-3 rounded-xl hover:bg-emerald-400 transition-colors"
                      >
                        Login as Admin
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleCreatePost} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Title</label>
                          <input 
                            required
                            type="text"
                            value={newPost.title}
                            onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                            placeholder="Project Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Type</label>
                          <select 
                            value={newPost.type}
                            onChange={(e) => setNewPost({...newPost, type: e.target.value as any})}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                          >
                            <option value="project">Project</option>
                            <option value="snippet">Snippet</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Content / Description</label>
                        <textarea 
                          rows={3}
                          value={newPost.content}
                          onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="Briefly describe this resource..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</label>
                          <select 
                            value={newPost.status}
                            onChange={(e) => setNewPost({...newPost, status: e.target.value as any})}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                          >
                            <option value="publish">Public</option>
                            <option value="private">Private (Locked)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tech Stack</label>
                          <input 
                            type="text"
                            value={newPost.meta.tech_stack}
                            onChange={(e) => setNewPost({...newPost, meta: {...newPost.meta, tech_stack: e.target.value}})}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                            placeholder="React, Node, etc."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">GitHub URL</label>
                          <input 
                            type="text"
                            value={newPost.meta.github_url}
                            onChange={(e) => setNewPost({...newPost, meta: {...newPost.meta, github_url: e.target.value}})}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                            placeholder="https://github.com/..."
                          />
                        </div>
                      </div>

                      <button 
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-emerald-500 text-black font-bold py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Box className="w-5 h-5" />
                            <span>Publish to Headless API</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                {/* Stats Widget */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <Activity className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-2xl font-bold">API Analytics</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {stats.length === 0 ? (
                      <p className="text-zinc-500 text-sm italic">No API activity logged yet.</p>
                    ) : (
                      stats.map((stat, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-2xl border border-zinc-700/30">
                          <div className="flex flex-col">
                            <code className="text-emerald-400 text-xs truncate max-w-[120px]">{stat.endpoint}</code>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Endpoint</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold">{stat.views}</span>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">hits</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Architecture Note */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6">
                  <h4 className="text-emerald-500 font-bold text-sm mb-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Interview Tip
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    When showing this, explain that the form above is your "Custom Admin Panel." 
                    Instead of using the default WordPress UI, you built a tailored experience 
                    that communicates with the API via JWT-secured POST requests.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="border-t border-zinc-800 mt-24 py-12 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Box className="w-4 h-4 text-emerald-500" />
              Backend Logic
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Simulated WordPress CPTs using SQLite. Demonstrates schema design, 
              custom fields (post_meta), and RESTful endpoint architecture.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-500" />
              API Strategy
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Decoupled architecture using Express.js. Middleware handles 
              request logging and data normalization before serving to the client.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Layout className="w-4 h-4 text-emerald-500" />
              Frontend Tech
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              React 19 with Motion for fluid transitions. Tailwind CSS 4 
              for a high-density, professional developer aesthetic.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProjectCard({ project, onClick }: { project: Post, onClick: () => void | Promise<void>, key?: any }) {
  return (
    <motion.div 
      layoutId={`project-${project.id}`}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-emerald-500/50 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink className="w-5 h-5 text-emerald-500" />
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-500/10 rounded-xl">
          <Code2 className="w-6 h-6 text-emerald-500" />
        </div>
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold group-hover:text-emerald-400 transition-colors">{project.title}</h3>
          {project.status === 'private' && (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">
              <Lock className="w-2.5 h-2.5" />
              PRIVATE
            </span>
          )}
        </div>
      </div>
      
      <p className="text-zinc-400 mb-6 line-clamp-2">{project.content}</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {project.meta.tech_stack?.split(',').map((tech) => (
          <span key={tech} className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium text-zinc-300 border border-zinc-700/50">
            {tech.trim()}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-zinc-500 text-sm hover:text-emerald-400 transition-colors">
            <Github className="w-4 h-4" />
            <span>Source</span>
          </div>
          {project.meta.project_url && (
            <div className="flex items-center gap-2 text-zinc-500 text-sm hover:text-emerald-400 transition-colors">
              <ExternalLink className="w-4 h-4" />
              <span>Demo</span>
            </div>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}

function SnippetItem({ snippet, onClick }: { snippet: Post, onClick: () => void | Promise<void>, key?: any }) {
  return (
    <motion.div 
      layoutId={`snippet-${snippet.id}`}
      whileHover={{ x: 5 }}
      onClick={onClick}
      className="group flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-emerald-500/30 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
          <Terminal className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500" />
        </div>
        <div>
          <h4 className="font-bold group-hover:text-emerald-400 transition-colors">{snippet.title}</h4>
          <span className="text-xs text-zinc-500 uppercase tracking-widest">{snippet.meta.language || 'text'}</span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-emerald-500 transition-colors" />
    </motion.div>
  );
}
