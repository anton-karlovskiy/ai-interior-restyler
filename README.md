# AI Interior Restyler

Upload a photo of any room, pick an interior design style, and get back a photorealistic restyled version - same walls and camera angle, new furniture and mood. Revealed through a draggable before/after comparison slider.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Google Gemini** (`gemini-2.5-flash-image`) - image-to-image restyle
- **Tailwind CSS v4** + **shadcn/ui** (base-nova)
- **Motion** (framer-motion v12+) for animation
- Fonts: Fraunces (display) + Hanken Grotesk (body)

## Setup

```bash
pnpm install
```

Create `.env.local`:

```
GEMINI_API_KEY=your_key_here
GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
```

Get an API key from [Google AI Studio](https://aistudio.google.com).

## Commands

```bash
pnpm dev          # dev server at localhost:3000
pnpm build        # production build
pnpm lint         # ESLint
pnpm format       # oxfmt formatter
pnpm format:check # check formatting without writing
```

## How It Works

1. User uploads a room photo (JPEG/PNG/WebP) - compressed client-side to ~1024–1536px
2. Selects a design style (Scandinavian, Japandi, Modern Minimalist, Mid-Century, Industrial, Warm Bohemian) and optionally a room type + custom details
3. Browser POSTs base64 image + parameters to `/api/redesign`
4. Server calls Gemini with a geometry-preserving prompt - walls, windows, camera angle stay the same
5. Restyled image returned as base64 and revealed in the before/after slider

## Deploy

Zero-config on Vercel. Set `GEMINI_API_KEY` (and optionally `GEMINI_IMAGE_MODEL`) as environment variables.

For higher fidelity swap the model:

```
GEMINI_IMAGE_MODEL=gemini-3-pro-image
```
