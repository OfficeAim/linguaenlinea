# MASTER PLAYBOOK: Universal Project Standards

## 🚀 Project Setup
- **Stack**: Next.js (App Router) + TypeScript + Tailwind CSS + Supabase.
- **Automation**: `SKILLS.md` in `.agents/` folder for custom commands like `/start`.
- **Structure**:
  - `frontend/`: Primary Next.js application.
  - `docs/`: Pedagogical and technical documentation.
  - `.agents/`: Automation scripts, project state, and playbooks.
  - `audio-corpus/`: Source audio files for processing.

## 🎨 Design Workflow  
- **Stitch -> Antigravity**: Use Stitch for initial UI (Premium Dark Mode) → Export HTML → Antigravity converts to React TSX.
- **Brand Identity**: Define tokens (Coral, Gold) in `tailwind.config.ts` immediately after project init.
- **Choice**: Use Stitch for structural frames and complex components; code directly for simple logic-heavy parts.

## 🧠 AI Tools Stack
- **NotebookLM**: Pedagogical architect. Used for sources, ERK/SLO alignment, and Dutch video scripts.
- **Claude**: Strategic planner. Refines implementation plans, reviews documentation, and solves complex structural problems.
- **Antigravity**: Chief Engineer. Executes tasks, creates files, runs commands, and maintains the dev environment.
- **Synergy**: Claude plans → NotebookLM grounds → Antigravity executes.

