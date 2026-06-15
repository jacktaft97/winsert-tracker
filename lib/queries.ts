import { getSql } from './db';
import type { Order, Stage } from './db';
import { initStages } from './stages';

export async function getAllOrders(): Promise<Order[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM orders ORDER BY updated_at DESC
  `;
  return rows as unknown as Order[];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM orders WHERE id = ${id}
  `;
  const typed = rows as unknown as Order[];
  return typed[0] ?? null;
}

export async function getOrderByToken(token: string): Promise<Order | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM orders WHERE share_token = ${token}
  `;
  const typed = rows as unknown as Order[];
  return typed[0] ?? null;
}

export async function createOrder(data: {
  customer_name: string;
  customer_email: string;
  customer_emails: string[];
  project_name: string;
  eta_date: string | null;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  contact2_name: string | null;
  contact2_phone: string | null;
  contact2_email: string | null;
}): Promise<Order> {
  const sql = getSql();
  const stages = JSON.stringify(initStages());
  const emailsJson = JSON.stringify(data.customer_emails);
  const rows = await sql`
    INSERT INTO orders (
      customer_name, customer_email, customer_emails, project_name, eta_date,
      contact_name, contact_phone, contact_email,
      contact2_name, contact2_phone, contact2_email,
      stages
    ) VALUES (
      ${data.customer_name}, ${data.customer_email}, ${emailsJson}::jsonb, ${data.project_name},
      ${data.eta_date},
      ${data.contact_name}, ${data.contact_phone}, ${data.contact_email},
      ${data.contact2_name}, ${data.contact2_phone}, ${data.contact2_email},
      ${stages}
    )
    RETURNING *
  `;
  const typed = rows as unknown as Order[];
  return typed[0];
}

export async function updateOrder(
  id: string,
  data: {
    customer_name: string;
    customer_email: string;
    customer_emails: string[];
    project_name: string;
    eta_date: string | null;
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    contact2_name: string | null;
    contact2_phone: string | null;
    contact2_email: string | null;
    stages: Stage[];
  }
): Promise<Order> {
  const sql = getSql();
  const stages = JSON.stringify(data.stages);
  const emailsJson = JSON.stringify(data.customer_emails);
  const rows = await sql`
    UPDATE orders SET
      customer_name   = ${data.customer_name},
      customer_email  = ${data.customer_email},
      customer_emails = ${emailsJson}::jsonb,
      project_name    = ${data.project_name},
      eta_date        = ${data.eta_date},
      contact_name    = ${data.contact_name},
      contact_phone   = ${data.contact_phone},
      contact_email   = ${data.contact_email},
      contact2_name   = ${data.contact2_name},
      contact2_phone  = ${data.contact2_phone},
      contact2_email  = ${data.contact2_email},
      stages          = ${stages}::jsonb,
      updated_at      = now()
    WHERE id = ${id}
    RETURNING *
  `;
  const typed = rows as unknown as Order[];
  return typed[0];
}
