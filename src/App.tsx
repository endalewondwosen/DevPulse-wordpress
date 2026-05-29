import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { AIChatAssistant } from './components/AIChatAssistant';
import { ProjectDeepDive } from './components/ProjectDeepDive';
import { SnippetDeepDive } from './components/SnippetDeepDive';
import { ResumeDrawer } from './components/ResumeDrawer';
import { RecruiterConsole } from './components/RecruiterConsole';
import { MobileCtaBar } from './components/MobileCtaBar';
import { HomeTab } from './components/tabs/HomeTab';
import { ProjectsTab } from './components/tabs/ProjectsTab';
import { SnippetsTab } from './components/tabs/SnippetsTab';
import { AdminTab, type AdminModule } from './components/admin/AdminTab';
import { SiteNav } from './components/layout/SiteNav';
import { PageHeader } from './components/layout/PageHeader';
import { NotificationToast } from './components/layout/NotificationToast';
import { LoginModal } from './components/layout/LoginModal';
import { Footer } from './components/sections/Footer';

import { Post, Experience, Skill, Message, Stat, Certification } from './types';

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
const SHOW_ADMIN_LOGIN = import.meta.env.VITE_SHOW_ADMIN_LOGIN === 'true';
const apiUrl = (p: string) => {
  if (!API_BASE) return p;
  const path = p.startsWith('/') ? p : `/${p}`;
  return `${API_BASE}${path}`;
};
const apiFetch: typeof fetch = (input: any, init?: any) => {
  if (typeof input === 'string') return fetch(apiUrl(input), init);
  return fetch(input, init);
};

