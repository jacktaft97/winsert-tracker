import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

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
  stages: Stage[];
  created_at: string;
  updated_at: string;
};
