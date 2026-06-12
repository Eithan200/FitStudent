# FitStudent 🏋️

A mobile-first web app for student nutrition and workout tracking. Full Hebrew
(RTL) interface, light/dark themes, and personal nutrition targets calculated
with the Mifflin–St Jeor equations.

**Live demo:** https://fit-student.vercel.app

> Course project — Group 42, *Foundations of Information Systems*,
> Ben-Gurion University.

---

## Features

- **Authentication** — email/password sign-up & login (Supabase Auth); sessions
  persist across reloads.
- **Onboarding** — a 4-step questionnaire that computes BMR, TDEE, a calorie
  target, and a macronutrient split.
- **Nutrition** — daily diary, meal logging (photo / manual / multi-item
  builder), a "from the fridge to the plate" recipe finder, and saved recipes.
- **Workouts** — an editable weekly plan across four disciplines (gym, yoga,
  pilates, crossfit), an in-session view with a rest timer, history, and an
  exercise library. Pilates is graded by level and yoga by style, with
  MET-based calorie estimates.
- **Profile** — editable details, a weight chart, goal switching, a configurable
  water target, and a light/dark theme that follows the device.
- **Privacy by design** — every row is protected by PostgreSQL Row Level
  Security, so each user can only read and write their own data.

---

## Tech stack

| Layer        | Technology |
|--------------|-----------|
| Framework    | React 18 + Vite |
| Routing      | React Router 6 |
| Styling      | Tailwind CSS 3 (custom CSS-variable theme) |
| Backend      | Supabase — PostgreSQL, Auth, Row Level Security |
| Charts       | Recharts |
| Icons        | Lucide React |
| Hosting / CI | Vercel (auto-deploy from GitHub) |

---

## Getting started

### Prerequisites
- Node.js 18+
- A Supabase project (free tier is enough)

### 1. Install
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Fill in your Supabase URL and anon/publishable key (Supabase dashboard →
**Project Settings → API**). The anon key is safe in the browser — RLS protects
the data. **Never** put the `service_role` key in the frontend.

### 3. Set up the database
Open the Supabase **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql).
It creates all tables and the Row Level Security policies.

### 4. Run
```bash
npm run dev      # start the dev server
npm run build    # production build
```

---

## Deployment (Vercel)

1. Import the GitHub repository into Vercel.
2. Add the environment variables (Settings → **Environment Variables**):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy. Every push to `main` redeploys automatically. SPA routing is handled
   by [`vercel.json`](vercel.json).

---

## Project structure

```
src/
  components/   reusable UI (nav, rings, toast, theme toggle, …)
  context/      auth & theme React contexts
  data/         mock data, workout templates, food presets
  lib/          Supabase client (env-only configuration)
  pages/        the five screens + onboarding
  services/     AI integration layer (mock now; Phase 2 swaps in real calls)
  utils/        nutrition formulas, date helpers
supabase/
  schema.sql    database schema + RLS policies
docs/           project documentation (PDF)
```

---

## Documentation

- **`docs/`** — Phase 1 documentation and the Phase 2 integration guide
  (Make.com · Gemini · Perplexity) as PDFs.

---

## Roadmap — Phase 2

The AI features are currently mocked in `src/services/ai.js` (every stub is
marked `// PHASE 2`). Phase 2 replaces them with real services orchestrated
through Make.com:

- **Gemini Vision** — meal-photo analysis and fridge-ingredient detection
- **Gemini** — recipe and workout-plan generation
- **Perplexity** — nutrition-fact verification

All third-party API keys live inside Make.com (server-side), never in the
frontend. See the Phase 2 guide in `docs/` for the full step-by-step.

---

## Security notes

- No credentials are committed. Configuration is read from environment
  variables only; `.env` is git-ignored.
- Row Level Security is enabled on every user table.
- The `service_role` key is never used in or shipped with the frontend.

---

*FitStudent · Group 42 · Foundations of Information Systems · Ben-Gurion University*
