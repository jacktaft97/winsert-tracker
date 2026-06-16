import { getOrderById } from '@/lib/queries';
import { updateOrderAction } from '@/actions/orders';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { CustomerEmailInput } from '@/components/CustomerEmailInput';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm';
const selectClass =
  'bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm';

export default async function OrderEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; created?: string; emailError?: string }>;
}) {
  const { id } = await params;
  const { saved, created, emailError } = await searchParams;

  const order = await getOrderById(id);
  if (!order) notFound();

  const customerUrl = `${process.env.BASE_URL}/order/${order.share_token}`;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/admin/dashboard" className="text-gray-500 hover:text-white text-sm transition-colors">
            ← Orders
          </Link>
          <h1 className="text-2xl font-bold text-white mt-1">{order.customer_name}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{order.project_name}</p>
        </div>
        <CopyLinkButton url={customerUrl} />
      </div>

      {(saved || created) && (
        <div className="mb-5 bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg text-sm">
          {created && 'Order created. '}
          {saved === 'notified' && 'Saved and customer notified. '}
          {saved === 'true' && !emailError && 'Saved without notification. '}
          {saved === 'true' && emailError && 'Order saved. '}
        </div>
      )}
      {emailError && (
        <div className="mb-5 bg-yellow-900/30 border border-yellow-700 text-yellow-400 px-4 py-3 rounded-lg text-sm">
          ⚠️ Order saved, but the notification email could not be sent. A verified sending domain is required to email customers. Visit resend.com/domains to set one up.
        </div>
      )}

      <form action={updateOrderAction} className="space-y-6">
        <input type="hidden" name="order_id" value={order.id} />

        {/* Order details */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Order Details</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Customer Name</label>
              <input name="customer_name" defaultValue={order.customer_name} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Customer Email(s)</label>
              <CustomerEmailInput
                primaryEmail={order.customer_email}
                extraEmails={order.customer_emails?.slice(1) ?? []}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
            <input name="project_name" defaultValue={order.project_name} required className={inputClass} />
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-300 mb-1">Shipping Date</label>
            <input name="eta_date" type="date" defaultValue={order.eta_date ? new Date(order.eta_date).toISOString().split('T')[0] : ''} className={inputClass} />
          </div>
          <div className="border-t border-gray-700 pt-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Primary Contact</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input name="contact_name" defaultValue={order.contact_name} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                  <input name="contact_phone" defaultValue={order.contact_phone} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input name="contact_email" type="email" defaultValue={order.contact_email} required className={inputClass} />
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Secondary Contact <span className="normal-case font-normal text-gray-500">(optional)</span></p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input name="contact2_name" defaultValue={order.contact2_name ?? ''} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                  <input name="contact2_phone" defaultValue={order.contact2_phone ?? ''} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input name="contact2_email" type="email" defaultValue={order.contact2_email ?? ''} className={inputClass} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stage editor */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Order Stages</p>
          <div className="space-y-1">
            {order.stages.map((stage) => (
              <div
                key={stage.id}
                className="grid grid-cols-[32px_160px_1fr] gap-4 items-start py-4 border-b border-gray-800 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 mt-1">
                  {stage.id}
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-1">{stage.name}</p>
                  <select name={`stage_${stage.id}_status`} defaultValue={stage.status} className={selectClass}>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="complete">Complete</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <textarea
                    name={`stage_${stage.id}_note`}
                    defaultValue={stage.note}
                    placeholder="Add a note for the customer…"
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                  {stage.name === 'Shipping' && (
                    <div className="flex gap-3 items-center">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-400 mb-1">Units Shipped</label>
                        <input
                          type="number"
                          name={`stage_${stage.id}_ship_completed`}
                          defaultValue={stage.ship_completed ?? ''}
                          min={0}
                          className={inputClass}
                          placeholder="0"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-400 mb-1">Total Units</label>
                        <input
                          type="number"
                          name={`stage_${stage.id}_ship_total`}
                          defaultValue={stage.ship_total ?? ''}
                          min={0}
                          className={inputClass}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            name="notify"
            value="false"
            className="px-5 py-2 border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors"
          >
            Save Without Notifying
          </button>
          <button
            type="submit"
            name="notify"
            value="true"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            Save & Notify Customer
          </button>
        </div>
      </form>
    </div>
  );
}
