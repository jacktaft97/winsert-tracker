import { neon } from '@neondatabase/serverless';

// Lazy singleton — neon() is called only when the first query runs,
// not at module import time (which happens during Next.js build analysis).
let _sql: ReturnType<typeof neon> | null = null;
export function getSql() {
  if (!_sql) _sql = neon(process.env.DATABASE_URL!);
  return _sql;
}

export type StageStatus = 'pending' | 'active' | 'complete';

export type Stage = {
  id: number;
  name: string;
  status: StageStatus;
  note: string;
  completed_at: string | null;
};

export type Order = {
  id: string;
  share_token: string;
  customer_name: string;
  customer_email: string;
  project_name: string;
  eta_date: string | null;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  contact2_name: string | null;
  contact2_phone: string | null;
  contact2_email: string | null;
  stages: Stage[];
  created_at: string;
  updated_at: string;
};
