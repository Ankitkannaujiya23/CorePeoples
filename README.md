# VoteDesk

A premium, frontend-only MVP for an employee recognition / voting SaaS
("Employee of the Month" style campaigns), built with Next.js App Router,
Redux Toolkit, and Tailwind CSS.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Demo accounts

| Role     | Email             | Password    |
|----------|-------------------|-------------|
| Admin    | admin@acme.com    | password123 |
| Employee | rahul@acme.com    | password123 |

## What's real vs. mocked

Everything runs on mock data today — there is no backend, database, or
payment integration. All of it lives behind a small service layer so it's a
drop-in swap later:

- `data/` — fixtures (employees, campaigns, organization, users)
- `services/` — `authService`, `campaignService`, `employeeService`,
  `voteService`. Each function currently reads from `data/` with a small
  artificial delay; they return the same shape your Express API should
  eventually return.
- `lib/api.js` — an Axios-style client with a `MOCK_MODE` flag. Flip it to
  `false` and set `NEXT_PUBLIC_API_BASE_URL` once your Node.js + Express +
  MySQL backend is ready, then wire `services/*` to call `api.get/post/...`
  instead of the local fixtures. No UI code needs to change.
- `store/` — Redux Toolkit slices (`auth`, `organization`, `campaigns`,
  `employeeDirectory`, `votes`, `ui`) with thunks that already call the
  service layer.

Auth and votes persist to `localStorage` for now, purely so the demo
survives a refresh — replace with real session/cookie handling when the
backend lands.

## Structure

```
app/            Next.js App Router routes (public, admin, employee)
components/     ui/ layout/ dashboard/ campaign/ landing/
data/           Mock fixtures
services/       Mock service layer (API-shaped)
store/          Redux Toolkit store + slices
lib/            api client, constants, utils
```

## Product rules simulated in the UI

- One vote per employee per campaign
- No voting before the start date or after the end date
- Draft campaigns are never shown to employees
- Completed campaigns are read-only
- A campaign needs at least one candidate, and its end date must be after
  its start date

These are enforced here for UX purposes only — the real backend must
enforce them again server-side.
