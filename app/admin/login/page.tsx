import { login } from '@/actions/auth';
import Link from 'next/link';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-sm shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Alpen WinSert</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Portal</p>
        </div>

        {message && (
          <div className="mb-4 bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <div>
              <p className="text-red-400 text-sm">{error}</p>
              <Link
                href="/admin/forgot-password"
                className="text-blue-400 hover:text-blue-300 text-sm underline mt-1 inline-block"
              >
                Forgot password? Reset via email →
              </Link>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </form>

        {!error && (
          <p className="text-center mt-4">
            <Link href="/admin/forgot-password" className="text-gray-500 hover:text-gray-400 text-xs">
              Forgot password?
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
