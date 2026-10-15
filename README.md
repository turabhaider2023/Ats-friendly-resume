# ATS Friendly Resume

A private resume studio that runs entirely in the browser. Upload a PDF, DOCX, or TXT to see how ATS-readable it is, or fill in fields and let the page build a single-column resume with standard headings. There is no account and no database.

The score is out of 100. It checks the name, email, phone, location or profile link, summary, experience, education, skills, bullets, action verbs, measurable results, dates, plain text, and length.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints. `npm run build` writes the site to `dist`.

## Deploy on Vercel

1. Push this folder to GitHub. Do not commit `node_modules`.
2. In Vercel, import the repository.
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.

## Kaise chalana hai

`npm install` ke baad `npm run dev` chalao. GitHub par sirf project push karo, `node_modules` nahi. Vercel me repo import karo, framework Vite rehne do, aur output folder `dist` select karo.
