// GET /api/state -> {key: value, ...}
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method not allowed' });
  }
  const rows = await sql`SELECT key, value FROM daily_kv`;
  const out = {};
  for (const r of rows) out[r.key] = r.value;
  res.status(200).json(out);
}
