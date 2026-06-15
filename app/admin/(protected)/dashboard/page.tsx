import { getAllOrders } from '@/lib/queries';
import Link from 'next/link';

export default async function DashboardPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <Link
          href="/admin/orders/new"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          + New Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-400">No orders yet. Create one to get started.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const active = order.stages.find((s) => s.status === 'active');
            const lastComplete = [...order.stages].reverse().find((s) => s.status === 'complete');
            const currentStage = active ?? lastComplete ?? order.stages[0];
            const completedCount = order.stages.filter((s) => s.status === 'complete').length;

            return (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{order.customer_name}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{order.project_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-400">{currentStage.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{completedCount} of {order.stages.length} complete</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
