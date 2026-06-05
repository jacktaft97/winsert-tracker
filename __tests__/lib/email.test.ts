jest.mock('resend', () => ({ Resend: jest.fn().mockImplementation(() => ({ emails: { send: jest.fn() } })) }));

import { buildUpdateEmail } from '@/lib/email';
import { initStages } from '@/lib/stages';
import type { Order } from '@/lib/db';

const mockOrder: Order = {
  id: 'order-id',
  share_token: 'abc-token-123',
  customer_name: 'Sarah Johnson',
  customer_email: 'sarah@example.com',
  project_name: '123 Main St Office',
  eta_date: '2026-06-22',
  contact_name: 'Jack',
  contact_phone: '720-555-0100',
  contact_email: 'jack@alpen.com',
  stages: initStages(),
  created_at: '2026-06-05T00:00:00Z',
  updated_at: '2026-06-05T00:00:00Z',
};

describe('buildUpdateEmail', () => {
  it('includes the project name in the subject', () => {
    const { subject } = buildUpdateEmail(mockOrder, 'https://example.com');
    expect(subject).toContain('123 Main St Office');
  });

  it('includes the customer link in the HTML body', () => {
    const { html } = buildUpdateEmail(mockOrder, 'https://example.com');
    expect(html).toContain('https://example.com/order/abc-token-123');
  });

  it('includes the contact name in the body', () => {
    const { html } = buildUpdateEmail(mockOrder, 'https://example.com');
    expect(html).toContain('Jack');
  });

  it('includes the stage note when a stage has one', () => {
    const orderWithNote = {
      ...mockOrder,
      stages: initStages().map((s, i) =>
        i === 0 ? { ...s, status: 'complete' as const, note: 'Measured on June 5' } : s
      ),
    };
    const { html } = buildUpdateEmail(orderWithNote, 'https://example.com');
    expect(html).toContain('Measured on June 5');
  });
});
