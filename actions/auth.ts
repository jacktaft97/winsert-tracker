'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { isValidPassword, getSession } from '@/lib/auth';

export async function login(formData: FormData) {
  const password = formData.get('password') as string;

  if (!isValidPassword(password)) {
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
