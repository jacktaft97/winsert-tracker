import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

export function isValidPassword(input: string): boolean {
  if (!input) return false;
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
