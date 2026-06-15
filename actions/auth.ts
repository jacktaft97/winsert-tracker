'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { isValidPassword, getSession, hashPassword } from '@/lib/auth';
import { getSql } from '@/lib/db';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function login(formData: FormData) {
  const password = formData.get('password') as string;

  if (!(await isValidPassword(password))) {
    redirect('/admin/login?error=Incorrect+password');
  }

  const session = await getSession();
  session.isAdmin = true;
  await session.save();

  redirect('/admin/dashboard');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}

export async function requestPasswordReset(formData: FormData) {
  // Generate a secure random token, store it, and email the reset link.
  // We don't reveal whether the email matched — always show the same confirmation.
  const sql = getSql();
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

  await sql`
    INSERT INTO password_reset_tokens (token, expires_at)
    VALUES (${token}, ${expiresAt.toISOString()})
  `;

  const baseUrl = process.env.BASE_URL!;
  const resetUrl = `${baseUrl}/admin/reset-password?token=${token}`;
  const adminEmail = process.env.ADMIN_EMAIL!;

  const { error } = await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: adminEmail,
    subject: 'Alpen WinSert — Password Reset',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#111;">
        <h2 style="color:#1e3a5f;">Alpen WinSert Admin</h2>
        <p>A password reset was requested. Click the button below to set a new password.</p>
        <p style="margin:24px 0;">
          <a href="${resetUrl}"
             style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">
            Reset Password →
          </a>
        </p>
        <p style="font-size:13px;color:#888;">This link expires in 30 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error('[requestPasswordReset] Resend error:', error);
  }

  redirect('/admin/forgot-password?sent=true');
}

export async function resetPassword(formData: FormData) {
  const token = formData.get('token') as string;
  const password = formData.get('password') as string;
  const confirm = formData.get('confirm') as string;

  if (!password || password !== confirm) {
    redirect(`/admin/reset-password?token=${token}&error=Passwords+do+not+match`);
  }

  if (password.length < 8) {
    redirect(`/admin/reset-password?token=${token}&error=Password+must+be+at+least+8+characters`);
  }

  const sql = getSql();
  const rows = await sql`
    SELECT token FROM password_reset_tokens
    WHERE token = ${token}
      AND used = false
      AND expires_at > now()
  `;

  if ((rows as unknown[]).length === 0) {
    redirect('/admin/reset-password?error=Link+expired+or+already+used');
  }

  // Store the new hashed password and mark the token used
  const hash = hashPassword(password);
  await sql`
    INSERT INTO settings (key, value, updated_at)
    VALUES ('admin_password_hash', ${hash}, now())
    ON CONFLICT (key) DO UPDATE SET value = ${hash}, updated_at = now()
  `;
  await sql`
    UPDATE password_reset_tokens SET used = true WHERE token = ${token}
  `;

  redirect('/admin/login?message=Password+updated.+Please+log+in.');
}
