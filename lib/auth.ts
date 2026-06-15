import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHash } from 'crypto';
import { getSql } from './db';

export interface SessionData {
  isAdmin?: boolean;
}

export const sessionOptions = {
  password: process.env.ADMIN_COOKIE_SECRET ?? 'fallback-dev-secret-change-in-prod',
  cookieName: 'admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  },
};

export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

/**
 * Check password against:
 * 1. A hashed override stored in the DB settings table (set via password reset)
 * 2. The ADMIN_PASSWORD env var (original fallback)
 */
export async function isValidPassword(input: string): Promise<boolean> {
  if (!input) return false;

  const sql = getSql();
  const rows = await sql`SELECT value FROM settings WHERE key = 'admin_password_hash'`;
  const stored = (rows as { value: string }[])[0]?.value;

  if (stored) {
    return hashPassword(input) === stored;
  }

  return input === process.env.ADMIN_PASSWORD;
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session.isAdmin) {
    redirect('/admin/login');
  }
}
