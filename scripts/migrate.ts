import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      share_token    UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
      customer_name  TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      project_name   TEXT NOT NULL,
      eta_date       DATE,
      contact_name   TEXT NOT NULL,
      contact_phone  TEXT NOT NULL,
      contact_email  TEXT NOT NULL,
      stages         JSONB NOT NULL DEFAULT '[]',
      created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  console.log('Migration complete: orders table created');
}

migrate().catch(console.error);
