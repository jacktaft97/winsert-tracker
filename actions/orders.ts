'use server';

import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { createOrder, getOrderById, updateOrder } from '@/lib/queries';
import { sendUpdateEmail } from '@/lib/email';
import type { Stage } from '@/lib/db';

export async function createOrderAction(formData: FormData) {
  await requireAdmin();

  const primaryEmail = formData.get('customer_email') as string;
  const extraEmails = formData.getAll('customer_email_extra').map((e) => e as string).filter(Boolean);
  const allEmails = [primaryEmail, ...extraEmails].filter(Boolean);

  const order = await createOrder({
    customer_name: formData.get('customer_name') as string,
    customer_email: primaryEmail,
    customer_emails: allEmails,
    project_name: formData.get('project_name') as string,
    eta_date: (formData.get('eta_date') as string) || null,
    contact_name: formData.get('contact_name') as string,
    contact_phone: formData.get('contact_phone') as string,
    contact_email: formData.get('contact_email') as string,
    contact2_name: (formData.get('contact2_name') as string) || null,
    contact2_phone: (formData.get('contact2_phone') as string) || null,
    contact2_email: (formData.get('contact2_email') as string) || null,
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

    const mfgCompletedRaw = formData.get(`stage_${stage.id}_mfg_completed`);
    const mfgTotalRaw = formData.get(`stage_${stage.id}_mfg_total`);
    const mfg_completed = mfgCompletedRaw !== null ? Number(mfgCompletedRaw) : stage.mfg_completed;
    const mfg_total = mfgTotalRaw !== null ? Number(mfgTotalRaw) : stage.mfg_total;

    return {
      ...stage,
      status: newStatus ?? stage.status,
      note: (formData.get(`stage_${stage.id}_note`) as string) ?? stage.note,
      completed_at: becameComplete ? new Date().toISOString() : stage.completed_at,
      ...(mfg_completed !== undefined && { mfg_completed }),
      ...(mfg_total !== undefined && { mfg_total }),
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
    contact2_name: (formData.get('contact2_name') as string) || null,
    contact2_phone: (formData.get('contact2_phone') as string) || null,
    contact2_email: (formData.get('contact2_email') as string) || null,
    customer_emails: (() => {
      const primary = formData.get('customer_email') as string;
      const extra = formData.getAll('customer_email_extra').map((e) => e as string).filter(Boolean);
      return [primary, ...extra].filter(Boolean);
    })(),
    stages,
  });

  if (notify) {
    await sendUpdateEmail(updated);
  }

  redirect(`/admin/orders/${id}?saved=${notify ? 'notified' : 'true'}`);
}
