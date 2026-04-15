# ප්‍රාර්ථනා (Prarthana) — Next.js web app

Cancer literacy site with animated UI, Recharts visualizations, Auth.js (Google), and Google Sheets storage for community articles and comments.

## Site photos (external URLs)

Built-in pages use **https** images from **Wikimedia Commons**, listed in [`content/site-images.ts`](content/site-images.ts). `next.config.ts` must allow `upload.wikimedia.org` (already included). Community article heroes can still use **Unsplash** (`images.unsplash.com`) or **Pexels** URLs.

## Run locally

```bash
cd web
cp .env.example .env.local
# Fill AUTH_SECRET, Google OAuth, and Sheets variables (see below)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

See [.env.example](.env.example) for all variables. Summary:

1. **AUTH_SECRET** — random string (e.g. `openssl rand -base64 32`).
2. **AUTH_GOOGLE_ID** / **AUTH_GOOGLE_SECRET** — Google OAuth client (Auth.js).
3. **GOOGLE_SERVICE_ACCOUNT_JSON** — single-line JSON for a service account with Sheets API enabled.
4. **SHEETS_SPREADSHEET_ID** — ID of a spreadsheet shared with the service account email as **Editor**.
5. **EDITOR_EMAILS** (optional) — comma-separated emails whose posts are `published` immediately.

Create tabs **`articles`** and **`comments`** with header rows exactly as documented in `.env.example`.

## Deploy (Vercel)

1. **Push the repo to GitHub** (or GitLab / Bitbucket).

2. **Import in Vercel** → New Project → pick the repo. If the repo root is the parent folder (`cancer project`), set **Root Directory** to **`web`**.

3. **Environment variables** (Project → Settings → Environment Variables). Add every key from [`.env.example`](.env.example) for **Production** (and Preview if you want previews to work):

   | Variable | Production value |
   |----------|------------------|
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` or your custom domain |
   | `AUTH_URL` | Same as public URL, **https**, no trailing slash (e.g. `https://your-domain.vercel.app`) |
   | `AUTH_SECRET` | Same as local; generate with `openssl rand -base64 32` |
   | `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Same OAuth client as local (update redirect URIs below) |
   | `GOOGLE_SERVICE_ACCOUNT_JSON` | Entire service account JSON as **one line** (minified). In Vercel, paste as one secret value. |
   | `SHEETS_SPREADSHEET_ID` | Same spreadsheet ID; sheet must still be shared with the service account email as **Editor**. |
   | `EDITOR_EMAILS` | Optional, same as local. |

4. **Google Cloud Console** (APIs & Services → Credentials → your OAuth 2.0 Client):

   - **Authorized JavaScript origins:** `https://your-production-domain` (and `http://localhost:3000` for local dev).
   - **Authorized redirect URIs:** `https://your-production-domain/api/auth/callback/google` (and `http://localhost:3000/api/auth/callback/google` for dev).

5. **Deploy.** Vercel runs `npm run build` from `web/`. After the first deploy, open the production URL and test **Sign in** and **Community** (read/write Sheets).

6. **Custom domain** (optional): Vercel → Domains → add your domain; then update `NEXT_PUBLIC_SITE_URL`, `AUTH_URL`, and Google OAuth origins/redirects to use that domain.

**Preview deployments:** Use Vercel Preview env vars or duplicate OAuth redirect URIs for each `*.vercel.app` preview URL if you need Google sign-in on previews (often people skip OAuth on previews or use a dedicated “staging” OAuth client).

### Other hosts

Any Node host can run **`npm run build`** then **`npm run start`** (port from `PORT`). Set the same env vars. For **Docker**, use a multi-stage build with `output: "standalone"` in `next.config.ts` if you add that later.

## Project note

The parent folder name `cancer project` is not a valid npm package name, so the app was generated in `web/`.