## ✨ Animations & UI Components — 21st.dev Catalog
Organized catalog of tested and recommended components from [21st.dev](https://21st.dev).

### Landing Pages
- **Container Scroll**: [21st.dev/community/components/container-scroll-animation](https://21st.dev)
  - **Language**: Dutch (NL) / Spanish (ES) / English (EN)
- **Official logo**: `/public/images/logo-dark-final.png` (Never use emoji or text as logo replacement)
- **L1 Sensitivity**: L1 field in `profiles` determines instructional language.
  - **Location**: `frontend/src/app/landing/page.tsx` (Lesson Preview).

### Dashboard
- **Achievement Cards**: Custom Glassmorphism.
  - **Status**: ✅ Tested and working
  - **Adaptation**: Semi-transparent dark background with subtle glow.

### About / Over Ons
- **Particle Text Effect**: [21st.dev/community/components/particle-text](https://21st.dev)
  - **Status**: ✅ Tested and working
  - **Adaptation**: Cycles "SPAANS", "GRATIS", "LEREN" in Brand Coral/Gold.
  - **Location**: `frontend/src/app/over-ons/page.tsx`.

### Lesson / Content pages
- **Video Player**: Custom YouTube integrated.
  - **Status**: ✅ Tested and working
  - **Adaptation**: Minimal controls, Dark Mode overlay.

## 🔧 Dev Workflow
- **State Persistence**: Git commits via `./save.sh`.
- **Analytics**: `session-log.sh` for developer velocity tracking.
- **Server Safety**: `pkill -f "next dev" && npm run dev` to avoid port 3000 collisions.
- **QA**: `localStorage.clear()` in incognito for clean onboarding testing.

## 🔗 Integrations & Automations
- **PayPal**: Dynamic donation system via `PAYPAL_EMAIL` constant.
- **Supabase**: Tables: `profiles`, `lessons`, `lesson_progress`, `quiz_results`, `bug_reports`.
- **N8N**: (Ready for integration) Goal: Auto-emails and admin alerts for failed attempts.

### ✅ Resend (Email)
- Purpose: Transactional emails for Linguaenlinea
- Website: https://resend.com
- Free plan: 3,000 emails/month
- Use cases:
  * Welcome email after onboarding completion
  * Teacher notifications when student finishes a lesson
  * PayPal donation confirmation
  * Community newsletter
  * N8N triggered notifications
- Integration: npm install resend (works natively with Next.js)
- Phase: Integrate during /contact page development

### 🔄 Pending - evaluate later:
- SendGrid (Twilio): https://www.twilio.com/en-us/sendgrid
  * Too complex for current phase. Revisit if email volume grows beyond 3000/month.
- SerpApi: https://serpapi.com
  * Google Search API. Useful for future in-platform Spanish content search feature.
  * Free plan: 100 searches/month

- **RULE**: Antigravity MUST update this section immediately when a NEW integration is added.

### Landing Page Hero
- **Component**: Animated Shader Background (AnoAI)
  - **Source**: [21st.dev](https://21st.dev/community/components/minhxthanh/animated-shader-background)
  - **Status**: ✅ Integrated in hero section
  - **Location**: `frontend/src/components/ui/animated-shader-background.tsx`
  - **Notes**: Three.js WebGL shader with aurora effect. Use `relative z-10` on content wrapper.
  - **Dependency**: `npm install three @types/three`

### Testimonials
- **Component**: TypewriterTestimonial (custom adapted from 21st.dev)
  - **Status**: ✅ Integrated in landing page
  - **Location**: `frontend/src/components/ui/typewriter-testimonial.tsx`
  - **Notes**: Hover to reveal typewriter effect. Uses avatars (initials) as placeholder — replace with real photos when available. Real photos path: `/public/images/testimonials/`

### Interactive 3D Robot (Spline)
- **Component**: SplineScene
  - **Source**: `https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode`
  - **Status**: ✅ Integrated in "Het beste van twee werelden" section
  - **Location**: `frontend/src/components/ui/splite.tsx`
  - **Notes**: Robot follows cursor on desktop. Hidden on mobile to avoid WebGL performance issues. Linguaenlinea badge overlaid via CSS. To add logo TO the robot model: edit in spline.design directly.
  - **Dependency**: `npm install @splinetool/react-spline @splinetool/runtime`

### Audio Wave Player (custom)
- **Component**: AudioWavePlayer
  - **Status**: ✅ Integrated in "Het beste van twee werelden" section
  - **Location**: `frontend/src/components/ui/audio-wave-player.tsx`
  - **Notes**: Animated equalizer bars with play/pause. Uses real Cuban audio from `/public/audio/`. Bars animate coral-to-gold gradient when playing. No external dependencies needed (framer-motion already installed).

### Contact, Privacy & FAQ pages
- **Background**: Dark card style `bg-white/5 border border-white/10`.
- **Note**: Clean dark works better for legal/form/FAQ pages than animated shaders.

## 🚢 Deploy Checklist
- **Vercel**: Link repository, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Verification**: Run `npm run build` locally to catch TS/Lint errors.
- **Domain Verification**:
  - Domain: `linguaenlinea.eu` registered at Strato.nl
  - Connect domain to Vercel (add DNS records in Strato.nl)
  - Verify domain in Resend dashboard
  - Add subdomain: `contact.linguaenlinea.eu` for email sending
  - Configure DKIM/SPF/DMARC records in Strato.nl DNS
  - Wait up to 72 hours for propagation
  - Test with `dns.email` tool

## ⚠️ Before Go-Live: Switch from Google Sites to Vercel

When we are ready to deploy `linguaenlinea.eu` to Vercel, do the following in Strato.nl DNS:

1. **DELETE** these Google Sites records:
   - CNAME: `www` → `ghs.googlehosted.com`
   - TXT: `google-site-verification=D8ZbSXtwyOAbuwC445SKl_X-hPN7hyKfAOo0oB-UdBo`
   - TXT: `google-site-verification=PfXVnTJxPQ2PNzpnMR1AK0t7C-ArucGlzEH0d6MTBYg`

2. **ADD** Vercel records (Vercel will show these during deploy):
   - A-record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`

3. **Keep** these Resend records (do **NOT** delete):
   - TXT: `resend._domainkey` → DKIM value
   - TXT: `send` → `v=spf1 include:amazonses.com ~all`
   - TXT: `_dmarc` → `v=DMARC1; p=none;`

4. Wait 24-48 hours for DNS propagation
5. Verify domain in Vercel dashboard

## 📚 Lessons Learned
- **Case Sensitivity**: macOS is case-insensitive, Vercel (Linux) is NOT. Always use `images/` (lowercase).
- **Audio Processing**: Convert `.wma` to `.mp3` early to avoid browser playback failures.
- **Component isolation**: Always isolate Particle Engines to prevent layout shifts.
- **Back Button Logic**: Use `router.push('/')` instead of `router.back()` to ensure users return to the home page, avoiding confusing loops if they navigated directly to a subpage.
- **Polish Sequence**: Always complete and polish the landing page BEFORE deploying.
