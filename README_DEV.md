# Vallath AI Studio — Technical & Architecture Guide

This document is for software engineers, systems architects, and DevOps personnel deploying, maintaining, or expanding **Vallath AI Studio**.

---

## 🏗️ Architecture Overview

The app is built as a single-page application (SPA) with zero external backend dependencies in default **Demo Mode**. All state persists in the user's browser via `localStorage`.

```
┌─────────────────────────────────────────────────────────────────┐
│                      Vallath AI Studio SPA                      │
│                                                                 │
│   ┌───────────────┐   ┌─────────────────┐   ┌───────────────┐   │
│   │  Start Here   │   │   Ask Vallath   │   │Practice Engine│   │
│   │ (Guided Tour) │   │ (In-browser RAG)│   │ (Adaptive MCQ)│   │
│   └───────────────┘   └────────┬────────┘   └───────────────┘   │
│                                │                                │
│   ┌───────────────┐   ┌────────┴────────┐   ┌───────────────┐   │
│   │ Feedback Desk │   │  BM25 / TF-IDF  │   │Content Studio │   │
│   │(Rubric Engine)│   │ Search Engine   │   │  (Extractor)  │   │
│   └───────────────┘   └─────────────────┘   └───────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │        Centralized Brand Layer (src/brand.ts)           │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack
* **Framework:** React 19 + TypeScript (Vite 8)
* **Styling:** Tailwind CSS with custom literary theme (Playfair Display serif + Inter sans)
* **Iconography:** `lucide-react`
* **Data Visualization:** `recharts` (RadarChart, BarChart)
* **Search Engine:** Custom in-browser BM25/TF-IDF tokenizer & scoring engine (`src/utils/search.ts`)
* **State & Persistence:** React Context API + `localStorage` (`src/context/DemoContext.tsx`)

---

## ⚡ How Demo Mode Works

1. **Deterministic Execution:** By default, no API keys are required. All AI answers, rubric evaluations, MCQ adaptations, and content repurposing run deterministically over pre-bundled data in `src/data/`.
2. **Offline RAG:** The 25 markdown files in `src/data/knowledge/` are indexed into a BM25 inverted index in memory. When a user asks a doubt, query tokens are matched against document term frequencies.
3. **Guardrail Logic:** If the top BM25 document score falls below the threshold (`score < 1.8`), the engine refuses the prompt and automatically dispatches the query into the `teacherQueue`.
4. **Keyword Rubric Heuristics:** The essay evaluation engine inspects structural markers (paragraphs, transition adverbs), critical theory terms, and citation patterns to compute reliable rubric scores.

---

## 🔌 Connecting a Real LLM / RAG Backend in Production

### Step 1: Optional Direct Gemini API Integration
The application already contains an optional client-side bridge in `src/utils/gemini.ts`.
Create a `.env` file in the project root:
```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```
When present, the app automatically switches its badge from `"Demo Mode: sample data"` to `"Connected: Gemini Live"`.

### Step 2: Production Server-Side RAG Architecture (Recommended)
For full production with proprietary Vallath coaching materials:
1. **Document Ingestion Pipeline:**
   * Ingest PDFs, printed guides, and transcription texts.
   * Chunk text into 500-token sections with 10% overlap.
   * Generate vector embeddings (e.g. `text-embedding-3-small` or `text-embedding-004`).
   * Store in a managed vector database (Pinecone, ChromaDB, or pgvector on Supabase).
2. **API Endpoint (`/api/chat`):**
   * Embed incoming user query.
   * Perform vector similarity search with metadata filtering (`period`, `topic`, `exam`).
   * Enforce cosine similarity threshold (e.g., `similarity > 0.78`); reject and route to faculty if below threshold.
   * Construct prompt with verified contexts and stream response to frontend.
3. **WhatsApp Gateway:**
   * Set up a Webhook handler connected to Meta Cloud API / WhatsApp Business API.
   * Schedule daily cron at 08:00 AM IST to send interactive template messages with Quick Reply buttons (A/B/C/D).
   * Process incoming payload and reply instantly with explanations.

---

## 🎨 Swapping Branding (Zero Codebase Refactoring)

All brand identity parameters are isolated in a single configuration file:
👉 **`src/brand.ts`**

```typescript
export const BRAND = {
  name: "Vallath Education",
  shortName: "Vallath AI Studio",
  tagline: "Premier English Literature Coaching & Research Mentorship",
  subTagline: "Trivandrum, Kerala • UGC NET / JRF • Kerala SET • GATE • CUET-PG",
  institutionLocation: "Trivandrum, Kerala, India",
  logoPath: "/brand/logo.svg",
  heroImagePath: "/brand/hero.svg",
  colors: {
    primaryMaroon: "#6B1724",
    secondaryInk: "#1A2B4C",
    accentGold: "#C29B38",
    bgCream: "#FAF6F0",
  },
  // ...
};
```

To update visual assets:
1. Place the new SVG or PNG logo at `public/brand/logo.svg`.
2. Place hero graphics at `public/brand/hero.jpg` or `public/brand/hero.svg`.
3. Check `public/brand/README.txt` for resolution guidelines.

---

## 📦 Local Development & Production Build

### Running Locally
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
```
Generates optimized static assets in `dist/`.

### Deployment to Vercel / Netlify / Cloudflare Pages
* **Framework Preset:** Vite
* **Build Command:** `npm run build`
* **Output Directory:** `dist`
* **Root Directory:** `./`

No server runtime required. Can be hosted on any static object storage or CDN (S3, CloudFront, GitHub Pages, Firebase Hosting).
