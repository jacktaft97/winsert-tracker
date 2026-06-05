import { getOrderByToken } from '@/lib/queries';
import { StageTimeline } from '@/components/StageTimeline';
import { notFound } from 'next/navigation';

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const order = await getOrderByToken(token);
  if (!order) notFound();

  const etaDisplay = order.eta_date
    ? new Date(order.eta_date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-900 text-white py-5 px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-blue-400 uppercase">Alpen WinSert</p>
          <h1 className="text-xl font-bold mt-0.5">Order Progress</h1>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-8 py-10">
        {/* Order header */}
        <div className="mb-10 pb-8 border-b border-gray-200">
          <p className="text-gray-500 text-sm">Hi {order.customer_name},</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">{order.project_name}</h2>
          {etaDisplay && (
            <p className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-700 font-semibold text-sm px-4 py-2 rounded-full">
              Estimated Install: {etaDisplay}
            </p>
          )}
        </div>

        {/* Desktop: two-column; mobile: stacked */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-14">
          {/* Timeline — 2/3 width on desktop */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Progress</h3>
            <StageTimeline stages={order.stages} />
          </div>

          {/* Contact card — 1/3 width, sticky on desktop */}
          <div className="mt-12 lg:mt-0">
            <div className="lg:sticky lg:top-8 bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Your Contact</p>
              <p className="font-bold text-gray-900 text-xl">{order.contact_name}</p>
              <a
                href={`tel:${order.contact_phone}`}
                className="block mt-3 text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors"
              >
                {order.contact_phone}
              </a>
              <a
                href={`mailto:${order.contact_email}`}
                className="block mt-1 text-blue-600 hover:text-blue-800 text-sm transition-colors"
              >
                {order.contact_email}
              </a>
              <a
                href={`tel:${order.contact_phone}`}
                className="mt-5 block text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Contact {order.contact_name}
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
