import { Resend } from 'resend';
import type { Order } from './db';
import { getActiveStage } from './stages';

const resend = new Resend(process.env.RESEND_API_KEY);

export function buildUpdateEmail(
  order: Order,
  baseUrl: string
): { subject: string; html: string } {
  const activeStage = getActiveStage(order.stages);

  const stageBlock = activeStage
    ? `<div style="background:#f4f4f5;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="margin:0;font-weight:600;color:#111;">${activeStage.name}</p>
        ${activeStage.note ? `<p style="margin:6px 0 0;color:#444;font-size:14px;">"${activeStage.note}"</p>` : ''}
       </div>`
    : '';

  const subject = `Update on your Alpen WinSert order — ${order.project_name}`;

  const html = `
    <div style="font-family:sans-serif;max-width:580px;margin:0 auto;color:#111;">
      <h2 style="color:#1e3a5f;margin-bottom:4px;">Alpen WinSert</h2>
      <p style="margin-top:0;color:#666;font-size:13px;">Order Update</p>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:16px 0;"/>

      <p>Hi ${order.customer_name},</p>
      <p>A new update has been made to your WinSert order.</p>

      ${stageBlock}

      <p style="margin:24px 0;">
        <a href="${baseUrl}/order/${order.share_token}"
           style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">
          View Your Order Progress →
        </a>
      </p>

      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;"/>
      <p style="font-size:13px;color:#888;">
        Questions? Contact ${order.contact_name}:<br/>
        <a href="tel:${order.contact_phone}" style="color:#2563eb;">${order.contact_phone}</a>
        &nbsp;|&nbsp;
        <a href="mailto:${order.contact_email}" style="color:#2563eb;">${order.contact_email}</a>
      </p>
    </div>
  `;

  return { subject, html };
}

export async function sendUpdateEmail(order: Order): Promise<void> {
  const baseUrl = process.env.BASE_URL!;
  const { subject, html } = buildUpdateEmail(order, baseUrl);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: order.customer_email,
    subject,
    html,
  });
}
