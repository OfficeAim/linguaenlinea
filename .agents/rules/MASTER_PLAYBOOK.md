# MASTER PLAYBOOK: Universal Project Standards

## 🚀 1. PROJECT SETUP & ARCHITECTURE
- **Stack**: Next.js (App Router) + TypeScript + Tailwind CSS + Supabase.
- **Automation**: `SKILLS.md` in `.agents/` folder for lazy-loading custom commands and rules.
- **Structure**:
  - `frontend/`: Primary Next.js application.
  - `docs/`: Pedagogical and technical documentation.
  - `.agents/`: Automation scripts, Engram memory, and playbooks.
  - `audio-corpus/`: Source audio files (Cuban Spanish) for processing.

## 🧠 2. AI TOOLS SYNERGY (ORCHESTRATION)
- **NotebookLM (RAG)**: Pedagogical Architect. Used as the single source of truth for ERK/SLO alignment, grammar rules, and cultural content. Prevents AI hallucinations.
- **Claude**: Strategic Planner. Refines implementation plans and solves complex structural problems.
- **Antigravity**: Chief Engineer (Agent). Executes tasks, creates files, runs terminal commands, and maintains the dev environment.
- **Stitch MCP**: Exclusive UI designer for Premium Dark Mode visuals.
- **Sinergy Flow**: *Claude plans → NotebookLM grounds → Antigravity executes via SDD.*

## ⚙️ 3. SPEC-DRIVEN DEVELOPMENT (SDD) PIPELINE
Antigravity MUST follow this workflow for any new Feature or Architecture change:
1. **Explorer**: Analyze the codebase and current context.
2. **Proposer**: Suggest a technical approach.
3. **Spec & Design**: Write the specification and architecture.
4. **[HUMAN GATE]**: Wait for my explicit approval (HitL).
5. **Implementer**: Write the code (using Git Worktrees if tasks are parallel).
6. **Verifier**: Run tests and check localhost:3000.

## ✨ 4. ANIMATIONS & UI COMPONENTS CATALOG (21st.dev & Custom)
*All UI components must adhere to the Premium Dark Mode aesthetic (Coral & Gold tokens).*

### Landing Page
- **Hero**: Animated Shader Background (AnoAI via Three.js WebGL). Location: `ui/animated-shader-background.tsx`.
- **Testimonials**: TypewriterTestimonial (Hover to reveal). Location: `ui/typewriter-testimonial.tsx`.
- **Interactive Robot**: SplineScene (Desktop only). Location: `ui/splite.tsx`.
- **Container Scroll**: [21st.dev container-scroll-animation].
- **Official Logo**: `/public/images/logo-dark-final.png` (Never use emoji/text replacement).

### Content & Dashboard
- **Audio Wave Player**: Custom animated equalizer (coral-to-gold gradient). Location: `ui/audio-wave-player.tsx`. Uses real Cuban audio from `/public/audio/`.
- **Achievement Cards**: Custom Glassmorphism (Semi-transparent dark background with subtle glow).
- **About/Over Ons**: Particle Text Effect (Cycles "SPAANS", "GRATIS", "LEREN").
- **Legal/FAQ**: Clean dark cards `bg-white/5 border border-white/10`. No heavy animations.

## 🔗 5. INTEGRATIONS & AUTOMATIONS
- **Supabase (via MCP)**: Tables: `profiles`, `lessons`, `lesson_progress`, `quiz_results`, `bug_reports`.
- **Resend (Email)**: Transactional emails (Welcome, Teacher alerts). Domain verified.
- **N8N**: For automation routing (Alert to admin on 3rd failed attempt).
- **PayPal**: Dynamic donation system via `PAYPAL_EMAIL`.
*(Rule: Antigravity MUST update this section when a NEW integration is added).*

## 🚢 6. DEPLOY CHECKLIST (VERCEL & DNS)
- **Vercel**: Link repository, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Verification**: Run `npm run build` locally first.
- **Domain (linguaenlinea.eu via Strato.nl)**:
  - Delete Google Sites records (TXT and CNAME `ghs.googlehosted.com`).
  - Add Vercel A-record (`76.76.21.21`) and CNAME (`cname.vercel-dns.com`).
  - Keep Resend records (DKIM, SPF `amazonses.com`, DMARC).

## 📚 7. CORE LESSONS LEARNED (ENGRAM BASE)
*Note for Antigravity: These are legacy hardcoded lessons. ALL FUTURE lessons must be documented dynamically in `.agents/PROJECT_JOURNAL.md` using the Engram format (What/Why/Where/Learned).*
- **Case Sensitivity**: Vercel (Linux) is case-sensitive. Always use `images/` (lowercase).
- **Audio**: Convert `.wma` to `.mp3` early to avoid browser playback failures.
- **Isolate WebGL/Particles**: Always isolate Particle Engines/Spline to prevent layout shifts.
- **Routing**: Use `router.push('/')` instead of `router.back()` to avoid confusing loops.
