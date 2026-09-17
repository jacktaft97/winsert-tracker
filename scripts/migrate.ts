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
    ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS customer_emails JSONB NOT NULL DEFAULT '[]'
  `;
  console.log('✓ customer_emails column');

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

  // Remove 'Manufacturing' stage from all existing orders and renumber remaining stages
  await sql`
    UPDATE orders AS o
    SET stages = updated.new_stages
    FROM (
      SELECT
        id,
        jsonb_agg(
          jsonb_set(stage_elem, '{id}', to_jsonb(row_num::int))
          ORDER BY row_num
        ) AS new_stages
      FROM (
        SELECT
          o2.id,
          stage_elem,
          ROW_NUMBER() OVER (
            PARTITION BY o2.id
            ORDER BY (stage_elem->>'id')::int
          ) AS row_num
        FROM orders o2,
             LATERAL jsonb_array_elements(o2.stages) AS stage_elem
        WHERE stage_elem->>'name' != 'Manufacturing'
      ) filtered
      GROUP BY id
    ) updated
    WHERE o.id = updated.id
  `;
  console.log('✓ removed Manufacturing stage from existing orders');

  console.log('Migration complete.');
}

migrate().catch(console.error);
