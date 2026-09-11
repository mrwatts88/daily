// PUT    /api/state/<key>  body is JSON; stored as-is
// DELETE /api/state/<key>
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const key = String(req.query.key || '');
  if (!key) return res.status(404).json({ error: 'not found' });
  if (req.method === 'PUT') {
    let value = req.body;
    if (typeof value === 'string') {
      try { value = JSON.parse(value); } catch (e) { return res.status(400).json({ error: 'bad json' }); }
    }
    if (value === undefined) return res.status(400).json({ error: 'bad json' });
    await sql`INSERT INTO daily_kv (key, value, updated) VALUES (${key}, ${JSON.stringify(value)}::jsonb, now())
              ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated = EXCLUDED.updated`;
    return res.status(200).json({ ok: true });
  }
  if (req.method === 'DELETE') {
    await sql`DELETE FROM daily_kv WHERE key = ${key}`;
    return res.status(200).json({ ok: true });
  }
  res.setHeader('Allow', 'PUT, DELETE');
  res.status(405).json({ error: 'method not allowed' });
}
