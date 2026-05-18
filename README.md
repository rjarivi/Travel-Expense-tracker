# Travel Expense Tracker

Static single-page app for tracking travel expenses with dynamic split logic and Convex cloud sync.

## GitHub Pages Hosting

This repository is configured for GitHub Pages by serving `index.html` from the repo root.

### Steps

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or your default branch)
   - **Folder**: `/ (root)`
4. Save and wait for deployment to complete.

Your site URL will look like:

- `https://<username>.github.io/<repo>/`

## Convex Setup (Production)

Use your **production Convex URL** for hosted users. This app is already configured to call:

- `https://majestic-fish-796.convex.site`

### 1) Create table in Convex Dashboard

In **Data** (table editor), create table: `tripExpenses` with fields:

- `tripKey` (string, indexed)
- `expensesJson` (string)
- `updatedAt` (string timestamp)

Recommended: add an index on `tripKey` (for quick lookup by trip).

### 2) Add HTTP actions in Convex code

You need two routes:

- `POST /expenses/save`
- `GET /expenses/load?tripKey=...`

Behavior:

- Save route upserts one record per `tripKey` with serialized expenses.
- Load route returns `{ expenses: [...] }` for the provided `tripKey`.

### 3) Deploy to production

Deploy your Convex functions/actions to production so the `.convex.site` endpoints are live.

### 4) CORS / Allowed origins

If your Convex setup uses origin restrictions, allow your GitHub Pages origin:

- `https://<username>.github.io`

(and custom domain origin too, if you use one).

## What to add in Convex Dashboard / Env

### Dashboard items

- Table: `tripExpenses`
- Index: `by_tripKey` on `tripKey`
- HTTP Actions routes for `/expenses/save` and `/expenses/load`

### Environment variables (Convex)

For this current frontend, **no required env var** is needed to call Convex because URL is hardcoded in the app config.

Optional env vars (recommended if you later move secrets/guards server-side):

- `APP_WRITE_TOKEN` (if you add write protection to save endpoint)
- `ALLOWED_ORIGIN` (if you implement strict origin checks in action code)

## Production vs Dev URL

- Use `.convex.site` from production for GitHub Pages/public users.
- Use dev deployment URL only while developing/testing locally.


## I already prepared backend files for you

I added Convex backend source files in `convex/` so you can deploy directly:

- `convex/schema.ts`
- `convex/http.ts`
- `convex/README.md`

These implement your exact production routes:

- `POST https://majestic-fish-796.convex.site/expenses/save`
- `GET https://majestic-fish-796.convex.site/expenses/load?tripKey=...`


## GitHub + Convex deploy key setup (done-safe pattern)

Since you added `CONVEX_DEPLOY_KEY` in GitHub, this repo now includes CI workflows:

- `.github/workflows/deploy-convex.yml` → deploys Convex on pushes to `main`.
- `.github/workflows/preview-convex-pr.yml` → creates/updates preview deploys for PRs.

### Required GitHub secret

- `CONVEX_DEPLOY_KEY` (Repository Settings → Secrets and variables → Actions)

### Notes

- Local/dev convex identifiers are ignored by `.gitignore` to avoid accidental key/URL leaks.
- Production deploy happens only from `main` unless manually triggered via workflow_dispatch.
- PR workflow assumes your Convex project supports preview deployments with deploy key access.
