import { requestPasswordReset } from '@/actions/auth';
import Link from 'next/link';

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-sm shadow-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">Reset Password</h1>
          <p className="text-gray-400 text-sm mt-1">Alpen WinSert Admin</p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg text-sm">
              Reset link sent to your admin email. Check your inbox — it expires in 30 minutes.
            </div>
            <Link
              href="/admin/login"
              className="block text-center text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Back to login
            </Link>
          </div>
        ) : (
          <form action={requestPasswordReset} className="space-y-4">
            <p className="text-gray-400 text-sm">
              Click below to send a password reset link to the admin email on file.
            </p>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              Send Reset Link
            </button>
            <Link
              href="/admin/login"
              className="block text-center text-gray-500 hover:text-gray-400 text-sm transition-colors"
            >
              ← Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
