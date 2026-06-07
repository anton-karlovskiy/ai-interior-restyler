# SPEC.md — AI Interior Restyler (Demo Prototype)

> **For the builder (Claude Code):** This is a client-facing demo, not a production app. The goal is to _impress a non-technical client_ with (1) a beautiful, distinctive, organic UI and (2) high-quality AI results. Optimize for visual polish and a delightful single-flow experience. Keep the backend deliberately thin. Do **not** add auth, payments, databases, or user accounts.

---

## 1. What we're building

A single-page web app where a user uploads a photo of a room, picks an interior-design style, and gets back a photorealistic restyled version of that exact room — same walls, windows, and camera angle, new furniture, materials, and mood. The result is revealed through a draggable before/after comparison slider.

Think: "Upload your living room → see it as a Scandinavian/Japandi/Mid-Century space in ~10 seconds."

This is the same product _shape_ as roomGPT, but a fresh, more refined implementation. Reference roomGPT only for UX patterns (see §12), not its outdated internals.

## 2. Success criteria

The demo succeeds if:

- The client says "wow" at the **before/after reveal** and the **overall look** of the app.
- The full flow (upload → style → result) feels effortless and fast, with no dead/blank moments.
- Results preserve room geometry while convincingly changing the style.
- Nothing visibly breaks during a live demo (graceful errors + a curated example fallback).
- The app looks like a real, designed product — **not** a generic AI tool.

## 3. Scope

**In scope**

- One-page app, fully responsive (laptop-first, must also look good on a tablet).
- Image upload (drag-and-drop + click).
- Style selection (visual cards) + optional room-type hint.
- AI restyle via the Gemini "Nano Banana" image API (server-side route).
- Elegant loading experience.
- Before/after draggable comparison slider.
- Download result.
- "Try another style" / regenerate.
- A small pre-loaded gallery of example transformations (demo safety net).

**Explicitly out of scope** (do not build)

- Auth, user accounts, payments.
- Database / persistence (everything lives in client state for the session).
- Multi-page routing, dashboards, settings.
- True 3D / navigable views (this produces a restyled 2D image, not a 3D model).
- Floor-plan parsing (a later phase, not this prototype).

## 4. Tech stack

- **Next.js** (App Router) + **TypeScript**.
- **Tailwind CSS** for styling.
- **Motion** (`motion` / framer-motion) for animation.
- **Google Gen AI SDK**: `@google/genai`.
- No DB, no ORM, no state library beyond React state.
- Deploy target: Vercel (zero-config). Keep it deployable from day one.

## 5. Architecture & data flow

```
Browser (client component)
  → resize/compress image client-side
  → POST base64 + style + roomType to /api/redesign
        Next.js Route Handler (server, holds API key)
          → calls Gemini image model (Nano Banana)
          → returns restyled image (base64)
  ← render before/after slider
```

- The Gemini API key lives **only** on the server (route handler). Never expose it to the client.
- One route handler: `app/api/redesign/route.ts`.
- No streaming needed; a single request/response is fine.

## 6. AI integration (the core)

### Model

- **Default:** `gemini-2.5-flash-image` (Nano Banana) — fast, ~$0.039/image, ideal for a responsive demo.
- **Optional "hero" upgrade:** `gemini-3-pro-image` (Nano Banana Pro) — higher fidelity and better instruction-following, but slower/pricier. Expose the model name as a single constant/env var so it can be swapped in one line for screenshots or a high-stakes demo.
- Note: all outputs include an invisible **SynthID** watermark (harmless for this use case; just be aware).

> **Verify before building:** model names and SDK signatures evolve. Confirm against the official docs: https://ai.google.dev/gemini-api/docs/image-generation before finalizing. Get an API key from Google AI Studio (https://aistudio.google.com).

### SDK pattern (image editing = image + text prompt → image)

```ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";

const result = await ai.models.generateContent({
  model: MODEL,
  contents: [
    {
      role: "user",
      parts: [
        { text: prompt }, // see §11
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
      ],
    },
  ],
});

// Extract the returned image
const parts = result.candidates?.[0]?.content?.parts ?? [];
const imagePart = parts.find((p) => p.inlineData);
const outBase64 = imagePart?.inlineData?.data; // base64 PNG/JPEG
```

### Route handler contract

`POST /api/redesign`

Request (JSON):

```json
{
  "image": "<base64, no data: prefix>",
  "mimeType": "image/jpeg",
  "style": "scandinavian",
  "roomType": "living room",
  "details": "keep the fireplace, add more natural plants, use darker wood tones"
}
```

(`details` is optional — omit or pass `""` to skip.)

Response (JSON):

```json
{ "image": "data:image/png;base64,<...>" }
```

or, on failure:

```json
{ "error": "human-readable message" }
```

- Validate inputs; cap image size server-side; return clean error messages (never leak stack traces).
- Set a sensible timeout and handle the model returning text-only / no image (retry once, then surface a friendly error).

## 7. Core features (demo essentials)

