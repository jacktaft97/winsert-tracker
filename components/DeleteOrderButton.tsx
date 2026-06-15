'use client';

import { deleteOrderAction } from '@/actions/orders';
import { useRef } from 'react';

export function DeleteOrderButton({ orderId }: { orderId: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleClick() {
    if (window.confirm('Are you sure you want to delete this order? This cannot be undone.')) {
      formRef.current?.requestSubmit();
    }
  }

  return (
    <form ref={formRef} action={deleteOrderAction}>
      <input type="hidden" name="order_id" value={orderId} />
      <button
        type="button"
        onClick={handleClick}
        className="w-full py-2.5 border border-red-800 text-red-400 hover:bg-red-900/30 hover:border-red-600 hover:text-red-300 rounded-lg text-sm font-medium transition-colors"
      >
        Delete Order
      </button>
    </form>
  );
}
