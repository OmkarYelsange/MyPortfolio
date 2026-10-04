# Omkar Yelsange — Data Portfolio

Dark, recruiter-focused portfolio for a Data Analyst / Data Engineer, built with React, TypeScript, Vite and Tailwind CSS v4.

## Features
- Hero with an animated data pipeline (Raw Data → AWS S3 → Databricks → SQL/PySpark → Power BI); motion is disabled under `prefers-reduced-motion`
- Recruiter snapshot with counts derived from the data files
- Project filters and search, plus a case-study page per project (`/projects/:id`)
- Technology-to-project matrix, skills, experience, education
- GitHub repositories and contribution heatmap, both with error fallbacks
- Light and dark themes (toggle in the navbar, choice remembered) with a violet / sky / pink palette; all colours are tokens at the top of `src/index.css`
- three.js visuals (hero medallion model, site-wide drifting backdrop, small rotating shapes) loaded lazily, with still frames for reduced motion
- Custom cursor ring (desktop only), loading screen (once per session), sticky case-study navigation, SVG chart components
- Contact form (EmailJS), command palette (Ctrl/Cmd+K), SEO metadata, robots.txt, sitemap.xml, JSON-LD

## Structure
```
src/
  components/  UI building blocks (Hero, DataPipeline, Projects, CommandPalette, ...)
  pages/       CaseStudy route
  data/        siteConfig.ts, projects.ts, skills.ts, experience.ts
public/        favicon, robots.txt, sitemap.xml, resume/ (add your PDF), projects/ (screenshots)
```

## Setup
```
npm install
cp .env.example .env   # fill in EmailJS values
npm run dev
npm run build
```

## Environment variables
`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`. The EmailJS template should use `{{name}}`, `{{email}}` and `{{message}}`. Never commit `.env`.

## Content rule
Nothing is invented. Blank fields in `projects.ts`, `experience.ts` and `siteConfig.ts` show "To be added" or are hidden until you fill them.

## Deployment
Import the repo in Vercel (framework preset: Vite). Add a rewrite of all paths to `/index.html` so `/projects/:id` works on refresh, and set the EmailJS variables in the project settings.

## Terminal and AI assistant
- **Terminal**: click "Terminal" in the navbar or press the backtick key. Commands: `help`, `about`, `work`, `skills`, `experience`, `education`, `contact`, `projects`, `open <id>`, `goto <section>`, `ask <question>`, `theme dark|light`, `resume`, `github`, `linkedin`, `neofetch`, `clear`, `exit`.
- **AI assistant** ("Ask AI"): suggested questions answer instantly from `src/data/knowledge.json`. Free-text questions go to `api/chat.ts`, a Vercel serverless function that calls Gemini with the same knowledge, so the key never reaches the browser.
- Set `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) in Vercel → Project → Settings → Environment Variables. Do not prefix it with `VITE_`. Without it, or when running plain `npm run dev`, the assistant falls back to keyword matching over the same knowledge. To test the real API locally, use `npx vercel dev`.
- Keep `src/data/knowledge.json` in sync with your other data files; the assistant only knows what is in it.

## Projects, images and case studies
- Projects live in `src/data/projects.ts` (taken from the GitHub repos). Each has a category, cover image and the case-study fields: problem, approach, solution, result, benefits and how it differs from other methods.
- Real screenshots are in `public/projects/<id>/` (cover.webp + numbered gallery images). Projects without a screenshot use an illustrative `cover.svg`, labelled as such on the page.
- Add a project: add an entry to `projects.ts`, drop its images into `public/projects/<id>/`, and add a line to `src/data/knowledge.json` so the AI assistant knows about it.
- Portrait: `public/images/omkar-*.webp` (replace with a new photo using the same file names).
- Terminal: `max` / `min` commands (or the header button) resize it; it follows the light/dark theme.

## Content you can edit (all in `src/data/`)
- `experience.ts`: the three roles (Data Analyst at Autoline, two internships). Add `points` for bullet details.
- `achievements.ts`: certifications (sorted latest first automatically) and co-curricular activities.
- `projects.ts`: four categories shown in this order: Data Analytics, Data Engineering, Software / Web Development, Hardware. The `order` list at the bottom controls card order. Private repositories set `private: true` and show no GitHub button.
- Photo: the background-removed portrait lives in `public/images/omkar-cutout-*.webp` (transparent WebP), with `omkar-avatar.webp` for the navbar and `og.jpg` for link previews.

## Motion, timeline and 3D
- `Timeline.tsx` renders Experience and Education as an alternating left/right card timeline; the centre line fills with colour as you scroll. On phones it becomes a single column with the line on the left.
- Reveal effect: sections, cards and grid children emerge from the background (fade + scale + blur + rise) as they scroll into view (`Reveal` in `Motion.tsx`, `.stagger` in `index.css`). `prefers-reduced-motion` turns the movement off.
- `BackToTop.tsx`: floating button (bottom-left) with a scroll-progress ring that returns to the hero.
- 3D: `HeroWorld` (hero pipeline), `Background3D` (site-wide data-themed field that follows scroll and pointer), `Globe3D` (Skills and Projects headers) and `Shape3D` (Resume, Contact), all in `Scenes.tsx`.

## Data-first structure and Other Work
- The main portfolio (`/`) is data-only: Data Analytics, Data Engineering and Data Science. Full stack, robotics, IoT and hardware live on `/other-work`. Projects are split by category in `src/data/projects.ts` (`dataProjects` / `otherProjects`); experience has a `track` field; skills are `skills` (data) and `otherSkills`.
- The AI assistant is context-aware. `src/data/knowledge.json` tags every fact and Q&A with `ctx: data | other | both`; `src/lib/pageContext.ts` detects the page; `src/lib/assistant.ts` answers only from that context and redirects off-topic questions with a button to the other page; `api/chat.ts` builds the Gemini prompt from the same context.
- `Model3D` kinds (`Scenes.tsx`) fill empty layout space: sensor, gantt, code, cap, book, medal, trophy, workflow, git, chip, orbit, db, cube, neural, globe. `FillModel` / `HeadModel` place them. Renderers exist only while on screen, so many models never exceed the browser's WebGL limit.
- Skill logos come from simple-icons (`src/data/skillIcons.ts`); skills without a brand glyph use a themed icon.
- Production URL used in SEO files: https://omkary.vercel.app
