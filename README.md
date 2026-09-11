# The List

A single-page daily checklist plus a to-do list. `index.html` is the whole front end.

## Where it runs

- Production: Vercel project `daily`, https://daily-kappa-one.vercel.app
- State: a `daily_kv` table (key text, value jsonb) in the Neon Postgres database shared with the
  fitness app. The API in `api/state/` reads `DATABASE_URL` from the Vercel project env.
- Local: `vercel dev` runs the page and the API functions against the same Neon database,
  using the `DATABASE_URL` in `.env.local` (refresh it with `vercel env pull`).

## Deploy

```
vercel deploy --prod
```

The Vercel CLI lives under nvm, so use a login shell or call it by path.

## API

```
GET    /api/state         -> {key: value, ...}
PUT    /api/state/<key>   <- any JSON, stored as-is
DELETE /api/state/<key>
```

Keys: `the-list-items` (the items and their default order, subtasks, timers, counters, archived),
`the-list` (today's order, checks, and checked subtasks; Clear deletes it), `the-list-open`
(rows with subtasks expanded), `the-list-counts`, `the-list-punts`, `the-list-sprint`, `the-list-todos`.
