import type { Stage } from './db';

export const DEFAULT_STAGES = [
  'Measure',
  'Order Placed',
  'Scheduled',
  'Manufacturing',
  'Quality Check',
  'Shipped',
  'Installation',
  'Sign-Off',
] as const;

export function initStages(): Stage[] {
  return DEFAULT_STAGES.map((name, i) => ({
    id: i + 1,
    name,
    status: 'pending',
    note: '',
    completed_at: null,
  }));
}

export function getActiveStage(stages: Stage[]): Stage | null {
  const candidates = stages
    .filter((s) => (s.status === 'active' || s.status === 'complete') && s.note.trim() !== '')
    .sort((a, b) => b.id - a.id);
  return candidates[0] ?? null;
}
