# CLAUDE.md

Keep your replies extremely concise and focus on conveying the key information. No unnecessary fluff, no long code snippets.

Whenever working with any third-party library or something similar, you MUST look up the official documentation to ensure that you're working with up-to-date information.
Use the DocsExplorer subagent for efficient documentation lookup.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server (localhost:3000)
pnpm build        # production build
pnpm lint         # ESLint
pnpm format       # oxfmt formatter
pnpm format:check # check formatting without writing
```

No test suite is configured.

## Architecture

Next.js 16 App Router, single-page, TypeScript. Package manager: **pnpm**.

**What this builds:** A room-photo upload → AI restyle → before/after slider app using Google Gemini's image model. See `SPEC.md` for the full product specification.

### Planned file layout (from SPEC.md — not yet built)

```
app/
  layout.tsx
  page.tsx                  # client component orchestrating the full flow
  globals.css               # CSS variables + Tailwind v4 base
  api/redesign/route.ts     # server route — Gemini call, holds API key
components/
  ui/                       # shadcn primitives (Button, Textarea, Select, Toast, etc.)
  Hero, Uploader, StylePicker, RoomTypeSelect, DetailsInput
  GenerateButton, LoadingState, BeforeAfter, ResultActions, ExampleGallery
lib/
  styles.ts   # style preset definitions (id, name, prompt fragment, thumb)
  prompt.ts   # buildPrompt(style, roomType, details?)
  image.ts    # client-side resize/compress + base64 helpers
components.json             # shadcn config (path aliases, CSS vars, style)
public/
  examples/   # curated before/after demo pairs
  thumbs/     # style card thumbnails
```

### Key architectural constraints

- **API key lives only on the server** (`GEMINI_API_KEY` in `.env.local`). Never import server-only code in client components.
- **No DB, no auth, no state library** — everything is React state for the session.
- **Client-side image compression** before uploading (target ~1024–1536px longest edge).
- One API route: `POST /api/redesign` accepts `{ image, mimeType, style, roomType, details? }` and returns `{ image: "data:image/png;base64,..." }` or `{ error }`.

### Environment variables

```
GEMINI_API_KEY=...
GEMINI_IMAGE_MODEL=gemini-2.5-flash-image   # swap to gemini-3-pro-image for higher fidelity
```

### Styling

- **Tailwind CSS v4** — config is in `postcss.config.mjs`; no `tailwind.config.*` file.
- `.agents` and `.claude` directories are excluded from Tailwind source scanning (see `globals.css`).
- Design system: warm architectural neutrals (`#F4EFE7` bg, `#211C16` text), one accent (terracotta `#B5562E` or sage `#7C8567`). All colors as CSS variables.
- Fonts: **Fraunces** (display serif) + **Hanken Grotesk** or **Geist** (body) via `next/font/google`. Do **not** use Inter, Roboto, or system fonts.

### Path alias

`@/*` resolves to the repo root (e.g. `@/lib/prompt`, `@/components/Hero`).

### Dependencies

- `@google/genai` — Gemini SDK for image generation
- `motion` — animation (framer-motion v12+)
- `shadcn/ui` — UI primitives; components live in `components/ui/`, config in `components.json`
