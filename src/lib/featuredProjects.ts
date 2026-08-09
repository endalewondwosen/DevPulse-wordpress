import type { Post } from '../types';

export type FeaturedProjectAccent = 'emerald' | 'blue' | 'purple';

export interface FeaturedProject {
  eyebrow: string;
  title: string;
  summary: string;
  stack: string[];
  metrics: { value: string; label: string }[];
  accent: FeaturedProjectAccent;
  /** Match API `post.title` (case-insensitive substring). */
  titleMatchers: string[];
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    eyebrow: 'e-Government',
    title: 'Government Service Portal',
    summary:
      'Citizen platform digitizing public services across Shaggar City — RBAC, Fayda National ID, QR-verified certificates, and multi-language support.',
    stack: ['Laravel', 'Next.js', 'MySQL', 'TypeScript'],
    metrics: [
      { value: '4K+', label: 'Users' },
      { value: '140+', label: 'Services' },
      { value: '97%', label: 'Satisfaction' },
    ],
    accent: 'emerald',
    titleMatchers: ['eservice', 'e-service', 'e service', 'government service'],
  },
  {
    eyebrow: 'Public Sector · Fintech',
    title: 'Shaggar City Traffic Management',
    summary:
      'Revenue-bearing platform for 450+ government users across 12 subcities — TeleBirr integration, automated late-fee calculation, public REST API.',
    stack: ['Laravel', 'Next.js', 'MySQL', 'TeleBirr'],
    metrics: [
      { value: '500M+', label: 'ETB Revenue' },
      { value: '400K+', label: 'Charges' },
      { value: '12', label: 'Subcities' },
    ],
    accent: 'blue',
    titleMatchers: ['traffic', 'shaggar city traffic', 'traffic management'],
  },
  {
    eyebrow: 'Queue Management',
    title: 'One Stop Service Center (Mesob)',
    summary:
      'Multi-city queue & service-token system with self-service kiosks, real-time TV displays, citizen feedback, and multi-language reporting.',
    stack: ['Laravel', 'MySQL', 'REST API'],
    metrics: [
      { value: '70K+', label: 'Tokens' },
      { value: '6+', label: 'Cities' },
      { value: '500+', label: 'Daily Citizens' },
    ],
    accent: 'purple',
    titleMatchers: ['mesob', 'one stop', 'ossc', 'service center'],
  },
];

function normalizeTitle(value: string): string {
  return value.toLowerCase().trim();
}

/** Resolve a featured card to a live project post from the API. */
export function resolveFeaturedProject(featured: FeaturedProject, posts: Post[]): Post | undefined {
  const projectPosts = posts.filter((p) => p.type === 'project');

  for (const post of projectPosts) {
    const title = normalizeTitle(post.title);
    if (featured.titleMatchers.some((matcher) => title.includes(normalizeTitle(matcher)))) {
      return post;
    }
  }

  const featuredTitle = normalizeTitle(featured.title);
  return projectPosts.find((post) => {
    const title = normalizeTitle(post.title);
    return title.includes(featuredTitle) || featuredTitle.includes(title);
  });
}
