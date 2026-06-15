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
  console.log('✓ orders table');

  await sql`
    ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS contact2_name  TEXT,
      ADD COLUMN IF NOT EXISTS contact2_phone TEXT,
      ADD COLUMN IF NOT EXISTS contact2_email TEXT
  `;
  console.log('✓ secondary contact columns');

  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key        TEXT PRIMARY KEY,
      value      TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  console.log('✓ settings table');

  await sql`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      token      TEXT PRIMARY KEY,
      expires_at TIMESTAMPTZ NOT NULL,
      used       BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  console.log('✓ password_reset_tokens table');

  console.log('Migration complete.');
}

migrate().catch(console.error);
