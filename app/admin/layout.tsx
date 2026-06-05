import { requireAdmin } from '@/lib/auth';
import { logout } from '@/actions/auth';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <span className="text-white font-bold text-lg">Alpen WinSert</span>
          <span className="text-gray-500 text-sm">Admin</span>
        </Link>
        <form action={logout}>
          <button type="submit" className="text-gray-400 hover:text-white text-sm transition-colors">
            Sign out
          </button>
        </form>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
