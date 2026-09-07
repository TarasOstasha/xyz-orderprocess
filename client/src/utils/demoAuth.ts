import { defaultRows } from '../constants';
import type { Task } from '../types';
import { getStoredToken } from './authStorage';

export const DEMO_TOKEN_PREFIX = 'demo.';

export interface DemoAuthUser {
  id: number;
  name: string;
  email: string;
}

export function isDemoModeEnabled(): boolean {
  return String(import.meta.env.VITE_DEMO_MODE || '').toLowerCase() === 'true';
}

export function isDemoToken(token: string | null | undefined): boolean {
  return Boolean(token && token.startsWith(DEMO_TOKEN_PREFIX));
}

export function isDemoSession(): boolean {
  return isDemoModeEnabled() || isDemoToken(getStoredToken());
}

export function getDemoCredentials() {
  return {
    email: String(import.meta.env.VITE_DEMO_USER_EMAIL || '')
      .trim()
      .toLowerCase(),
    password: String(import.meta.env.VITE_DEMO_USER_PASSWORD || ''),
    name: String(import.meta.env.VITE_DEMO_USER_NAME || 'Demo User').trim() || 'Demo User',
  };
}

export function tryDemoLogin(email: string, password: string): {
  token: string;
  user: DemoAuthUser;
} | null {
  if (!isDemoModeEnabled()) return null;

  const demo = getDemoCredentials();
  if (!demo.email || !demo.password) return null;

  const normalized = String(email || '').trim().toLowerCase();
  if (normalized !== demo.email || password !== demo.password) {
    return null;
  }

  return {
    token: `${DEMO_TOKEN_PREFIX}${btoa(normalized)}`,
    user: {
      id: 1,
      name: demo.name,
      email: demo.email,
    },
  };
}

export function getDemoUserFromToken(token: string): DemoAuthUser | null {
  if (!isDemoToken(token)) return null;
  const demo = getDemoCredentials();
  return {
    id: 1,
    name: demo.name,
    email: demo.email || 'demo@example.com',
  };
}

/** Sample orders so the Vercel demo UI is not empty without an API. */
export function getDemoTasks(): Task[] {
  return [
    {
      id: 1,
      title: 'Sample Order — Acme Caps',
      ship: 'UPS Ground',
      art: '2026-03-01',
      inHand: '2026-03-05',
      dueDate: '2026-03-10',
      status: ['Paid', 'In Progress'],
      priority: 'High',
      Note: {
        critical: 'Demo note — no backend connected. Data is local sample only.',
        general: 'Use this build to walk the client through the UI.',
        art: '',
        criticalSavedBy: '',
        generalSavedBy: '',
        artSavedBy: '',
      },
      Steps: defaultRows.map((s) => ({ ...s })),
    },
    {
      id: 2,
      title: 'Sample Order — Promo Totes',
      ship: 'FedEx',
      art: '2026-03-02',
      inHand: '2026-03-08',
      dueDate: '2026-03-15',
      status: ['Order Placed'],
      priority: 'Medium',
      Note: {
        critical: '',
        general: 'Second sample row for the list view.',
        art: '',
        criticalSavedBy: '',
        generalSavedBy: '',
        artSavedBy: '',
      },
      Steps: defaultRows.map((s) => ({ ...s })),
    },
  ];
}
