import { FormEvent, ChangeEvent } from 'react';
import Markdown from 'react-markdown';
import {
  Activity, Award, BarChart3, Box, Briefcase, CheckCircle2, ChevronDown, ChevronUp,
  Edit3, Eye, Inbox, Lock, LogOut, Mail, Plus, Settings, Sparkles, Terminal, Trash2,
  Upload, Wrench,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import type { Post, Experience, Skill, Message, Stat, Certification } from '../../types';

export type AdminModule =
  | 'overview' | 'projects' | 'snippets' | 'experience' | 'skills' | 'certifications' | 'messages' | 'settings';

export interface AdminTabProps {
  token: string | null;
  setToken: (t: string | null) => void;
  setShowLogin: (v: boolean) => void;
  adminModule: AdminModule;
  setAdminModule: (m: AdminModule) => void;
  theme: 'light' | 'dark';
  projects: Post[];
  snippets: Post[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
  messages: Message[];
  stats: Stat[];
  settings: Record<string, string>;
  setSettings: (s: Record<string, string>) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  newPost: any;
  setNewPost: (p: any) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  newExperience: Omit<Experience, 'id'>;
  setNewExperience: (e: Omit<Experience, 'id'>) => void;
  editingExpId: number | null;
  setEditingExpId: (id: number | null) => void;
  newSkill: Omit<Skill, 'id'>;
  setNewSkill: (s: Omit<Skill, 'id'>) => void;
  editingSkillId: number | null;
  setEditingSkillId: (id: number | null) => void;
  newCertification: Omit<Certification, 'id'>;
  setNewCertification: (c: Omit<Certification, 'id'>) => void;
  editingCertId: number | null;
  setEditingCertId: (id: number | null) => void;
  isSubmitting: boolean;
  isUploading: boolean;
  isGeneratingReport: boolean;
  geminiReport: string;
  handleUpdateSettings: (e: FormEvent<HTMLFormElement>) => void;
  handleSettingFileUpload: (key: string, e: ChangeEvent<HTMLInputElement>) => void;
  handleCreatePost: (e: FormEvent<HTMLFormElement>) => void;
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMovePost: (id: number, direction: 'up' | 'down') => void;
  startEditing: (post: Post) => void;
  handleDeletePost: (id: number) => void;
  handleCreateExperience: (e: FormEvent<HTMLFormElement>) => void;
  handleMoveExperience: (id: number, direction: 'up' | 'down') => void;
  handleDeleteExperience: (id: number) => void;
  handleCreateSkill: (e: FormEvent<HTMLFormElement>) => void;
  handleDeleteSkill: (id: number) => void;
  handleCreateCertification: (e: FormEvent<HTMLFormElement>) => void;
  handleDeleteCertification: (id: number) => void;
  handleMarkAsRead: (id: number) => void;
  handleDeleteMessage: (id: number) => void;
  generateGeminiReport: () => void;
}

export function AdminTab(props: AdminTabProps) {
  const {
    token, setToken, setShowLogin, adminModule, setAdminModule, theme,
    projects, snippets, experience, skills, certifications, messages, stats,
    settings, setSettings, searchTerm, setSearchTerm,
    newPost, setNewPost, editingId, setEditingId,
    newExperience, setNewExperience, editingExpId, setEditingExpId,
    newSkill, setNewSkill, editingSkillId, setEditingSkillId,
    newCertification, setNewCertification, editingCertId, setEditingCertId,
    isSubmitting, isUploading, isGeneratingReport, geminiReport,
    handleUpdateSettings, handleSettingFileUpload, handleCreatePost, handleFileUpload,
    handleMovePost, startEditing, handleDeletePost,
    handleCreateExperience, handleMoveExperience, handleDeleteExperience,
    handleCreateSkill, handleDeleteSkill,
    handleCreateCertification, handleDeleteCertification,
    handleMarkAsRead, handleDeleteMessage, generateGeminiReport,
  } = props;

  return (
    <>
              {!token ? (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 border border-zinc-700">
                    <Lock className="w-10 h-10 text-zinc-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Admin Dashboard</h3>
                  <p className="text-zinc-400 mb-8 max-w-sm">
                    Authentication required. Sign in to manage portfolio content and view analytics.
                  </p>
                  {/* Login as Admin hidden
                  <button
                    onClick={() => setShowLogin(true)}
                    className="bg-emerald-500 text-black font-bold px-10 py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    Login as Admin
                  </button>
                  */}
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Admin Sidebar */}
                  <div className="w-full lg:w-64 flex flex-col gap-2">
                    {[
                      { id: 'overview', name: 'Overview', icon: BarChart3 },
                      { id: 'projects', name: 'Projects', icon: Box },
                      { id: 'snippets', name: 'Code Lab', icon: Terminal },
                      { id: 'experience', name: 'Experience', icon: Briefcase },
                      { id: 'skills', name: 'Skills', icon: Wrench },
                      { id: 'certifications', name: 'Certifications', icon: Award },
                      { id: 'messages', name: 'Inbox', icon: Inbox },
                      { id: 'settings', name: 'Settings', icon: Settings },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setAdminModule(item.id as typeof adminModule)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          adminModule === item.id 
                            ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                        {item.id === 'messages' && messages.filter(m => m.status === 'unread').length > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            {messages.filter(m => m.status === 'unread').length}
                          </span>
                        )}
                      </button>
                    ))}
                    
                    <div className="mt-auto pt-8 border-t border-zinc-800">
                      <button 
                        onClick={() => setToken(null)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>

                  {/* Admin Content Area */}
                  <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8">
                    <div className="space-y-8">
                      {/* Module Header */}
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold capitalize flex items-center gap-3">
                          {adminModule === 'overview' && <BarChart3 className="w-6 h-6 text-emerald-500" />}
                          {adminModule === 'projects' && <Box className="w-6 h-6 text-emerald-500" />}
                          {adminModule === 'snippets' && <Terminal className="w-6 h-6 text-emerald-500" />}
                          {adminModule === 'experience' && <Briefcase className="w-6 h-6 text-emerald-500" />}
                          {adminModule === 'skills' && <Wrench className="w-6 h-6 text-emerald-500" />}
                          {adminModule === 'certifications' && <Award className="w-6 h-6 text-emerald-500" />}
                          {adminModule === 'messages' && <Inbox className="w-6 h-6 text-emerald-500" />}
                          {adminModule === 'settings' && <Settings className="w-6 h-6 text-emerald-500" />}
                          {adminModule}
                        </h2>
                        
                        {['projects', 'snippets', 'experience', 'skills', 'certifications'].includes(adminModule) && (
                          <button 
                            onClick={() => {
                              setEditingId(null);
                              setEditingExpId(null);
                              setEditingSkillId(null);
                              setEditingCertId(null);
                              // Reset forms
                              setNewPost({ title: '', content: '', type: adminModule === 'projects' ? 'project' : 'snippet', status: 'publish', image_url: '', sort_order: 0, meta: { github_url: '', project_url: '', tech_stack: '', language: '', challenge: '', solution: '', impact: '', architecture: '' } });
                              setNewExperience({ company: '', role: '', period: '', description: '', sort_order: 0 });
                              setNewSkill({ category: 'frontend', name: '', sort_order: 0 });
                              setNewCertification({ name: '', issuer: '', date: '', url: '', sort_order: 0 });
                            }}
                            className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add New
                          </button>
                        )}
                      </div>

                    {/* Overview Module */}
                    {adminModule === 'overview' && (
                      <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {[
                            { label: 'Total Views', value: stats.reduce((acc, s) => acc + s.views, 0).toLocaleString(), icon: Eye, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                            { label: 'Unread Messages', value: messages.filter(m => m.status === 'unread').length, icon: Mail, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                            { label: 'Total Projects', value: projects.length, icon: Box, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                            { label: 'Total Skills', value: skills.length, icon: Wrench, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                          ].map((stat, i) => (
                            <div key={i} className="bg-zinc-800/50 p-5 rounded-2xl border border-zinc-700/50 flex items-center gap-4">
                              <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Traffic Chart */}
                          <div className="lg:col-span-2 bg-zinc-800/30 p-6 rounded-2xl border border-zinc-700/30 h-[350px]">
                            <h4 className="text-sm font-bold mb-6 flex items-center gap-2">
                              <Activity className="w-4 h-4 text-emerald-500" />
                              Traffic Distribution
                            </h4>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={stats}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#e4e4e7'} vertical={false} />
                                <XAxis dataKey="endpoint" stroke={theme === 'dark' ? '#666' : '#a1a1aa'} fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke={theme === 'dark' ? '#666' : '#a1a1aa'} fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                  cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                                  contentStyle={{ 
                                    backgroundColor: theme === 'dark' ? '#151516' : '#ffffff', 
                                    border: `1px solid ${theme === 'dark' ? '#27272a' : '#e4e4e7'}`, 
                                    borderRadius: '12px',
                                    color: theme === 'dark' ? '#f4f4f5' : '#09090b'
                                  }}
                                  itemStyle={{ color: '#10b981' }}
                                />
                                <Bar dataKey="views" fill="#10b981" radius={[6, 6, 0, 0]} barSize={30} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Content Pie Chart */}
                          <div className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-700/30 h-[350px]">
                            <h4 className="text-sm font-bold mb-6 flex items-center gap-2">
                              <PieChartIcon className="w-4 h-4 text-emerald-500" />
                              Content Mix
                            </h4>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: 'Projects', value: projects.length },
                                    { name: 'Snippets', value: snippets.length },
                                    { name: 'Experience', value: experience.length },
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  <Cell fill="#10b981" />
                                  <Cell fill="#3b82f6" />
                                  <Cell fill="#8b5cf6" />
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: theme === 'dark' ? '#151516' : '#ffffff', 
                                    border: `1px solid ${theme === 'dark' ? '#27272a' : '#e4e4e7'}`, 
                                    borderRadius: '12px',
                                    color: theme === 'dark' ? '#f4f4f5' : '#09090b'
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center gap-4 mt-4">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Projects
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase">
                                <div className="w-2 h-2 rounded-full bg-blue-500" /> Snippets
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase">
                                <div className="w-2 h-2 rounded-full bg-purple-500" /> Exp
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Recent Messages */}
                          <div className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-700/30">
                            <div className="flex items-center justify-between mb-6">
                              <h4 className="text-sm font-bold flex items-center gap-2">
                                <Inbox className="w-4 h-4 text-emerald-500" />
                                Recent Messages
                              </h4>
                              <button onClick={() => setAdminModule('messages')} className="text-[10px] font-bold text-emerald-500 hover:underline uppercase tracking-widest">View All</button>
                            </div>
                            <div className="space-y-3">
                              {messages.slice(0, 3).map(msg => (
                                <div key={msg.id} className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 flex items-center justify-between">
                                  <div>
                                    <p className="text-xs font-bold">{msg.name}</p>
                                    <p className="text-[10px] text-zinc-500 truncate max-w-[200px]">{msg.subject}</p>
                                  </div>
                                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${msg.status === 'unread' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
                                    {msg.status}
                                  </span>
                                </div>
                              ))}
                              {messages.length === 0 && <p className="text-xs text-zinc-600 italic text-center py-4">No messages yet.</p>}
                            </div>
                          </div>

                          {/* Recent Activity */}
                          <div className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-700/30">
                            <h4 className="text-sm font-bold mb-6 flex items-center gap-2">
                              <Activity className="w-4 h-4 text-emerald-500" />
                              Recent Activity
                            </h4>
                            <div className="space-y-3">
                              {[
                                ...projects.slice(0, 2).map(p => ({ type: 'Project', title: p.title, date: 'Recently' })),
                                ...snippets.slice(0, 2).map(s => ({ type: 'Snippet', title: s.title, date: 'Recently' })),
                                ...experience.slice(0, 1).map(e => ({ type: 'Experience', title: `${e.role} @ ${e.company}`, date: 'Recently' })),
                              ].sort(() => Math.random() - 0.5).slice(0, 5).map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span className="text-zinc-500 font-bold uppercase text-[8px] w-16">{item.type}</span>
                                  <span className="text-zinc-100 truncate flex-1">{item.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                            {/* AI Insights */}
                            <div className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-700/30">
                              <div className="flex items-center justify-between mb-6">
                                <h4 className="text-sm font-bold flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-emerald-500" />
                                  Gemini AI Insights
                                </h4>
                                <button
                                  onClick={generateGeminiReport}
                                  disabled={isGeneratingReport}
                                  className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 disabled:opacity-50"
                                >
                                  {isGeneratingReport ? 'Analyzing...' : 'Refresh Report'}
                                </button>
                              </div>
                              <div className="prose prose-invert prose-sm max-w-none h-[180px] overflow-y-auto scrollbar-hide">
                                {geminiReport ? (
                                  <div className="text-zinc-400 leading-relaxed">
                                    <Markdown>
                                      {geminiReport}
                                    </Markdown>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center h-full text-zinc-600">
                                    <Sparkles className="w-8 h-8 mb-2 opacity-20" />
                                    <p className="text-xs italic">Click refresh to generate an AI analysis of your portfolio.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Settings Module */}
                      {adminModule === 'settings' && (
                        <div className="space-y-8 max-w-2xl">
                          <form onSubmit={handleUpdateSettings} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Site Title</label>
                                <input
                                  type="text"
                                  value={settings.site_title}
                                  onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 outline-none"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Profile Image</label>
                                <div className="relative group/upload">
                                  <input
                                    type="text"
                                    value={settings.profile_image}
                                    onChange={(e) => setSettings({ ...settings, profile_image: e.target.value })}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 outline-none pr-10"
                                  />
                                  <label className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-zinc-700 hover:bg-emerald-500 hover:text-black rounded-lg cursor-pointer transition-all">
                                    <input
                                      type="file"
                                      className="hidden"
                                      accept="image/*"
                                      onChange={(e) => handleSettingFileUpload('profile_image', e)}
                                    />
                                    <Upload className="w-4 h-4" />
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Hero Title</label>
                              <input
                                type="text"
                                value={settings.hero_title}
                                onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 outline-none"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Hero Subtitle</label>
                              <textarea
                                rows={3}
                                value={settings.hero_subtitle}
                                onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 outline-none"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contact Email</label>
                              <input
                                type="email"
                                value={settings.contact_email || ''}
                                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 outline-none"
                                placeholder="your.email@example.com"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Resume / CV File (PDF)</label>
                              <div className="relative group/upload">
                                <input
                                  type="text"
                                  value={settings.resume_url}
                                  onChange={(e) => setSettings({ ...settings, resume_url: e.target.value })}
                                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 outline-none pr-10"
                                  placeholder="/resume.pdf"
                                />
                                <label className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-zinc-700 hover:bg-emerald-500 hover:text-black rounded-lg cursor-pointer transition-all">
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="application/pdf"
                                    onChange={(e) => handleSettingFileUpload('resume_url', e)}
                                  />
                                  <Upload className="w-4 h-4" />
                                </label>
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="bg-emerald-500 text-black font-bold px-8 py-3 rounded-xl hover:bg-emerald-400 transition-all flex items-center gap-2"
                            >
                              {isSubmitting ? <Activity className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
                              Save All Settings
                            </button>
                          </form>
                        </div>
                      )}

                      {/* Projects & Code Lab Module */}
                      {(adminModule === 'projects' || adminModule === 'snippets') && (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                              {editingId ? 'Edit Item' : 'Create New'}
                            </h3>
                            <form onSubmit={handleCreatePost} className="space-y-4">
                              <input
                                required
                                type="text"
                                value={newPost.title}
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 outline-none"
                                placeholder="Title"
                              />
                              <textarea
                                rows={3}
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 outline-none"
                                placeholder="Description"
                              />
                              <div className="relative group/upload">
                                <input
                                  type="text"
                                  value={newPost.image_url}
                                  onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
                                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 outline-none pr-12"
                                  placeholder="Image URL (or upload below)"
                                />
                                <label className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-zinc-700 hover:bg-emerald-500 hover:text-black rounded-lg cursor-pointer transition-all">
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                  />
                                  {isUploading ? (
                                    <Activity className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Upload className="w-4 h-4" />
                                  )}
                                </label>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <select
                                  value={newPost.status}
                                  onChange={(e) => setNewPost({ ...newPost, status: e.target.value as any })}
                                  className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none"
                                >
                                  <option value="publish">Public</option>
                                  <option value="private">Private</option>
                                </select>
                                <input
                                  type="text"
                                  value={newPost.meta.tech_stack}
                                  onChange={(e) => setNewPost({ ...newPost, meta: { ...newPost.meta, tech_stack: e.target.value } })}
                                  className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none"
                                  placeholder="Tech Stack"
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                  type="text"
                                  value={newPost.meta.project_url}
                                  onChange={(e) => setNewPost({ ...newPost, meta: { ...newPost.meta, project_url: e.target.value } })}
                                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none"
                                  placeholder="Project Live URL (Domain)"
                                />
                                <input
                                  type="text"
                                  value={newPost.meta.github_url}
                                  onChange={(e) => setNewPost({ ...newPost, meta: { ...newPost.meta, github_url: e.target.value } })}
                                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none"
                                  placeholder="GitHub URL"
                                />
                              </div>
                              <div className="space-y-4">
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Deep Dive Details</label>
                                <textarea
                                  value={newPost.meta.challenge || ''}
                                  onChange={(e) => setNewPost({ ...newPost, meta: { ...newPost.meta, challenge: e.target.value } })}
                                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none h-20"
                                  placeholder="Challenge - What problem did you solve?"
                                />
                                <textarea
                                  value={newPost.meta.solution || ''}
                                  onChange={(e) => setNewPost({ ...newPost, meta: { ...newPost.meta, solution: e.target.value } })}
                                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none h-20"
                                  placeholder="Solution - How did you solve it?"
                                />
                                <textarea
                                  value={newPost.meta.impact || ''}
                                  onChange={(e) => setNewPost({ ...newPost, meta: { ...newPost.meta, impact: e.target.value } })}
                                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none h-20"
                                  placeholder="Impact - What was the business impact?"
                                />
                                <textarea
                                  value={newPost.meta.architecture || ''}
                                  onChange={(e) => setNewPost({ ...newPost, meta: { ...newPost.meta, architecture: e.target.value } })}
                                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none h-20"
                                  placeholder="Architecture - Technical approach used"
                                />
                              </div>
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-emerald-500 text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                              >
                                {isSubmitting ? <Activity className="w-4 h-4 animate-spin" /> : (editingId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
                                {editingId ? 'Update' : 'Publish'}
                              </button>
                            </form>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Existing Items</h3>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Search..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-[10px] outline-none focus:border-emerald-500 w-32 md:w-48"
                                />
                              </div>
                            </div>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                              {(adminModule === 'projects' ? projects : snippets)
                                .filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.content.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(post => (
                                  <div key={post.id} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/30 group">
                                    <div className="truncate flex-1 mr-4">
                                      <h4 className="text-sm font-bold truncate">{post.title}</h4>
                                      <p className="text-[10px] text-zinc-500">{post.status}</p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => handleMovePost(post.id, 'up')}
                                        disabled={post.sort_order === 0}
                                        className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Move up"
                                      >
                                        <ChevronUp className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleMovePost(post.id, 'down')}
                                        disabled={post.sort_order === projects.length - 1}
                                        className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Move down"
                                      >
                                        <ChevronDown className="w-3.5 h-3.5" />
                                      </button>
                                      <button onClick={() => startEditing(post)} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-emerald-400"><Edit3 className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => handleDeletePost(post.id)} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Experience Module */}
                      {adminModule === 'experience' && (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                              {editingExpId ? 'Edit Experience' : 'Add New'}
                            </h3>
                            <form onSubmit={handleCreateExperience} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <input required type="text" value={newExperience.company} onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Company" />
                                <input required type="text" value={newExperience.role} onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Role" />
                              </div>
                              <input required type="text" value={newExperience.period} onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Period" />
                              <textarea required rows={3} value={newExperience.description} onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Description" />
                              <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-500 text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                                {isSubmitting ? <Activity className="w-4 h-4 animate-spin" /> : (editingExpId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
                                {editingExpId ? 'Update' : 'Add Experience'}
                              </button>
                            </form>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Experience List</h3>
                              <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-[10px] outline-none focus:border-emerald-500 w-32 md:w-48"
                              />
                            </div>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                              {experience
                                .filter(exp => exp.role.toLowerCase().includes(searchTerm.toLowerCase()) || exp.company.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(exp => (
                                  <div key={exp.id} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/30 group">
                                    <div className="truncate flex-1 mr-4">
                                      <h4 className="text-sm font-bold truncate">{exp.role} @ {exp.company}</h4>
                                      <p className="text-[10px] text-zinc-500">{exp.period}</p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => handleMoveExperience(exp.id, 'up')}
                                        disabled={exp.sort_order === 0}
                                        className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Move up"
                                      >
                                        <ChevronUp className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleMoveExperience(exp.id, 'down')}
                                        disabled={exp.sort_order === experience.length - 1}
                                        className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Move down"
                                      >
                                        <ChevronDown className="w-3.5 h-3.5" />
                                      </button>
                                      <button onClick={() => { setEditingExpId(exp.id); setNewExperience(exp); }} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-emerald-400"><Edit3 className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => handleDeleteExperience(exp.id)} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Skills Module */}
                      {adminModule === 'skills' && (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                              {editingSkillId ? 'Edit Skill' : 'Add New'}
                            </h3>
                            <form onSubmit={handleCreateSkill} className="space-y-4">
                              <select value={newSkill.category} onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as any })} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none">
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="devops">DevOps</option>
                                <option value="additional">Additional</option>
                              </select>
                              <input required type="text" value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Skill Name" />
                              <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-500 text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                                {isSubmitting ? <Activity className="w-4 h-4 animate-spin" /> : (editingSkillId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
                                {editingSkillId ? 'Update' : 'Add Skill'}
                              </button>
                            </form>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Skills List</h3>
                              <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-[10px] outline-none focus:border-emerald-500 w-32 md:w-48"
                              />
                            </div>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                              {skills
                                .filter(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()) || skill.category.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(skill => (
                                  <div key={skill.id} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/30 group">
                                    <div className="flex items-center gap-3 flex-1 mr-4">
                                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700 uppercase">{skill.category}</span>
                                      <h4 className="text-sm font-bold truncate">{skill.name}</h4>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => { setEditingSkillId(skill.id); setNewSkill(skill); }} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-emerald-400"><Edit3 className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => handleDeleteSkill(skill.id)} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Certifications Module */}
                      {adminModule === 'certifications' && (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                              {editingCertId ? 'Edit Certification' : 'Add New'}
                            </h3>
                            <form onSubmit={handleCreateCertification} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <input required type="text" value={newCertification.name} onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Cert Name" />
                                <input required type="text" value={newCertification.issuer} onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Issuer" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <input required type="text" value={newCertification.date} onChange={(e) => setNewCertification({ ...newCertification, date: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Date (e.g. 2024)" />
                                <input type="text" value={newCertification.url || ''} onChange={(e) => setNewCertification({ ...newCertification, url: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Cert URL (optional)" />
                              </div>
                              <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-500 text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                                {isSubmitting ? <Activity className="w-4 h-4 animate-spin" /> : (editingCertId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
                                {editingCertId ? 'Update' : 'Add Certification'}
                              </button>
                            </form>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Certifications List</h3>
                              <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-[10px] outline-none focus:border-emerald-500 w-32 md:w-48"
                              />
                            </div>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                              {certifications
                                .filter(cert => cert.name.toLowerCase().includes(searchTerm.toLowerCase()) || cert.issuer.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(cert => (
                                  <div key={cert.id} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/30 group">
                                    <div className="flex items-center gap-3 flex-1 mr-4">
                                      <Award className="w-4 h-4 text-emerald-500" />
                                      <div className="truncate">
                                        <h4 className="text-sm font-bold truncate">{cert.name}</h4>
                                        <p className="text-[10px] text-zinc-500">{cert.issuer} • {cert.date}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => { setEditingCertId(cert.id); setNewCertification(cert); }} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-emerald-400"><Edit3 className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => handleDeleteCertification(cert.id)} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Messages Module */}
                    {adminModule === 'messages' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Inbox</h3>
                          <input 
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-xs outline-none focus:border-emerald-500 w-64"
                          />
                        </div>
                        {messages.length === 0 ? (
                          <div className="text-center py-12 text-zinc-500 italic">No messages yet.</div>
                        ) : (
                          <div className="grid grid-cols-1 gap-4">
                            {messages
                              .filter(msg => msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) || msg.message.toLowerCase().includes(searchTerm.toLowerCase()))
                              .sort((a, b) => b.id - a.id)
                              .map(msg => (
                              <div key={msg.id} className={`p-6 rounded-2xl border transition-all ${msg.status === 'unread' ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-zinc-800/30 border-zinc-700/30'}`}>
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${msg.status === 'unread' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                                    <h4 className="font-bold text-zinc-100">{msg.name}</h4>
                                    <span className="text-[10px] text-zinc-500 font-mono">{new Date(msg.created_at).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {msg.status === 'unread' && (
                                      <button onClick={() => handleMarkAsRead(msg.id)} className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-500"><CheckCircle2 className="w-4 h-4" /></button>
                                    )}
                                    <button onClick={() => handleDeleteMessage(msg.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                                </div>
                                <p className="text-[10px] text-zinc-500 mb-2 font-bold uppercase tracking-widest">{msg.subject}</p>
                                <p className="text-zinc-400 text-sm leading-relaxed mb-4">{msg.message}</p>
                                <div className="pt-4 border-t border-zinc-800/50">
                                  <a href={`mailto:${msg.email}`} className="text-xs text-emerald-500 hover:underline">{msg.email}</a>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
    </>
  );
}
