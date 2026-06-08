// Minimal shell — auth is handled by (protected)/layout.tsx for dashboard/orders.
// The login page lives here so it is NOT wrapped by requireAdmin().
export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
