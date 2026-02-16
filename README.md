# ⚡ Authority Engine

> AI-powered content generation SaaS for building high-authority threads, hooks, articles, and shitposts.

![Built with](https://img.shields.io/badge/Built%20with-Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 🚀 Features

### 🧵 Thread Builder
Generate structured Twitter/X threads with a narrative arc architecture:
- **9 segment types** — Hook → Context → Tension → Insight → Proof → Contrarian → Expansion → Summary → CTA
- **60+ hook templates** across 6 categories (Authority, Curiosity, Data-Driven, Controversial, Story, Degen)
- **Swappable hooks & CTAs** — click to swap between generated variations
- **Engagement scoring** — multi-signal 0-100 score evaluating hook quality, structure, mode alignment, and CTA strength
- **Regeneration presets** — Make More Viral, Add Controversy, Improve to 90+

### 🎣 Hook Lab
Generate 30-40+ hooks per topic with:
- Per-hook engagement score badges
- Category filtering (Authority, Data-Driven, Curiosity, Degen, Story, Controversial)
- One-click "Use in Thread" integration

### 📝 Article Generator
Transform any topic into a structured long-form article:
- Auto-generated title, introduction, 3-5 body sections, and conclusion
- Tweet-sized excerpts for social sharing
- Copy full article in Markdown format

### 🎨 Image Engine
Premium canvas-based image generation:
- Mode-aware color palettes with layered gradients
- 4 templates — Intro Card, Data Visual, Quote Card, Meme Format
- Geometric patterns, ambient glow orbs, film grain overlay
- Logo integration with adaptive placement
- Smart typography with auto-fitting text

### 🎤 Voice Engine
Advanced voice replication from sample tweets:
- N-gram phrase extraction for signature phrases
- Punctuation pattern analysis (ellipsis, em-dashes)
- Capitalization style detection
- Vocabulary fingerprinting (top 10 words)
- Tone detection and opening pattern analysis

### 💀 Shitpost Intel
Generate degen-level shitposts with:
- 24+ format templates with narrative-aware meme captions
- Mood selection (Chaos, Cope, Alpha, Doom)
- Adjustable degen level (1-5)

### 📦 Content Pack Generator
One-click content pack combining:
- Full thread with hooks
- Short tweets
- Article excerpts
- Shitpost variations

---

## 🎯 Modes

| Mode | Icon | Optimized For |
|------|------|---------------|
| **Web3** | 🌐 | Crypto, DeFi, NFTs, DAOs, on-chain data |
| **Creator** | 🎨 | Content creators, audience growth, monetization |
| **Business** | 💼 | SaaS, startups, enterprise, revenue metrics |
| **Shitpost** | 💀 | Memes, degen culture, CT humor |
| **Educational** | 📚 | Tutorials, breakdowns, knowledge sharing |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup
- **Vanilla CSS** — Custom design system with CSS variables, glassmorphism, dark mode
- **Vanilla JavaScript** — Zero dependencies, modular architecture
- **Canvas API** — Image generation engine

---

## 📁 Project Structure

```
authority-engine/
├── index.html              # Landing page + SaaS dashboard
├── css/
│   ├── design-system.css   # Core tokens, typography, utilities
│   ├── landing.css         # Landing page styles
│   ├── dashboard.css       # Dashboard layout & components
│   └── modules.css         # Module-specific styles
└── js/
    ├── ai-engine.js        # Core AI content generation (710 lines)
    ├── app.js              # App controller & UI logic
    ├── constants.js        # Mode configs, templates, categories
    ├── image-renderer.js   # Canvas-based image engine
    └── storage.js          # LocalStorage persistence layer
```

---

## ⚡ Quick Start

1. Clone the repo:
   ```bash
   git clone https://github.com/Danexhunter/authority-engine.git
   ```

2. Open `index.html` in your browser — no build step required.

3. Select a mode and start generating content.

---

## 📄 License

MIT © [Danexhunter](https://github.com/Danexhunter)
