'use server';

import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { createOrder, getOrderById, updateOrder } from '@/lib/queries';
import { sendUpdateEmail } from '@/lib/email';
import type { Stage } from '@/lib/db';

export async function createOrderAction(formData: FormData) {
  await requireAdmin();

  const order = await createOrder({
    customer_name: formData.get('customer_name') as string,
    customer_email: formData.get('customer_email') as string,
    project_name: formData.get('project_name') as string,
    eta_date: (formData.get('eta_date') as string) || null,
    contact_name: formData.get('contact_name') as string,
    contact_phone: formData.get('contact_phone') as string,
    contact_email: formData.get('contact_email') as string,
  });

  redirect(`/admin/orders/${order.id}?created=true`);
}

export async function updateOrderAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get('order_id') as string;
  const notify = formData.get('notify') === 'true';

  const current = await getOrderById(id);
  if (!current) redirect('/admin/dashboard');

  const stages: Stage[] = current!.stages.map((stage) => {
    const newStatus = formData.get(`stage_${stage.id}_status`) as Stage['status'];
    const becameComplete = newStatus === 'complete' && stage.status !== 'complete';
    return {
      ...stage,
      status: newStatus ?? stage.status,
      note: (formData.get(`stage_${stage.id}_note`) as string) ?? stage.note,
      completed_at: becameComplete ? new Date().toISOString() : stage.completed_at,
    };
  });

  const updated = await updateOrder(id, {
    customer_name: formData.get('customer_name') as string,
    customer_email: formData.get('customer_email') as string,
    project_name: formData.get('project_name') as string,
    eta_date: (formData.get('eta_date') as string) || null,
    contact_name: formData.get('contact_name') as string,
    contact_phone: formData.get('contact_phone') as string,
    contact_email: formData.get('contact_email') as string,
    stages,
  });

  if (notify) {
    await sendUpdateEmail(updated);
  }

  redirect(`/admin/orders/${id}?saved=${notify ? 'notified' : 'true'}`);
}