1. **Upload** — drag-and-drop zone _and_ click-to-browse. Show an immediate preview. Accept JPEG/PNG/WebP. **Compress/resize client-side** to ~1024–1536px longest edge before upload (faster, avoids body-size limits, lowers cost).
2. **Style selector** — visual cards (not plain buttons), each with a representative thumbnail + name. Selected state is obvious and tactile. ~6 styles (see §11).
3. **Room-type hint** (optional, subtle) — a small dropdown/segmented control (living room, bedroom, kitchen, dining, office, bathroom). Improves prompt quality; keep it unobtrusive.
4. **Optional details** — a small, unobtrusive textarea (2–3 visible rows) placed below the room-type hint. Placeholder copy should inspire rather than instruct: _"e.g. keep the fireplace, add more plants, darker wood tones…"_. This is the highest-leverage quality lever: specific user instructions get appended verbatim to the prompt, directly improving geometry fidelity and style accuracy. The field is entirely optional — generation works fine without it — but power users who fill it in should get noticeably better results.
5. **Generate** — one clear primary action. Disabled until an image + style are chosen.
6. **Loading experience** — NOT a bare spinner. Use a tasteful animated state: a soft shimmer/grain over the source image + rotating descriptive captions (e.g., "Studying the room's light…", "Selecting materials…", "Styling the space…"). This perceived-progress moment is part of the wow.
7. **Before/after reveal (signature interaction)** — a draggable comparison slider over the original vs. restyled image. Must feel buttery: pointer + touch support, a clear handle, smooth motion. This is the centerpiece — invest here.
8. **Download** — download the restyled image at full resolution.
9. **Try another style / regenerate** — re-run on the same photo without re-uploading.
10. **Example gallery (demo safety net)** — 3–4 pre-baked before/after pairs the presenter can show instantly, so the demo is never empty and never depends solely on a live call landing well. Curate these to look excellent.

## 8. UI/UX & design language

**Commit fully to one bold, cohesive aesthetic. Do NOT produce a generic AI-app look** (no purple-on-white gradients, no Inter/Roboto/system fonts, no cookie-cutter centered card).

### Chosen direction: "Quiet luxury / editorial architectural"

Warm, refined, magazine-like — the feel of a high-end interior-design publication (Architectural Digest / Kinfolk / Cereal). Calm, confident, lots of negative space, photography-forward. This signals craft and taste to a non-technical client far better than a "techy" UI.

- **Typography:** Pair a characterful display serif with a clean humanist grotesque. Recommended: **Fraunces** (display, use its optical/soft settings for warmth) + **Hanken Grotesk** or **Geist** (body). Commit to one pairing. Do **not** use Inter, Roboto, system fonts, or Space Grotesk. Use large, editorial display sizing for the hero headline.
- **Color:** Warm architectural neutrals as the base — bone/alabaster background (e.g. `#F4EFE7`), deep espresso/charcoal text (e.g. `#211C16`), with **one** restrained accent (warm clay/terracotta `#B5562E` _or_ muted sage `#7C8567` — pick one). Define all colors as CSS variables. Dominant neutral + one sharp accent; avoid timid evenly-distributed palettes.
- **Motion:** One well-orchestrated page-load with staggered reveals beats scattered micro-interactions. Animate the before/after result into view. Style cards lift subtly on hover. Keep easing soft and natural ("organic"), never bouncy-gimmicky.
- **Spatial composition:** Editorial, asymmetric, generous whitespace. Let the room imagery be large and dominant. Avoid the default centered-single-column layout — give it a designed, intentional grid.
- **Atmosphere/details:** Subtle film grain/noise overlay, soft layered shadows, optional faint warm gradient. Restrained, not busy. Rounded-but-not-bubbly corners, fine hairline dividers.
- **Empty/initial state** should already look beautiful (hero + example imagery), so the app impresses before any generation runs.

### "Organic" feel checklist

- No hard jank: every state transition (idle → loading → result) is animated.
- Real, tactile drag on the comparison slider.
- Thoughtful copy/microcopy in a warm editorial voice.
- Looks intentional at every viewport width.

## 9. Suggested file structure

```
app/
  layout.tsx            // fonts, global atmosphere (grain, bg)
  page.tsx              // single-page flow (client component orchestration)
  api/redesign/route.ts // server: Gemini call
  globals.css           // CSS variables, base styles
components/
  Hero.tsx
  Uploader.tsx          // drag-drop + preview + client-side resize
  StylePicker.tsx       // visual style cards
  RoomTypeSelect.tsx    // optional hint control
  DetailsInput.tsx      // optional free-text details textarea
  GenerateButton.tsx
  LoadingState.tsx      // shimmer + rotating captions
  BeforeAfter.tsx       // draggable comparison slider (signature)
  ResultActions.tsx     // download / regenerate / try another
  ExampleGallery.tsx    // pre-baked demo pairs
lib/
  styles.ts             // style preset definitions (id, name, prompt fragment, thumb)
  prompt.ts             // buildPrompt(style, roomType)
  image.ts              // client-side resize/compress + base64 helpers
public/
  examples/             // curated before/after demo images
  thumbs/               // style card thumbnails
```

