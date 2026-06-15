import { createOrderAction } from '@/actions/orders';
import { CustomerEmailInput } from '@/components/CustomerEmailInput';
import Link from 'next/link';

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm';

export default function NewOrderPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/dashboard" className="text-gray-500 hover:text-white text-sm transition-colors">
          ← Orders
        </Link>
        <h1 className="text-2xl font-bold text-white mt-1">New Order</h1>
      </div>

      <form action={createOrderAction} className="space-y-6 bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Customer Name</label>
            <input name="customer_name" required className={inputClass} placeholder="Sarah Johnson" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Customer Email(s)</label>
            <CustomerEmailInput primaryEmail="" extraEmails={[]} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
          <input
            name="project_name"
            required
            className={inputClass}
            placeholder="123 Main St Office — 14 WinSert Plus units"
          />
        </div>

        <div className="w-48">
          <label className="block text-sm font-medium text-gray-300 mb-1">Shipping Date</label>
          <input name="eta_date" type="date" className={inputClass} />
        </div>

        <div className="border-t border-gray-700 pt-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Primary Contact</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input name="contact_name" required className={inputClass} placeholder="Jack" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                <input name="contact_phone" required className={inputClass} placeholder="720-555-0100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input name="contact_email" type="email" required className={inputClass} placeholder="jack@alpen.com" />
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Secondary Contact <span className="normal-case font-normal text-gray-500">(optional)</span></p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input name="contact2_name" className={inputClass} placeholder="Sarah" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                <input name="contact2_phone" className={inputClass} placeholder="720-555-0101" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input name="contact2_email" type="email" className={inputClass} placeholder="sarah@alpen.com" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/admin/dashboard" className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
}
