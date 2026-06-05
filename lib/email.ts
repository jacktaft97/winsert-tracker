import type { Order } from './db';

export function buildUpdateEmail(_order: Order, _baseUrl: string): { subject: string; html: string } {
  return { subject: '', html: '' };
}

export async function sendUpdateEmail(_order: Order): Promise<void> {}
