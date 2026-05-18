# Convex backend setup

This folder contains the required Convex backend pieces for this app.

## Deploy to your production project

Use your provided production deployment:
- Cloud URL: https://beloved-cod-897.convex.cloud
- HTTP Actions URL: https://beloved-cod-897.convex.site

### Steps

1. In a terminal with Convex CLI installed, log in and link this project to your Convex project.
2. Deploy these functions/schema to production.
3. Verify endpoints:
   - POST https://beloved-cod-897.convex.site/expenses/save
   - GET  https://beloved-cod-897.convex.site/expenses/load?tripKey=test

## Notes

- Data is stored in `tripExpenses` table with index `by_tripKey`.
- CORS is enabled for browser usage from GitHub Pages.
