# 🐦 Flappy Bird — Production Monorepo & Chrome Extension
# 🐦 Flappy Hop — Production Monorepo & Chrome Extension

**Live Web App**: [https://flappyhop.netlify.app/](https://flappyhop.netlify.app/)

A production-grade, 100% client-side retro arcade game built with **React 19**, **TypeScript**, **HTML5 Canvas**, and **Tailwind CSS**. Includes an ultra-smooth 60/120 FPS delta-time game loop, Web Audio API sound synthesis, unlockable bird skins, deterministic daily challenges, lifetime statistics, Manifest V3 Chrome Extension, and technical SEO optimizations following the Master Architecture specification.

---

## 🚀 Key Architectural Highlights

- **`packages/core`**: Zero-dependency, platform-agnostic TypeScript physics and game engine. Handles delta-time physics, AABB collision detection, dynamic difficulty progression, Mulberry32 deterministic daily challenges, achievement progress, and rolling lifetime stats. Covered by Vitest unit tests.
- **`packages/web`**: High-performance React 19 + Vite web application:
  - **HTML5 Canvas Renderer**: High-DPI support, parallax skies, moving clouds, metallic rounded pipes, particle effects, and multi-frame wing flap animations.
  - **Web Audio API**: Instant, zero-latency retro sound effects without external audio asset downloads.
  - **Rule A (Google Search Favicon Suite)**: Multi-resolution `favicon.ico` (16, 32, 48), `favicon-48x48.png` (critical for Google SERP), 96x96, 180x180 Apple Touch Icon, and PWA icons.
  - **Rule B (Site Name Schema)**: Schema.org `WebSite`, `WebApplication`, and `FAQPage` JSON-LD to prevent Netlify site name overrides in search results.
  - **Rule C (Zero-FOUC `<noscript>`)**: Pre-rendered semantic HTML block containing rich keyword content, instructions, features, and FAQs for Googlebot indexing without UI flash.
  - **Rule D (Privacy Cannibalization Protection)**: Dedicated `/privacy` route with `<meta name="robots" content="noindex, follow">`, passing incoming Chrome Web Store link equity while preventing homepage SERP cannibalization.
- **`packages/extension`**: Manifest V3 Chrome Extension providing a toolbar popup version of the game and background service worker context menu shortcuts.

---

## 📂 Repository Structure

```text
├── packages/
│   ├── core/                        # Zero-dependency TypeScript game engine
│   │   ├── src/
│   │   │   ├── achievements.ts      # Achievement registry & evaluations
│   │   │   ├── collision.ts         # AABB & boundary collision checks
│   │   │   ├── constants.ts         # Physics, themes, skins, constants
│   │   │   ├── dailyChallenge.ts    # Date-seeded Mulberry32 PRNG
│   │   │   ├── index.ts
│   │   │   ├── physics.ts           # Delta-time normalized physics
│   │   │   ├── pipeGenerator.ts     # Procedural pipe layout & difficulty
│   │   │   ├── stats.ts             # Lifetime statistics calculator
│   │   │   └── types.ts
│   │   ├── tests/
│   │   │   └── core.test.ts         # Vitest unit test suite
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                         # React 19 + Vite Web Application
│   │   ├── public/
│   │   │   ├── _redirects
│   │   │   ├── robots.txt
│   │   │   ├── sitemap.xml
│   │   │   ├── site.webmanifest
│   │   │   ├── favicon.svg
│   │   │   ├── favicon-48x48.png     # Google Search SERP requirement
│   │   │   ├── favicon.ico           # Multi-size binary (16, 32, 48)
│   │   │   ├── favicon-16x16.png
│   │   │   ├── favicon-32x32.png
│   │   │   ├── favicon-96x96.png
│   │   │   ├── apple-touch-icon.png
│   │   │   ├── icon-192.png
│   │   │   ├── icon-512.png
│   │   │   └── og-image.png          # 1200x630 social preview
│   │   ├── src/
│   │   │   ├── audio/soundEngine.ts # Web Audio API sound synthesis
│   │   │   ├── canvas/renderer.ts   # Canvas 60/120 FPS high-DPI pipeline
│   │   │   ├── components/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── GameCanvas.tsx
│   │   │   │   ├── GameHUD.tsx
│   │   │   │   ├── StartScreen.tsx
│   │   │   │   ├── GameOverModal.tsx
│   │   │   │   ├── StatsModal.tsx
│   │   │   │   ├── AchievementsModal.tsx
│   │   │   │   ├── SkinsModal.tsx
│   │   │   │   ├── LandingContent.tsx
│   │   │   │   ├── PrivacyPolicy.tsx # noindex, follow protection
│   │   │   │   └── NotFound.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useGame.ts
│   │   │   │   └── useTheme.ts
│   │   │   ├── App.tsx
│   │   │   ├── index.css
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── extension/                   # Manifest V3 Chrome Extension
│       ├── public/
│       │   ├── manifest.json
│       │   └── icons/
│       ├── src/
│       │   ├── background/background.ts
│       │   └── popup/
│       │       ├── Popup.tsx
│       │       └── main.tsx
│       ├── popup.html
│       ├── package.json
│       └── vite.config.ts
│
├── scripts/
│   └── build-favicons.mjs           # Headless Chrome icon generator
├── netlify.toml                     # Caching headers, SPA redirects, MIME types
├── package.json                     # Monorepo workspaces root
├── tsconfig.json
└── README.md
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
npm test
```

### 3. Start Development Server
```bash
npm run dev:web
```
Visit `http://localhost:5173` in your browser.

### 4. Build Favicon Suite (via Headless Chrome)
```bash
npm run build:favicons
```

### 5. Build for Production
```bash
# Build Web App for Netlify
npm run build:web

# Build Chrome Extension
npm run build:ext

# Build all packages
npm run build
```

---

## 🔌 Installing the Chrome Extension Locally

1. Run `npm run build:ext`.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top right corner).
4. Click **Load unpacked** and select `packages/extension/dist/`.
5. Pin the 🐦 Flappy Bird icon to your Chrome toolbar to play instantly.

---

## 🎮 Controls

| Platform | Action | Input |
|---|---|---|
| **Desktop Keyboard** | Flap Wings | `Space` or `Arrow Up` |
| **Desktop Mouse** | Flap Wings | Left Click on game screen |
| **Mobile / Tablet** | Flap Wings | Screen Tap |
| **Desktop Keyboard** | Pause / Resume | `P` |

---

## 🏆 Bird Skins (100% Free & Unlocked)

All cosmetic styles are completely free and unlocked from the very start:
- **Classic Flyer**: Default arcade golden bird.
- **Thunder Eagle**: Fierce raptor with sharp reflexes.
- **Neon Canary**: High-voltage vibrant plumage.
- **Sky Penguin**: Defying physics with cold confidence.
- **Astro Rocket**: High-speed arcade projectile.
- **Cyber 8-Bit**: Retro neon scanline champion.

---

## 👤 Author & Links

Developed with ❤️ by **Shoaib M. Arif**:

- **Portfolio**: [shoaibarif.vercel.app](https://shoaibarif.vercel.app/)
- **GitHub**: [@shoaibmarif](https://github.com/shoaibmarif)
- **LinkedIn**: [shoaibmarif](https://www.linkedin.com/in/shoaibmarif/)


