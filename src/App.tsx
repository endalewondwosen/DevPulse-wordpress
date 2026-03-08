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
  LogOut,
  Edit3,
  Trash2,
  X,
  Eye,
  EyeOff,
  Plus,
  Briefcase,
  Wrench,
  Award,
  Mail,
  Send,
  CheckCircle2,
  MessageSquare,
  Menu,
  Linkedin,
  Phone,
  BarChart3,
  PieChart as PieChartIcon,
  Settings,
  Sparkles,
  Inbox,
  Layers,
  Upload,
  Download,
  FileText,
  Sun,
  Moon,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import Markdown from 'react-markdown';

import { ProjectCard } from './components/ProjectCard';
import { SnippetItem } from './components/SnippetItem';
import { Post, Experience, Skill, Message, Stat, Certification } from './types';

export default function App() {
  const [projects, setProjects] = useState<Post[]>([]);
  const [snippets, setSnippets] = useState<Post[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'snippets' | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('devpulse_token'));
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'project' as 'project' | 'snippet',
    status: 'publish' as 'publish' | 'private',
    image_url: '',
    meta: {
      github_url: '',
      project_url: '',
      tech_stack: '',
      language: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('devpulse_theme') as 'light' | 'dark' || 'dark';
    }
    return 'dark';
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Experience & Skills Management State
  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({
    company: '',
    role: '',
    period: '',
    description: '',
    sort_order: 0
  });
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({
    category: 'frontend',
    name: '',
    sort_order: 0
  });
  const [editingExpId, setEditingExpId] = useState<number | null>(null);
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
  const [newCertification, setNewCertification] = useState<Omit<Certification, 'id'>>({
    name: '',
    issuer: '',
    date: '',
    url: '',
    sort_order: 0
  });
  const [editingCertId, setEditingCertId] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [adminModule, setAdminModule] = useState<'overview' | 'projects' | 'snippets' | 'experience' | 'skills' | 'certifications' | 'messages'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [geminiReport, setGeminiReport] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    localStorage.setItem('devpulse_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [token, searchQuery]);

  useEffect(() => {
    if (activeTab !== 'home') return;

    const options = {
      root: null,
      rootMargin: '-80px 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    const sections = ['about', 'skills', 'experience', 'certifications', 'contact'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers: any = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';

      const [projRes, snipRes, expRes, skillRes, certRes, statRes, msgRes] = await Promise.all([
        fetch(`/api/posts?type=project${searchParam}`, { headers }),
        fetch(`/api/posts?type=snippet${searchParam}`, { headers }),
        fetch('/api/experience'),
        fetch('/api/skills'),
        fetch('/api/certifications'),
        fetch('/api/stats'),
        token ? fetch('/api/messages', { headers }) : Promise.resolve(null)
      ]);
      
      const [projData, snipData, expData, skillData, certData, statData, msgData] = await Promise.all([
        processResponse(projRes),
        processResponse(snipRes),
        processResponse(expRes),
        processResponse(skillRes),
        processResponse(certRes),
        processResponse(statRes),
        msgRes ? processResponse(msgRes) : Promise.resolve([])
      ]);

      setProjects(projData);
      setSnippets(snipData);
      setExperience(expData);
      setSkills(skillData);
      setCertifications(certData);
      setStats(statData);
      setMessages(msgData);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      // Only show notification if it's not a background refresh
      if (activeTab !== 'admin') {
        setNotification({ message: `Data sync error: ${error.message}`, type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const processResponse = async (res: Response) => {
    const contentType = res.headers.get("content-type");
    
    if (res.status === 401 || res.status === 403) {
      const isAuthAction = res.url.includes('/api/login');
      if (!isAuthAction && token) {
        console.warn("Authentication failure, clearing token");
        localStorage.removeItem('devpulse_token');
        setToken(null);
        setNotification({ message: "Session expired. Please login again.", type: 'error' });
      }
    }

    if (!res.ok) {
      let errorMsg = `Error ${res.status}: ${res.statusText}`;
      try {
        if (contentType && contentType.includes("application/json")) {
          const errData = await res.json();
          errorMsg = errData.error || errData.message || errorMsg;
        } else {
          const text = await res.text();
          console.error("Non-JSON error response:", text);
        }
      } catch (e) {
        console.error("Error parsing error response:", e);
      }
      throw new Error(errorMsg);
    }

    if (contentType && contentType.includes("application/json")) {
      return res.json();
    } else {
      const text = await res.text();
      console.error("Expected JSON but got:", text.substring(0, 100));
      throw new Error("Invalid response format from server");
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
        setNotification({ message: "Authenticated successfully", type: 'success' });
      } else {
        setNotification({ message: data.error || "Invalid credentials", type: 'error' });
      }
    } catch (error) {
      console.error("Login error:", error);
      setNotification({ message: "Connection error during login", type: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('devpulse_token');
    setToken(null);
    setNotification({ message: "Logged out", type: 'success' });
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);

    try {
      const url = editingId ? `/api/posts/${editingId}` : '/api/posts';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPost)
      });

      await processResponse(res);

      setNewPost({
        title: '',
        content: '',
        type: 'project',
        status: 'publish',
        image_url: '',
        meta: { github_url: '', project_url: '', tech_stack: '', language: '' }
      });
      setEditingId(null);
      fetchData();
      setNotification({ 
        message: editingId ? "Content updated successfully!" : "Content published successfully!", 
        type: 'success' 
      });
    } catch (error: any) {
      console.error("Error saving post:", error);
      setNotification({ message: error.message || "Failed to process request", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!token || !window.confirm("Are you sure you want to delete this content? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      await processResponse(res);
      fetchData();
      setNotification({ message: "Content deleted successfully", type: 'success' });
    } catch (error: any) {
      console.error("Delete error:", error);
      setNotification({ message: error.message || "Failed to delete content", type: 'error' });
    }
  };

  // Experience Handlers
  const handleCreateExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      const url = editingExpId ? `/api/experience/${editingExpId}` : '/api/experience';
      const method = editingExpId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newExperience)
      });
      await processResponse(res);
      setNewExperience({ company: '', role: '', period: '', description: '', sort_order: 0 });
      setEditingExpId(null);
      fetchData();
      setNotification({ message: editingExpId ? "Experience updated" : "Experience added", type: 'success' });
    } catch (error: any) {
      console.error("Error saving experience:", error);
      setNotification({ message: error.message || "Failed to save experience", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExperience = async (id: number) => {
    if (!token || !window.confirm('Delete this experience entry?')) return;
    try {
      const res = await fetch(`/api/experience/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await processResponse(res);
      fetchData();
      setNotification({ message: "Experience deleted", type: 'success' });
    } catch (error: any) {
      console.error("Error deleting experience:", error);
      setNotification({ message: error.message || "Failed to delete experience", type: 'error' });
    }
  };

  // Skills Handlers
  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      const url = editingSkillId ? `/api/skills/${editingSkillId}` : '/api/skills';
      const method = editingSkillId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSkill)
      });
      await processResponse(res);
      setNewSkill({ category: 'frontend', name: '', sort_order: 0 });
      setEditingSkillId(null);
      fetchData();
      setNotification({ message: editingSkillId ? "Skill updated" : "Skill added", type: 'success' });
    } catch (error: any) {
      console.error("Error saving skill:", error);
      setNotification({ message: error.message || "Failed to save skill", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!token || !window.confirm('Delete this skill?')) return;
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await processResponse(res);
      fetchData();
      setNotification({ message: "Skill deleted", type: 'success' });
    } catch (error: any) {
      console.error("Error deleting skill:", error);
      setNotification({ message: error.message || "Failed to delete skill", type: 'error' });
    }
  };

  // Certifications Handlers
  const handleCreateCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      const url = editingCertId ? `/api/certifications/${editingCertId}` : '/api/certifications';
      const method = editingCertId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCertification)
      });
      await processResponse(res);
      setNewCertification({ name: '', issuer: '', date: '', url: '', sort_order: 0 });
      setEditingCertId(null);
      fetchData();
      setNotification({ message: editingCertId ? "Certification updated" : "Certification added", type: 'success' });
    } catch (error: any) {
      console.error("Error saving certification:", error);
      setNotification({ message: error.message || "Failed to save certification", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCertification = async (id: number) => {
    if (!token || !window.confirm('Delete this certification?')) return;
    try {
      const res = await fetch(`/api/certifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await processResponse(res);
      fetchData();
      setNotification({ message: "Certification deleted", type: 'success' });
    } catch (error: any) {
      console.error("Error deleting certification:", error);
      setNotification({ message: error.message || "Failed to delete certification", type: 'error' });
    }
  };

  // Contact Handlers
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      const data = await processResponse(res);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setNotification({ message: data.message, type: 'success' });
    } catch (error: any) {
      console.error("Contact submit error:", error);
      setNotification({ message: error.message || "Failed to send message", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/messages/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await processResponse(res);
      fetchData();
    } catch (error: any) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    if (file.size > 5 * 1024 * 1024) {
      setNotification({ message: "File too large (max 5MB)", type: 'error' });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      const data = await processResponse(res);
      setNewPost({ ...newPost, image_url: data.url });
      setNotification({ message: "Image uploaded successfully", type: 'success' });
    } catch (error: any) {
      console.error("Upload error:", error);
      setNotification({ message: error.message || "Upload failed", type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await processResponse(res);
      fetchData();
      setNotification({ message: "Message deleted", type: 'success' });
    } catch (error: any) {
      console.error("Error deleting message:", error);
      setNotification({ message: error.message || "Failed to delete message", type: 'error' });
    }
  };

  const generateGeminiReport = async () => {
    setIsGeneratingReport(true);
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
          parts: [{
            text: `As a portfolio analytics assistant, analyze the following data and provide a concise, professional summary report for the developer. 
            Data:
            - Projects: ${projects.length}
            - Snippets: ${snippets.length}
            - Total Messages: ${messages.length} (${messages.filter(m => m.status === 'unread').length} unread)
            - Top Skills: ${skills.map(s => s.name).join(', ')}
            - API Activity: ${JSON.stringify(stats)}
            
            Provide insights on portfolio engagement, content balance, and suggestions for improvement. Format the output in Markdown.`
          }]
        }]
      });
      setGeminiReport(response.text || 'No report generated.');
    } catch (err) {
      console.error('Gemini report error:', err);
      setGeminiReport('Failed to generate report. Please check your API key.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const startEditing = (post: Post) => {
    setEditingId(post.id);
    setNewPost({
      title: post.title,
      content: post.content,
      type: post.type,
      status: post.status,
      image_url: post.image_url || '',
      meta: {
        github_url: post.meta.github_url || '',
        project_url: post.meta.project_url || '',
        tech_stack: post.meta.tech_stack || '',
        language: post.meta.language || ''
      }
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReorderProject = async (projectId: number, direction: 'up' | 'down') => {
    try {
      const res = await fetch(`/api/posts/${projectId}/reorder`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ id: projectId, direction })
      });
      
      if (res.ok) {
        fetchData(); // Refresh the projects list
        setNotification({ message: "Project reordered successfully!", type: 'success' });
      } else {
        throw new Error('Failed to reorder project');
      }
    } catch (error: any) {
      setNotification({ message: error.message || "Failed to reorder project", type: 'error' });
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewPost({
      title: '',
      content: '',
      type: 'project',
      status: 'publish',
      image_url: '',
      meta: { github_url: '', project_url: '', tech_stack: '', language: '' }
    });
  };

  const navItems = [
    { name: 'About', id: 'about', type: 'scroll' },
    { name: 'Skills', id: 'skills', type: 'scroll' },
    { name: 'Projects', id: 'projects', type: 'tab' },
    { name: 'Experience', id: 'experience', type: 'scroll' },
    { name: 'Contact', id: 'contact', type: 'scroll' },
  ];

  const handleNavClick = (item: { name: string, id: string, type: string }) => {
    setIsMenuOpen(false);
    if (item.type === 'tab') {
      setActiveTab(item.id as any);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (activeTab !== 'home') {
        setActiveTab('home');
        setTimeout(() => {
          const element = document.getElementById(item.id);
          if (element) {
            const offset = 80; // Header height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else {
        const element = document.getElementById(item.id);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold tracking-tight text-xl">Wondwosen Endale</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`text-sm font-medium transition-colors ${
                  (item.type === 'tab' && activeTab === item.id) || 
                  (item.type === 'scroll' && activeTab === 'home' && activeSection === item.id)
                    ? 'text-emerald-500'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => setActiveTab('snippets')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'snippets' ? 'text-emerald-500' : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Snippets
            </button>
          </div>

          <div className="flex items-center gap-4">
            {token && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`hidden md:flex items-center gap-2 text-sm font-medium transition-colors ${
                  activeTab === 'admin' ? 'text-emerald-500' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            )}
            
            <div className="h-4 w-px bg-zinc-800 hidden md:block" />

            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-zinc-900/50 text-zinc-400 hover:text-emerald-500 transition-colors border border-zinc-800"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {token ? (
              <button 
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 text-zinc-400 hover:text-zinc-100 text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <button 
                onClick={() => setShowLogin(true)}
                className="hidden md:flex items-center gap-2 text-zinc-400 hover:text-zinc-100 text-sm transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-zinc-800 bg-zinc-900 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className="text-left text-lg font-medium text-zinc-400 hover:text-emerald-500 transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setActiveTab('snippets');
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-lg font-medium text-zinc-400 hover:text-emerald-500 transition-colors"
                >
                  Snippets
                </button>
                <div className="h-px bg-zinc-800 my-2" />
                {token ? (
                  <>
                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-lg font-medium text-zinc-400 hover:text-emerald-500 transition-colors"
                    >
                      <Activity className="w-5 h-5" />
                      Dashboard
                    </button>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-lg font-medium text-zinc-400 hover:text-emerald-500 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      setShowLogin(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-lg font-medium text-zinc-400 hover:text-emerald-500 transition-colors"
                  >
                    <Lock className="w-5 h-5" />
                    Login
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 z-[200] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
              notification.type === 'success' 
                ? 'bg-emerald-500 text-black border-emerald-400' 
                : 'bg-red-500 text-white border-red-400'
            }`}
          >
            {notification.type === 'success' ? <Activity className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span className="font-bold text-sm">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-24"
            >
              {/* Hero Section */}
              <section id="about" className="py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="max-w-2xl order-2 lg:order-1">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold tracking-widest uppercase mb-6"
                    >
                      <Activity className="w-3 h-3" />
                      Available for Architecture & Development
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
                      Wondwosen <span className="text-emerald-500">Endale.</span>
                    </h1>
                    <p className="text-zinc-400 text-xl md:text-2xl leading-relaxed mb-10">
                      Full Stack Developer with 2 years of experience building scalable web applications using React and Next.js. 
                      Optimizing Core Web Vitals and driving front-end architecture decisions.
                    </p>
                    
                    {/* CV Viewer Section */}
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6 mb-8">
                      <h3 className="text-xl font-bold mb-4 text-emerald-500 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        My CV / Resume
                      </h3>
                      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                        <iframe
                          src="/resume.pdf"
                          className="w-full h-[600px] border-0"
                          title="My CV PDF"
                        />
                        <div className="p-4 bg-zinc-50">
                          <p className="text-sm text-zinc-600 mb-4">
                            Download my full CV to learn more about my experience and qualifications.
                          </p>
                          <a 
                            href="/api/resume/download"
                            download
                            className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-400 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download CV
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => setActiveTab('projects')}
                        className="bg-emerald-500 text-black font-bold px-8 py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                      >
                        View Case Studies
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <a 
                        href="/api/resume/download"
                        download
                        className="bg-zinc-800 text-zinc-100 font-bold px-8 py-4 rounded-2xl hover:bg-zinc-700 transition-all border border-zinc-700 flex items-center gap-2"
                      >
                        Download Resume
                      </a>
                    </div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="order-1 lg:order-2 relative"
                  >
                    <div className="relative z-10 w-full aspect-square max-w-[450px] mx-auto">
                      {/* Decorative elements */}
                      <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl rounded-full opacity-50 animate-pulse" />
                      <div className="absolute -top-6 -right-6 w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center shadow-2xl z-20 hidden md:flex">
                        <div className="text-center">
                          <span className="block text-2xl font-bold text-emerald-500">2+</span>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Years Exp.</span>
                        </div>
                      </div>
                      
                      {/* Main Image Container */}
                      <div className="w-full h-full rounded-[3rem] overflow-hidden border-2 border-zinc-800 bg-zinc-900 relative group">
                        <img 
                          src="/profile.jpg" 
                          alt="Wondwosen Endale" 
                          className="w-full h-full object-cover transition-all duration-700 scale-110 group-hover:scale-100"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800&h=800";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Floating Tech Badges */}
                      <div className="absolute -bottom-4 -left-4 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl shadow-2xl z-20 flex items-center gap-3">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-bold border border-zinc-900">TS</div>
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] font-bold border border-zinc-900 text-black">R</div>
                          <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-[8px] font-bold border border-zinc-900 text-black">N</div>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Stack</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Skills Matrix */}
              <section id="skills" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { id: 'frontend', title: 'Frontend Engineering', icon: <Layout className="w-6 h-6 text-emerald-500" />, color: 'emerald', desc: 'Crafting immersive, accessible user experiences with modern web technologies.' },
                  { id: 'backend', title: 'Backend & Systems', icon: <Cpu className="w-6 h-6 text-blue-500" />, color: 'blue', desc: 'Designing robust APIs and microservices using scalable backend patterns.' },
                  { id: 'devops', title: 'DevOps & Cloud', icon: <Terminal className="w-6 h-6 text-purple-500" />, color: 'purple', desc: 'Automating deployment pipelines and managing cloud infrastructure.' },
                  { id: 'additional', title: 'Additional Tech', icon: <Sparkles className="w-6 h-6 text-amber-500" />, color: 'amber', desc: 'Exploring emerging technologies and specialized tools for modern development.' }
                ].map((cat) => (
                  <div key={cat.id} className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                    <div className={`w-12 h-12 bg-${cat.color}-500/10 rounded-2xl flex items-center justify-center mb-6`}>
                      {cat.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{cat.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                      {cat.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {skills.filter(s => s.category === cat.id).map(s => (
                        <span key={s.id} className="text-[10px] font-bold px-2 py-1 bg-zinc-800 rounded-md text-zinc-400 border border-zinc-700">{s.name}</span>
                      ))}
                      {skills.filter(s => s.category === cat.id).length === 0 && (
                        <span className="text-[10px] text-zinc-600 italic">No skills added yet</span>
                      )}
                    </div>
                  </div>
                ))}
              </section>

              {/* Experience Timeline */}
              <section id="experience" className="space-y-12">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-bold tracking-tight">Professional Journey</h2>
                  <div className="h-px flex-1 bg-zinc-800" />
                </div>
                <div className="space-y-8">
                  {experience.length === 0 ? (
                    <p className="text-zinc-500 italic">Experience history will appear here once added in admin.</p>
                  ) : (
                    experience.map((exp) => (
                      <div key={exp.id} className="relative pl-8 border-l border-zinc-800 group">
                        <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:bg-emerald-500 transition-colors" />
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                          <h4 className="text-xl font-bold text-zinc-100">{exp.role}</h4>
                          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{exp.period}</span>
                        </div>
                        <p className="text-emerald-500 font-medium text-sm mb-2">{exp.company}</p>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">{exp.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Certifications & Expertise */}
              <section id="certifications" className="space-y-12">
                <div className="flex items-center gap-6">
                  <h2 className="text-3xl font-bold tracking-tight">Certifications & Expertise</h2>
                  <div className="h-px flex-1 bg-zinc-800" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certifications.length === 0 ? (
                    <p className="text-zinc-500 italic col-span-full">Certifications will appear here once added in admin.</p>
                  ) : (
                    certifications.map((cert) => (
                      <div key={cert.id} className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all">
                            <Award className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{cert.date}</span>
                        </div>
                        <h4 className="text-lg font-bold mb-1 group-hover:text-emerald-500 transition-colors">{cert.name}</h4>
                        <p className="text-zinc-500 text-sm mb-4">{cert.issuer}</p>
                        {cert.url && cert.url !== '#' && (
                          <a 
                            href={cert.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
                          >
                            View Certificate <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Contact CTA */}
              <section id="contact" className="bg-emerald-500 rounded-[2rem] p-8 md:p-12 text-black relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Let's build something <br /> extraordinary together.</h2>
                    <p className="text-black/70 text-lg mb-8 font-medium">
                      Currently accepting new projects and architectural consulting engagements. 
                      Reach out to discuss your vision.
                    </p>
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest opacity-50">Email Me</p>
                          <a href="mailto:endalewondwosen@gmail.com" className="font-bold hover:underline">endalewondwosen@gmail.com</a>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center">
                          <Phone className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest opacity-50">Call Me</p>
                          <a href="tel:+251955143592" className="font-bold hover:underline">+251 955 143 592</a>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center">
                          <Linkedin className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest opacity-50">LinkedIn</p>
                          <a href="https://www.linkedin.com/in/wondwosen-endale-498a86280" target="_blank" rel="noreferrer" className="font-bold hover:underline">linkedin.com/in/wondwosen</a>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center">
                          <Github className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest opacity-50">GitHub</p>
                          <a href="https://github.com" target="_blank" rel="noreferrer" className="font-bold hover:underline">github.com/wondwosen</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Name</label>
                          <input 
                            required
                            type="text"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-black/30 placeholder:text-black/30"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Email</label>
                          <input 
                            required
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-black/30 placeholder:text-black/30"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Subject</label>
                        <input 
                          type="text"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-black/30 placeholder:text-black/30"
                          placeholder="Project Inquiry"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Message</label>
                        <textarea 
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-black/30 placeholder:text-black/30"
                          placeholder="Tell me about your project..."
                        />
                      </div>
                      <button 
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-zinc-900 transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? <Activity className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Send Message
                      </button>
                    </form>
                  </div>
                </div>
                <div className="absolute right-[-10%] bottom-[-20%] opacity-10">
                  <Terminal className="w-[400px] h-[400px]" />
                </div>
              </section>
            </motion.div>
          )}

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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[600px]"
            >
              {!token ? (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 border border-zinc-700">
                    <Lock className="w-10 h-10 text-zinc-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Command Center Locked</h3>
                  <p className="text-zinc-400 mb-8 max-w-sm">
                    This area is restricted to authorized developers. Please authenticate to manage your portfolio and view analytics.
                  </p>
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="bg-emerald-500 text-black font-bold px-10 py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    Login as Admin
                  </button>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Admin Sidebar */}
                  <div className="w-full lg:w-64 flex flex-col gap-2">
                    {[
                      { id: 'overview', name: 'Overview', icon: BarChart3 },
                      { id: 'projects', name: 'Projects', icon: Box },
                      { id: 'snippets', name: 'Snippets', icon: Terminal },
                      { id: 'experience', name: 'Experience', icon: Briefcase },
                      { id: 'skills', name: 'Skills', icon: Wrench },
                      { id: 'certifications', name: 'Certifications', icon: Award },
                      { id: 'messages', name: 'Inbox', icon: Inbox },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setAdminModule(item.id as any)}
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
                              setNewPost({ title: '', content: '', type: adminModule === 'projects' ? 'project' : 'snippet', status: 'publish', image_url: '', meta: { github_url: '', project_url: '', tech_stack: '', language: '' } });
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
                                  <span className="text-zinc-300 truncate flex-1">{item.title}</span>
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

                    {/* Projects & Snippets Module */}
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
                              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 outline-none"
                              placeholder="Title"
                            />
                            <textarea 
                              rows={3}
                              value={newPost.content}
                              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 outline-none"
                              placeholder="Description"
                            />
                            <div className="relative group/upload">
                              <input 
                                type="text"
                                value={newPost.image_url}
                                onChange={(e) => setNewPost({...newPost, image_url: e.target.value})}
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
                                onChange={(e) => setNewPost({...newPost, status: e.target.value as any})}
                                className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none"
                              >
                                <option value="publish">Public</option>
                                <option value="private">Private</option>
                              </select>
                              <input 
                                type="text"
                                value={newPost.meta.tech_stack}
                                onChange={(e) => setNewPost({...newPost, meta: {...newPost.meta, tech_stack: e.target.value}})}
                                className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none"
                                placeholder="Tech Stack"
                              />
                            </div>
                            <input 
                              type="text"
                              value={newPost.meta.github_url}
                              onChange={(e) => setNewPost({...newPost, meta: {...newPost.meta, github_url: e.target.value}})}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none"
                              placeholder="GitHub URL"
                            />
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
                                  <button onClick={() => handleReorderProject(post.id, 'up')} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-emerald-400"><ChevronUp className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => handleReorderProject(post.id, 'down')} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-emerald-400"><ChevronDown className="w-3.5 h-3.5" /></button>
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
                              <input required type="text" value={newExperience.company} onChange={(e) => setNewExperience({...newExperience, company: e.target.value})} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Company" />
                              <input required type="text" value={newExperience.role} onChange={(e) => setNewExperience({...newExperience, role: e.target.value})} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Role" />
                            </div>
                            <input required type="text" value={newExperience.period} onChange={(e) => setNewExperience({...newExperience, period: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Period" />
                            <textarea required rows={3} value={newExperience.description} onChange={(e) => setNewExperience({...newExperience, description: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Description" />
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
                            <select value={newSkill.category} onChange={(e) => setNewSkill({...newSkill, category: e.target.value as any})} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none">
                              <option value="frontend">Frontend</option>
                              <option value="backend">Backend</option>
                              <option value="devops">DevOps</option>
                              <option value="additional">Additional</option>
                            </select>
                            <input required type="text" value={newSkill.name} onChange={(e) => setNewSkill({...newSkill, name: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Skill Name" />
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
                              <input required type="text" value={newCertification.name} onChange={(e) => setNewCertification({...newCertification, name: e.target.value})} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Cert Name" />
                              <input required type="text" value={newCertification.issuer} onChange={(e) => setNewCertification({...newCertification, issuer: e.target.value})} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Issuer" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <input required type="text" value={newCertification.date} onChange={(e) => setNewCertification({...newCertification, date: e.target.value})} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Date (e.g. 2024)" />
                              <input type="text" value={newCertification.url || ''} onChange={(e) => setNewCertification({...newCertification, url: e.target.value})} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Cert URL (optional)" />
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

// Removed ProjectCard and SnippetItem as they are now in separate files