export default function App() {
  const [projects, setProjects] = useState<Post[]>([]);
  const [snippets, setSnippets] = useState<Post[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [isResumeDrawerOpen, setIsResumeDrawerOpen] = useState(false);
  const [isRecruiterConsoleOpen, setIsRecruiterConsoleOpen] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({
    profile_image: '/profile.png',
    resume_url: '/resume.pdf',
    site_title: 'Wondwosen Endale Portifolio',
    hero_title: 'Architecting Digital Excellence',
    hero_subtitle: 'Full Stack Engineer & System Architect',
    contact_email: 'endalewondwosen@gmail.com'
  });
  const [loading, setLoading] = useState(true);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Connecting to database...');
  const [showSlowConnectionWarning, setShowSlowConnectionWarning] = useState(false);
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
    sort_order: 0,
    meta: {
      github_url: '',
      project_url: '',
      tech_stack: '',
      language: '',
      challenge: '',
      solution: '',
      impact: '',
      architecture: ''
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
  const [adminModule, setAdminModule] = useState<AdminModule>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [geminiReport, setGeminiReport] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Post | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState<Post | null>(null);

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

  const fetchData = async (retryCount = 0) => {
    if (retryCount === 0) {
      setLoading(true);
      setLoadingMessage('Connecting to database...');
      setShowSlowConnectionWarning(false);
    }

    // Set up timeout for slow connections
    const timeoutId = setTimeout(() => {
      if (retryCount === 0) {
        setIsWakingUp(true);
        setLoadingMessage('Almost there — preparing your experience...');
        setShowSlowConnectionWarning(true);
      }
    }, 3000); // Show warning after 3 seconds

    try {
      const headers: any = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';

      setLoadingMessage('Fetching portfolio data...');

      const [projRes, snipRes, expRes, skillRes, certRes, statRes, settingsRes, msgRes] = await Promise.all([
        apiFetch(`/api/posts?type=project${searchParam}`, { headers }),
        apiFetch(`/api/posts?type=snippet${searchParam}`, { headers }),
        apiFetch('/api/experience'),
        apiFetch('/api/skills'),
        apiFetch('/api/certifications'),
        apiFetch('/api/stats'),
        apiFetch('/api/settings'),
        token ? apiFetch('/api/messages', { headers }) : Promise.resolve(null)
      ]);

      setLoadingMessage('Processing data...');

      const [projData, snipData, expData, skillData, certData, statData, settingsData, msgData] = await Promise.all([
        processResponse(projRes),
        processResponse(snipRes),
        processResponse(expRes),
        processResponse(skillRes),
        processResponse(certRes),
        processResponse(statRes),
        processResponse(settingsRes),
        msgRes ? processResponse(msgRes) : Promise.resolve([])
      ]);

      setProjects(projData);
      setSnippets(snipData);
      setExperience(expData);
      setSkills(skillData);
      setCertifications(certData);
      setStats(statData);
      setSettings((prev) => ({ ...prev, ...settingsData }));
      setMessages(msgData);

      clearTimeout(timeoutId);
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Error fetching data:", error);

      // Retry logic for network errors (common with cold starts)
      if (retryCount < 2 && (error.message.includes('fetch') || error.message.includes('network'))) {
        setLoadingMessage(`Connection failed, retrying... (${retryCount + 1}/2)`);
        setTimeout(() => fetchData(retryCount + 1), 2000);
        return;
      }

      // Only show notification if it's not a background refresh
      if (activeTab !== 'admin') {
        setNotification({ message: `Data sync error: ${error.message}`, type: 'error' });
      }
    } finally {
      if (retryCount === 0 || retryCount >= 2) {
        setLoading(false);
        setIsWakingUp(false);
        setShowSlowConnectionWarning(false);
      }
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
    // Find the project by ID
    const project = projects.find(p => p.id === id);
    if (project) {
      setSelectedProject(project);
    }
    // Find the snippet by ID
    const snippet = snippets.find(s => s.id === id);
    if (snippet) {
      setSelectedSnippet(snippet);
    }
    // Trigger the logging middleware on the server
    await apiFetch(`/api/posts/${id}`);
    fetchData(); // Refresh stats
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/login', {
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

      const res = await apiFetch(url, {
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
        type: adminModule === 'projects' ? 'project' : 'snippet',
        status: 'publish',
        image_url: '',
        sort_order: 0,
        meta: { github_url: '', project_url: '', tech_stack: '', language: '', challenge: '', solution: '', impact: '', architecture: '' }
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
      const res = await apiFetch(`/api/posts/${id}`, {
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

  // Reordering Functions
  const handleMovePost = async (id: number, direction: 'up' | 'down') => {
    if (!token) return;

    const currentPosts = [...projects];
    const index = currentPosts.findIndex(p => p.id === id);

    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= currentPosts.length) return;

    // Swap items in array
    const [movedItem] = currentPosts.splice(index, 1);
    currentPosts.splice(newIndex, 0, movedItem);

    // Update sort_order values
    const updatedPosts = currentPosts.map((post, idx) => ({
      ...post,
      sort_order: idx
    }));

    setProjects(updatedPosts);

    // Update each item in database
    try {
      for (const post of updatedPosts) {
        await apiFetch(`/api/posts/${post.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: post.title,
            content: post.content,
            type: post.type,
            status: post.status,
            image_url: post.image_url || '',
            meta: post.meta,
            sort_order: post.sort_order
          })
        });
      }
      setNotification({ message: "Project order updated successfully", type: 'success' });
    } catch (error: any) {
      console.error("Reorder error:", error);
      setNotification({ message: error.message || "Failed to update order", type: 'error' });
      fetchData(); // Refresh to restore original order
    }
  };

  const handleMoveExperience = async (id: number, direction: 'up' | 'down') => {
    if (!token) return;

    const currentExperience = [...experience];
    const index = currentExperience.findIndex(e => e.id === id);

    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= currentExperience.length) return;

    // Swap items in array
    const [movedItem] = currentExperience.splice(index, 1);
    currentExperience.splice(newIndex, 0, movedItem);

    // Update sort_order values
    const updatedExperience = currentExperience.map((exp, idx) => ({
      ...exp,
      sort_order: idx
    }));

    setExperience(updatedExperience);

    // Update each item in database
    try {
      for (const exp of updatedExperience) {
        await apiFetch(`/api/experience/${exp.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            company: exp.company,
            role: exp.role,
            period: exp.period,
            description: exp.description,
            sort_order: exp.sort_order
          })
        });
      }
      setNotification({ message: "Experience order updated successfully", type: 'success' });
    } catch (error: any) {
      console.error("Reorder error:", error);
      setNotification({ message: error.message || "Failed to update order", type: 'error' });
      fetchData(); // Refresh to restore original order
    }
  };

  const handleCreateExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      const url = editingExpId ? `/api/experience/${editingExpId}` : '/api/experience';
      const method = editingExpId ? 'PUT' : 'POST';
      const res = await apiFetch(url, {
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
      const res = await apiFetch(`/api/experience/${id}`, {
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
      const res = await apiFetch(url, {
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
      const res = await apiFetch(`/api/skills/${id}`, {
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
      const res = await apiFetch(url, {
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
      const res = await apiFetch(`/api/certifications/${id}`, {
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
      const res = await apiFetch('/api/contact', {
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
      const res = await apiFetch(`/api/messages/${id}/read`, {
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
      const res = await apiFetch('/api/upload', {
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

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      const res = await apiFetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      await processResponse(res);
      fetchData();
      setNotification({ message: "Settings updated successfully", type: 'success' });
    } catch (error: any) {
      console.error("Error updating settings:", error);
      setNotification({ message: error.message || "Failed to update settings", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSettingFileUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    if (file.size > 10 * 1024 * 1024) {
      setNotification({ message: "File too large (max 10MB)", type: 'error' });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Upload file first
      const uploadRes = await apiFetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const uploadData = await processResponse(uploadRes);

      if (!uploadData || !uploadData.url) {
        throw new Error('Upload failed - no URL returned');
      }

      const newUrl = uploadData.url;

      // Verify the file exists by trying to access it
      try {
        const testRes = await fetch(newUrl, { method: 'HEAD' });
        if (!testRes.ok) {
          throw new Error('Uploaded file not accessible');
        }
      } catch (verifyError) {
        throw new Error('File upload verification failed');
      }

      // Save to settings only after verifying file exists
      await apiFetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [key]: newUrl })
      });

      // Update local state only after both operations succeed
      setSettings(prev => ({ ...prev, [key]: newUrl }));
      setNotification({ message: `${key.replace('_', ' ')} updated successfully`, type: 'success' });
    } catch (error: any) {
      console.error("Setting upload error:", error);
      setNotification({ message: error.message || "Upload failed", type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!token) return;
    try {
      const res = await apiFetch(`/api/messages/${id}`, {
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
    if (!token) return;
    setIsGeneratingReport(true);
    try {
      const res = await apiFetch('/api/admin/gemini-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectCount: projects.length,
          snippetCount: snippets.length,
          messageCount: messages.length,
          unreadCount: messages.filter((m) => m.status === 'unread').length,
          skills: skills.map((s) => s.name),
          stats,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate report');
      }
      setGeminiReport(data.report || 'No report generated.');
    } catch (err: any) {
      console.error('Gemini report error:', err);
      setGeminiReport(
        err?.message ||
          'Failed to generate report. Set GEMINI_API_KEY on the API server (Render).'
      );
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
      sort_order: post.sort_order || 0,
      meta: {
        github_url: post.meta.github_url || '',
        project_url: post.meta.project_url || '',
        tech_stack: post.meta.tech_stack || '',
        language: post.meta.language || '',
        challenge: post.meta.challenge || '',
        solution: post.meta.solution || '',
        impact: post.meta.impact || '',
        architecture: post.meta.architecture || ''
      }
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewPost({
      title: '',
      content: '',
      type: 'project',
      status: 'publish',
      image_url: '',
      sort_order: 0,
      meta: { github_url: '', project_url: '', tech_stack: '', language: '', challenge: '', solution: '', impact: '', architecture: '' }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      <SiteNav
        activeTab={activeTab}
        activeSection={activeSection}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        theme={theme}
        setTheme={setTheme}
        token={token}
        onLogout={handleLogout}
        onTabChange={setActiveTab}
      />

      <NotificationToast notification={notification} />

      <LoginModal
        isOpen={showLogin}
        loginData={loginData}
        setLoginData={setLoginData}
        onSubmit={handleLogin}
        onClose={() => setShowLogin(false)}
      />

      <main
        className={`max-w-6xl mx-auto px-6 ${
          activeTab === 'home' ? 'pt-4 pb-12 md:pt-6 md:pb-12' : 'py-12'
        }`}
      >
        {(activeTab === 'projects' || activeTab === 'snippets') && (
          <PageHeader
            tab={activeTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-24"
            >
              <HomeTab
                settings={settings}
                loading={loading}
                skills={skills}
                experience={experience}
                certifications={certifications}
                projects={projects}
                contactForm={contactForm}
                setContactForm={setContactForm}
                onSubmitContact={handleContactSubmit}
                isSubmitting={isSubmitting}
                onExploreProjects={() => setActiveTab('projects')}
                onOpenProject={handlePostClick}
                onOpenResume={() => setIsResumeDrawerOpen(true)}
              />
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
              <ProjectsTab
                loading={loading}
                loadingMessage={loadingMessage}
                showSlowConnectionWarning={showSlowConnectionWarning}
                projects={projects}
                onPostClick={handlePostClick}
              />
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
              <SnippetsTab
                loading={loading}
                loadingMessage={loadingMessage}
                showSlowConnectionWarning={showSlowConnectionWarning}
                snippets={snippets}
                onPostClick={handlePostClick}
              />
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
              <AdminTab
                token={token}
                setToken={setToken}
                setShowLogin={setShowLogin}
                showAdminLogin={SHOW_ADMIN_LOGIN}
                adminModule={adminModule}
                setAdminModule={setAdminModule}
                theme={theme}
                projects={projects}
                snippets={snippets}
                experience={experience}
                skills={skills}
                certifications={certifications}
                messages={messages}
                stats={stats}
                settings={settings}
                setSettings={setSettings}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                newPost={newPost}
                setNewPost={setNewPost}
                editingId={editingId}
                setEditingId={setEditingId}
                newExperience={newExperience}
                setNewExperience={setNewExperience}
                editingExpId={editingExpId}
                setEditingExpId={setEditingExpId}
                newSkill={newSkill}
                setNewSkill={setNewSkill}
                editingSkillId={editingSkillId}
                setEditingSkillId={setEditingSkillId}
                newCertification={newCertification}
                setNewCertification={setNewCertification}
                editingCertId={editingCertId}
                setEditingCertId={setEditingCertId}
                isSubmitting={isSubmitting}
                isUploading={isUploading}
                isGeneratingReport={isGeneratingReport}
                geminiReport={geminiReport}
                handleUpdateSettings={handleUpdateSettings}
                handleSettingFileUpload={handleSettingFileUpload}
                handleCreatePost={handleCreatePost}
                handleFileUpload={handleFileUpload}
                handleMovePost={handleMovePost}
                startEditing={startEditing}
                handleDeletePost={handleDeletePost}
                handleCreateExperience={handleCreateExperience}
                handleMoveExperience={handleMoveExperience}
                handleDeleteExperience={handleDeleteExperience}
                handleCreateSkill={handleCreateSkill}
                handleDeleteSkill={handleDeleteSkill}
                handleCreateCertification={handleCreateCertification}
                handleDeleteCertification={handleDeleteCertification}
                handleMarkAsRead={handleMarkAsRead}
                handleDeleteMessage={handleDeleteMessage}
                generateGeminiReport={generateGeminiReport}
              />
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      <Footer settings={settings} onNavigate={(tab) => setActiveTab(tab)} />

      {/* AI Interview Assistant */}
      <AIChatAssistant
        portfolioData={{
          projects,
          experience,
          skills,
          certifications,
          settings
        }}
      />
      {/* Project Deep Dive Modal */}
      <ProjectDeepDive
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      {/* Snippet Deep Dive Modal */}
      <SnippetDeepDive
        snippet={selectedSnippet}
        isOpen={!!selectedSnippet}
        onClose={() => setSelectedSnippet(null)}
      />

      {/* Interactive Resume Drawer */}
      <ResumeDrawer
        isOpen={isResumeDrawerOpen}
        onClose={() => setIsResumeDrawerOpen(false)}
        resumeUrl={settings.resume_url || '/resume.pdf'}
        downloadUrl={apiUrl('/api/resume/download')}
      />

      {/* Recruiter Console Modal */}
      <RecruiterConsole
        isOpen={isRecruiterConsoleOpen}
        onClose={() => setIsRecruiterConsoleOpen(false)}
        onOpenResume={() => {
          setIsResumeDrawerOpen(true);
        }}
        downloadUrl={apiUrl('/api/resume/download')}
        contactEmail={settings.contact_email || 'endalewondwosen@gmail.com'}
      />

      {/* Floating Recruiter FAB — desktop only */}
      <div className="hidden md:block fixed bottom-6 left-6 z-[100]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsRecruiterConsoleOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-5 py-3.5 rounded-full shadow-2xl transition-all cursor-pointer border border-emerald-400/30 group"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-950 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-950"></span>
          </span>
          <span className="text-xs uppercase tracking-wider">Recruiter Mode</span>
        </motion.button>
      </div>

      <MobileCtaBar
        contactEmail={settings.contact_email}
        onOpenResume={() => setIsResumeDrawerOpen(true)}
        onOpenRecruiter={() => setIsRecruiterConsoleOpen(true)}
      />
    </div>
  );
}

// Removed ProjectCard and SnippetItem as they are now in separate files
