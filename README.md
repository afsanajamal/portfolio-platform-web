# Project & Portfolio Platform Web

Frontend for the **Project & Portfolio Platform API**.

Tech:
- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- next-intl (English/Japanese localization)
- Vitest + React Testing Library
- Playwright (1 E2E test)

## Quick Start

1) Install
```bash
npm install
```

2) Configure env
```bash
cp .env.example .env.local
```

3) Run
```bash
npm run dev
```

Open: http://localhost:3000

## Environment

- `NEXT_PUBLIC_API_BASE_URL` (default: `http://127.0.0.1:8000`)

## Scripts

- `npm run dev` – start dev server
- `npm run test` – run unit/component tests (watch)
- `npm run test:run` – run tests once
- `npm run e2e` – run Playwright E2E (requires dev server running)

## Localization

Routes are prefixed with locale:
- `/en/...`
- `/ja/...`

Language switcher is available in the top nav.
