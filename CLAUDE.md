# CLAUDE.md — Park Jaekyung Portfolio Website

## Goal
- Build a website-style portfolio from the resume and portfolio PDFs
- Design reference: https://hamol.studio/ (dark, space-like tone, numbered editorial layout)
- Mockup: `박재경 포트폴리오.html` — visual reference only, do not copy code
- Deploy: push to GitHub → Import in Vercel

## Stack
- React 19 + Vite (TypeScript, strict)
- GSAP + ScrollTrigger — scroll-driven animation (`data-reveal` / `data-reveal-group`)
- Lenis — smooth scrolling, synced with GSAP ticker via `src/hooks/useLenis.ts`
- Motion (motion/react) — overlay & component-level animations
- CSS Modules per component + `src/styles/globals.css` for design tokens & shared atoms
- Image and video assets: generated via Higgsfield MCP (video model: Seedance 2.0)

## Design Tokens (`src/styles/globals.css`)
| Token | Value |
|---|---|
| `--bg` | `#0a0c0f` |
| `--bg-raise` | `#0d1014` |
| `--text` | `#eceef0` |
| `--text-2` | `#a3a9b1` |
| `--text-3` | `#8b9199` |
| `--accent` | `oklch(0.82 0.1 235)` (blue) |
| `--border` | `rgba(255,255,255,0.11)` |
| `--font-mono` | IBM Plex Mono |
| `--font-sans` | Pretendard Variable |

## Design Tone
- Near-black background, off-white text, single accent color (blue oklch)
- `.eyebrow` / `.mono` labels: uppercase, wide-tracked
- Section numbering 01 → 04
- Hero: large headline + orbit rings + stars background
- Work: project rows → full-screen detail overlay with `Next` navigation
- Mobile: work section becomes horizontal swipe carousel
- `data-reveal` / `data-reveal-group` on elements for scroll-entrance via GSAP
- Skip link + `prefers-reduced-motion` guard in global.css

## Project Structure
```
src/
  components/
    layout/
      Header.tsx + Header.module.css   ← sticky nav, Lenis anchor scroll
    sections/
      Hero.tsx + Hero.module.css       ← intro, orbit bg, strip w/ project quick-links
      Work.tsx + Work.module.css       ← project list + mobile carousel (scroll-snap)
      About.tsx + About.module.css     ← competencies grid + skills chips
      Journey.tsx + Journey.module.css ← experience/education timeline + certs
      Contact.tsx + Contact.module.css ← contact links + footer
    ui/
      Orbit.tsx + Orbit.module.css         ← CSS-animated orbital rings + Stars
      ProjectCard.tsx + ProjectCard.module.css ← row (desktop) / snap-card (mobile)
      ProjectDetail.tsx + ProjectDetail.module.css ← slide-in panel, focus trap, Next btn
  data/
    profile.ts    ← PROFILE, COMPETENCIES, SKILLS, JOURNEY, CERTS, CONTACTS
    projects.ts   ← PROJECTS array + TypeScript interfaces
  hooks/
    useLenis.ts         ← useLenis(), scrollToTarget(), lockScroll(), onAnchorClick()
    useScrollTrigger.ts ← useReveal(root) — data-reveal / data-reveal-group
  lib/
    motion.ts     ← gsap, ScrollTrigger, Lenis re-exports (for direct component use)
  styles/
    globals.css   ← design tokens, reset, shared atoms (.pill, .chip, .eyebrow, etc.), keyframes
    global.css    ← thin wrapper: @import './globals.css' (for legacy import paths)
  types/
    index.ts      ← re-exports from projects.ts + Competency, SkillGroup, JourneyItem, Cert
  App.tsx         ← root: useLenis(), useReveal(main), activeProject state, AnimatePresence
  main.tsx        ← createRoot, imports fonts (Pretendard, IBM Plex Mono) + globals.css
public/
  assets/
    prompts.md    ← log Higgsfield generation prompts here
    (hero video/images go here as .mp4 / .webp)
  favicon.svg
index.html
```

## Animation Conventions
- **Scroll entrance**: add `data-reveal` (single element) or `data-reveal-group` (parent, children stagger) — App.tsx handles automatically
- **Hover/overlay**: use `motion/react` component animations
- **Parallax / hero**: GSAP `scrollTrigger` with `scrub` inside the component's `useLayoutEffect`

## Language
- All on-site copy is in **Korean** (data files are the source of truth)
- Section labels / eyebrows may be in English (`SELECTED WORK`, `ABOUT`)

## Content Rules
- Content follows the resume/portfolio PDFs; never alter numbers or dates
- Korean sentences use noun-ending style (~구현, ~개선), concise
- All editable content lives in `src/data/profile.ts` and `src/data/projects.ts`

## Asset Rules (Higgsfield MCP)
- Generate hero video, section backgrounds, project covers via MCP
- Save to `public/assets/` (images as `.webp`, video as `.mp4` + poster `.webp`)
- Videos: short loops (5–10 s), minimal size, `autoplay muted playsinline loop`
- Log generation prompts in `public/assets/prompts.md`

## Work Loop
**Generate → Build → Check on screen → Fix; repeat until satisfied**
1. Work on one section or feature at a time
2. `npm run build` — fix TypeScript / build errors
3. `npm run dev` — check at desktop 1440 px and mobile 390 px
4. Fix animation jank, layout breakage, design tone
5. Move to the next section only when the current one is done

## Commands
- `npm run dev` — dev server (http://localhost:5173)
- `npm run build` — production build (`tsc && node scripts/build.mjs`)
  - Why the script: on Windows, Node 24's `fs.rmSync` crashes (0xC0000409) on non-ASCII paths like `04. 공부`,
    and Vite calls it to empty `dist/`. The script clears `dist/` with unlink/rmdir and builds with `emptyOutDir: false`.
    Don't switch back to plain `vite build`, and don't use `fs.rmSync`/`fs.cpSync` in tooling here.
- `npm run preview` — preview the production build

## Deployment
- Push to a GitHub repo → Import in Vercel (Framework: Vite, Output: `dist`)
