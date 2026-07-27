# The Daily Tab — a food log

A tiny Next.js app for logging what you eat, styled like a paper receipt. No
sign-up, no database — entries are saved in your browser's `localStorage`, so
they stay on whichever device you use it from.

## What it does

- Add an item with calories and (optional) protein/carbs/fat
- See a running "receipt" of everything logged for the day, with a total at
  the bottom
- Step back through previous days with the `‹ ›` arrows
- Delete an item with the `×` next to it

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy: GitHub → Vercel

1. **Push this project to a new GitHub repo.**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: daily food log"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. **Import it into Vercel.**
   - Go to https://vercel.com/new
   - Choose "Import Git Repository" and pick the repo you just pushed
   - Vercel auto-detects Next.js — leave the default build settings
     (`next build`, output handled automatically)
   - Click **Deploy**

3. That's it. Vercel gives you a live URL, and every future `git push` to
   `main` redeploys automatically.

## Notes on data storage

This starts simple on purpose: everything lives in `localStorage`, so data is
**per-browser** and won't sync across devices or survive clearing site data.
If you later want it to follow you across devices, the natural next step is
to swap the `localStorage` calls in `app/page.js` for a small backend — e.g.
a [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or
[Neon](https://neon.tech) database with a couple of API routes
(`app/api/entries/route.js`) for reading/writing entries. Happy to build
that version out if you want multi-device sync.

## Project structure

```
app/
  layout.js      # fonts + HTML shell
  page.js         # all the app logic and UI (client component)
  globals.css     # the receipt/ledger design system
package.json
next.config.mjs
```
