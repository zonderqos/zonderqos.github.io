# ZonderqOS — Official Website (`zonderqos.github.io`)

Official product and engineering website for **ZonderqOS**, an experimental 64-bit operating system written in C# (.NET 10.0 Microsoft NativeAOT) on **Cosmos Kernel Gen3 (3.0.97)**.

- **Production URL:** [https://zonderqos.github.io/](https://zonderqos.github.io/)
- **Website Repository:** [https://github.com/zonderqos/zonderqos.github.io](https://github.com/zonderqos/zonderqos.github.io)
- **ZonderqOS Kernel Repository:** [https://github.com/dwierzbicki11/ZOnderqOS](https://github.com/dwierzbicki11/ZOnderqOS)
- **Current Milestone:** **Alpha Milestone Completed (100%)** (`v1.0.2-alpha.1`, Build `3120`) — Advancing into the **Beta Development Phase**.

---

## 1. Tech Stack

- **Framework:** React 19 + TypeScript (`strict: true`)
- **Bundler:** Vite 7 (`base: "/"`)
- **Styling:** Tailwind CSS 4 + shadcn/ui-inspired component architecture (`src/components/ui/`)
- **Animations:** Motion for React (`motion/react`) with full `prefers-reduced-motion` compliance
- **Icons:** Lucide React (`lucide-react`)
- **Quality & Formatting:** ESLint 9 + TypeScript ESLint + Prettier 3
- **CI/CD & Hosting:** GitHub Actions (`.github/workflows/deploy.yml`) → GitHub Pages

---

## 2. Project Structure

```text
├── .github/workflows/deploy.yml   # CI validation (npm ci, lint, typecheck, format:check, test, build) & GitHub Pages deploy
├── public/
│   ├── assets/zonderqos/          # Authentic wallpaper asset (wallpaper.webp + wallpaper.png) from ZonderqOS repo
│   ├── 404.html                   # GitHub Pages SPA refresh fallback
│   ├── favicon.svg                # ZonderqOS vector brand icon
│   ├── robots.txt                 # Search engine crawler directives
│   └── sitemap.xml                # Canonical XML sitemap
├── src/
│   ├── assets/                    # Local vector components (ZonderqLogo.tsx)
│   ├── components/                # Navbar, Footer, and reusable UI primitives (Badge, Button, Card, Lightbox, SectionHeader)
│   ├── data/                      # Strict English data catalogs (features, screenshots, roadmap, releases, development, faq, i18n)
│   ├── hooks/                     # Custom React hooks (useTheme, useScrollProgress, useReducedMotion, useActiveSection)
│   ├── lib/                       # Utilities & automated verification suite (utils.ts, languageAudit.ts, site.test.ts)
│   ├── sections/                  # Modular page sections (Hero, Features, Screenshots, Roadmap, Downloads, Development, FAQ)
│   ├── styles/                    # Global Tailwind CSS 4 theme & dark/light CSS variables
│   ├── types/                     # Strict domain TypeScript interfaces (site.ts)
│   ├── App.tsx                    # Top-level layout composition
│   └── main.tsx                   # Application entry point
```

---

## 3. Running and Testing Locally

### Prerequisites
- Node.js `>= 22.x`
- npm `>= 10.x`

### Install Dependencies
```bash
npm ci
```

### Start Development Server
```bash
npm run dev
```

### Run Validation & Production Build
```bash
# 1. Run ESLint static analysis
npm run lint

# 2. Run strict TypeScript compiler checks
npm run typecheck

# 3. Verify Prettier code formatting
npm run format:check

# 4. Run unit, roadmap, link & 100% English language audit tests
npm test

# 5. Build production static bundle into ./dist
npm run build

# 6. Preview production build locally
npm run preview
```

---

## 4. Updating Website Content (Data-Driven Architecture)

All factual project data is 100% English, decoupled from JSX presentation, and stored in `src/data/`:

- **Features & Subsystem Statuses:** Edit `src/data/features.ts`. Each item enforces `'Implemented' | 'Experimental' | 'In Development' | 'Planned'`.
- **Interactive Roadmap:** Edit `src/data/roadmap.ts`. Stage progress percentages are computed automatically by `calculateStageProgress()` in `src/lib/utils.ts` based strictly on tasks marked `'Completed'`. Stage 1 (`Alpha`) is 100% completed (`5/5` tasks).
- **Screenshots & Lightbox Gallery:** Edit `src/data/screenshots.ts`. When new verified QEMU QMP or physical hardware framebuffer captures are exported, place `.webp` / `.png` files in `public/screenshots/` matching `expectedReplacementPath` and set `isPlaceholder: false` and `src: '/screenshots/<file>.webp'`.
- **Releases & ISO Downloads:** Edit `src/data/releases.ts`. When the first public ISO release is published on GitHub Releases, set `hasPublicRelease: true` and populate `downloadUrl`, `releaseDate`, and `sha256`.
- **Hardware Compatibility & News:** Edit `src/data/development.ts`.
- **FAQ:** Edit `src/data/faq.ts`.

---

## 5. Deployment to GitHub Pages

1. Push changes to the `main` branch of `https://github.com/zonderqos/zonderqos.github.io` (or trigger the workflow manually via **Actions → Deploy ZonderqOS Website to GitHub Pages → Run workflow**).
2. In repository **Settings → Pages**, ensure **Build and deployment → Source** is set to **GitHub Actions**.
3. The workflow runs `npm ci`, `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm test`, and `npm run build` before uploading `./dist` and deploying to `https://zonderqos.github.io/`.
