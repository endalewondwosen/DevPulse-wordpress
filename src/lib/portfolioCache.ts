import type { Certification, Experience, Post, Skill, Stat } from '../types';

const CACHE_KEY = 'devpulse_portfolio_cache_v1';
const CACHE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export interface PortfolioCachePayload {
  version: 1;
  savedAt: number;
  projects: Post[];
  snippets: Post[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
  stats: Stat[];
  settings: Record<string, string>;
}

export function hasUsablePortfolioCache(
  cache: PortfolioCachePayload | null | undefined
): boolean {
  if (!cache) return false;
  return (
    cache.projects.length > 0 ||
    cache.experience.length > 0 ||
    cache.skills.length > 0 ||
    Object.keys(cache.settings || {}).length > 0
  );
}

export function loadPortfolioCache(): PortfolioCachePayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PortfolioCachePayload;
    if (parsed?.version !== 1 || typeof parsed.savedAt !== 'number') return null;
    if (Date.now() - parsed.savedAt > CACHE_MAX_AGE_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function savePortfolioCache(
  payload: Omit<PortfolioCachePayload, 'version' | 'savedAt'>
): void {
  try {
    const data: PortfolioCachePayload = {
      version: 1,
      savedAt: Date.now(),
      ...payload,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Quota / private mode — ignore
  }
}
