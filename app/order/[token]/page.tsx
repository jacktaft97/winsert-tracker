import { getOrderByToken } from '@/lib/queries';
import { StageTimeline } from '@/components/StageTimeline';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const order = await getOrderByToken(token);
  if (!order) notFound();

  // Extract YYYY-MM-DD from whatever Postgres returns (DATE or full timestamp),
  // then append T12:00:00 so JS parses in local time instead of UTC midnight.
  const etaDisplay = order.eta_date
    ? new Date(new Date(order.eta_date).toISOString().split('T')[0] + 'T12:00:00').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-900 text-white py-4 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-blue-400 uppercase">Alpen WinSert</p>
          <h1 className="text-lg sm:text-xl font-bold mt-0.5">Order Progress</h1>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {/* Order header */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <p className="text-gray-500 text-sm">Hi {order.customer_name},</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 leading-tight">{order.project_name}</h2>
          {etaDisplay && (
            <p className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-700 font-semibold text-sm px-4 py-2 rounded-full">
              Shipping Date: {etaDisplay}
            </p>
          )}
        </div>

        {/* Desktop: two-column; mobile: stacked */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-14">
          {/* Timeline — 2/3 width on desktop */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Progress</h3>
            <StageTimeline stages={order.stages} />
          </div>

          {/* Contact cards — below timeline on mobile, sidebar on desktop */}
          <div className="mt-10 lg:mt-0">
            <div className="lg:sticky lg:top-8 space-y-4">
              {/* Primary contact */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Primary Contact</p>
                <p className="font-bold text-gray-900 text-lg sm:text-xl">{order.contact_name}</p>
                <a
                  href={`tel:${order.contact_phone}`}
                  className="block mt-2 text-blue-600 font-medium text-base sm:text-lg"
                >
                  {order.contact_phone}
                </a>
                <a
                  href={`mailto:${order.contact_email}`}
                  className="block mt-1 text-blue-600 text-sm break-all"
                >
                  {order.contact_email}
                </a>
              </div>

              {/* Secondary contact — only shown if filled in */}
              {order.contact2_name && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Secondary Contact</p>
                  <p className="font-bold text-gray-900 text-lg sm:text-xl">{order.contact2_name}</p>
                  {order.contact2_phone && (
                    <a
                      href={`tel:${order.contact2_phone}`}
                      className="block mt-2 text-blue-600 font-medium text-base sm:text-lg"
                    >
                      {order.contact2_phone}
                    </a>
                  )}
                  {order.contact2_email && (
                    <a
                      href={`mailto:${order.contact2_email}`}
                      className="block mt-1 text-blue-600 text-sm break-all"
                    >
                      {order.contact2_email}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