## 10. Prompt engineering (where quality lives)

Build the prompt from a fixed **structure-preservation instruction** + the selected **style fragment** + the **room type**. Geometry preservation is the single most important instruction.

`lib/prompt.ts`:

```ts
export function buildPrompt(styleFragment: string, roomType: string, details?: string) {
  return [
    `Restyle this ${roomType} in the following interior design style: ${styleFragment}.`,
    `Keep the room's architecture EXACTLY the same — do not move or alter the walls,`,
    `windows, doors, ceiling, floor layout, room dimensions, or the camera angle and`,
    `perspective. Only change furniture, decor, materials, textures, colors, rugs,`,
    `lighting fixtures, and styling to match the chosen aesthetic.`,
    `Preserve the natural light direction coming from the existing windows.`,
    `Output a single photorealistic, professionally photographed interior image with`,
    `realistic proportions, accurate shadows, and magazine-quality composition.`,
    ...(details?.trim() ? [`Additional instructions from the user: ${details.trim()}`] : []),
  ].join(" ");
}
```

### Style presets (`lib/styles.ts`)

Define ~6. Each: `id`, display `name`, a `prompt` fragment (rich, specific), and a `thumb`. Suggested set:

- **Scandinavian** — light woods, white and soft-grey palette, clean simple forms, cozy minimal "hygge" textiles, plenty of natural light, uncluttered.
- **Japandi** — Japanese-Scandinavian blend, warm neutral tones, low natural-wood furniture, handmade ceramics, calm and uncluttered, soft diffused light.
- **Modern Minimalist** — monochrome neutral palette, sleek low-profile furniture, hidden storage, sculptural lighting, negative space, refined and airy.
- **Mid-Century Modern** — walnut wood, tapered legs, warm mustard/teal/olive accents, iconic 1950s–60s furniture silhouettes, statement lighting.
- **Industrial** — exposed-brick and concrete tones, blackened metal, leather and aged wood, Edison-style lighting, raw but warm.
- **Warm Bohemian** — layered textiles, rattan and natural fibers, terracotta and earthy tones, plants, eclectic warm and inviting styling.

(Use these descriptions as the prompt fragments; tune wording during testing.)

## 11. Environment & setup

`.env.local`:

```
GEMINI_API_KEY=your_key_here
GEMINI_IMAGE_MODEL=gemini-2.5-flash-image   # swap to gemini-3-pro-image for hero quality
```

Setup:

```bash
npx create-next-app@latest interior-restyler --ts --tailwind --app
cd interior-restyler
npm install @google/genai motion
# add fonts (Fraunces + Hanken Grotesk/Geist) via next/font
npm run dev
```

## 12. What to reference from roomGPT (UX only)

- Dead-simple single-flow: upload → pick → result, no clutter.
- A clear style selector and an obvious primary action.
- The before/after comparison as the payoff moment.

Improve on it with: a far more distinctive visual identity, a richer loading state, visual style cards (vs. a plain dropdown), and the curated example gallery.

## 13. Error handling & edge cases

- No image / no style selected → primary action disabled with a gentle hint.
- Upload too large / wrong type → friendly inline message; auto-resize handles most cases.
- API returns no image or errors → retry once silently, then show a warm error toast and keep the UI usable.
- Slow network → the loading state must never look frozen (animated captions cover this).
- Keep the API key server-side; never log it.

## 14. Polish checklist (do before calling it done)

- [ ] Initial state already looks designed and intentional (hero + examples).
- [ ] Every state transition is animated; no blank flashes.
- [ ] Before/after slider works with mouse AND touch, feels smooth.
- [ ] Fonts are the chosen distinctive pairing (not Inter/system).
- [ ] One cohesive color theme via CSS variables; one accent only.
- [ ] Responsive at laptop and tablet widths.
- [ ] Download produces a clean full-res image.
- [ ] At least 3 curated example pairs load instantly.
- [ ] No console errors; graceful failure on a bad API call.
- [ ] Optional details textarea is present, unobtrusive, and its content is reflected in the prompt.

## 15. Recommended build order (de-risk first)

1. **Prove model quality first** — before UI, run the route handler (or a one-off script) against 8–10 real room photos across styles. Confirm geometry holds and results impress. Lock the prompt template here.
2. Scaffold Next.js + fonts + design tokens (globals.css, layout) — get the _look_ right with static content.
3. Build the upload + client-side resize + preview.
4. Build the style picker + room-type hint.
5. Wire the `/api/redesign` route and the generate flow end-to-end.
6. Build the loading state and the before/after slider (spend real time here).
7. Add download + regenerate + example gallery.
8. Final polish pass against §14.

---

**North star:** a non-technical client should feel they're looking at a finished, tasteful product — and the before/after reveal should make them lean in.
