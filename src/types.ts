export interface Post {
  id: number;
  title: string;
  content: string;
  type: 'project' | 'snippet';
  status: 'publish' | 'private';
  image_url?: string;
  meta: {
    github_url?: string;
    project_url?: string;
    tech_stack?: string;
    language?: string;
  };
  created_at: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string;
  sort_order: number;
}

export interface Skill {
  id: number;
  category: string;
  name: string;
  sort_order: number;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  created_at: string;
}

export interface Stat {
  endpoint: string;
  views: number;
}
