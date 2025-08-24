CO₂ Receipt — Repository Context

1) Project Overview (Detected)
- Runtime: Next.js 15, React 19, TypeScript
- Styling: Tailwind CSS v4 (with @tailwindcss/postcss), tw-animate-css
- UI libs: Radix UI (@radix-ui/*), lucide-react, class-variance-authority, tailwind-merge
- Auth: next-auth
- Utilities: date-fns, exifr, jszip, zod, framer-motion
- Package manager: npm (package-lock.json present)

2) Scripts (from package.json)
- dev: next dev --turbopack
- build: next build
- start: next start
- lint: next lint

3) Structure (top-level)
- package.json, tsconfig.json, eslint.config.mjs, next.config.ts, postcss.config.mjs
- public/ (assets)
- src/
  - app/ (Next.js App Router)
    - a/[id]/, app/, activities/, api/, hub/[orgId]/, join/[id]/, w/[id]/, welcome/, new/, r/[slug]/, factors/
  - components/ (ui primitives and layout)
  - lib/ (auth, utils, demo)
- components.json (design tokens)

4) UI & DX Conventions
- Tailwind CSS v4 utilities; PostCSS configured
- shadcn-style UI using class-variance-authority and Tailwind
- Icons via lucide-react
- ESLint: eslint + eslint-config-next (see eslint.config.mjs)
- TS path alias: "@/*" → "./src/*" (tsconfig.json)

5) Coding Rules
- Prefer TypeScript
- Import via '@/...' aliases where available
- Keep ESLint clean; follow Next.js + TS rules from eslint.config.mjs

6) Build / Run
- Install: npm install
- Dev: npm run dev
- Build: npm run build
- Start: npm run start
- Lint: npm run lint

7) ChangeLog / Tests
- No CHANGELOG detected
- No tests or test scripts detected; lint only


