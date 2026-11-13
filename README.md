# Pranav Bhandare - Neo-Brutalist Portfolio Website

A portfolio website crafted for **Pranav Bhandare** (Video Editor & Visual Creative), reverse-engineered directly from the reference website [pmanifestoo.vercel.app](https://pmanifestoo.vercel.app/) using the **REA (Reverse Engineer Anything)** methodology.

---

## 🎨 Design System & Aesthetics
- **Style**: Neo-Brutalist / Pop Art / Comic Manifesto
- **Colors**:
  - Paper Backdrop: `#e6e6e6`
  - Electric Purple (Hero & Experience): `#b200ff`
  - Hot Pink (Tech Stack): `#f5009b`
  - Acid Yellow (CTAs & Badges): `#fbea04`
  - Stamp Red (Logo & Accents): `#ff0808`
  - Forest Green (Creative Lab): `#3c584c`
  - Mint & Lime (Tags & Accents): `#afe4bb` & `#63c636`
- **Typography**:
  - Display: `Anton`, Impact, Arial Narrow (Upper-case, condensed, heavy tracking)
  - Body: `General Sans`, Inter
  - Monospace: `JetBrains Mono`
- **Brutalist Elements**:
  - Hard shadows (`hs`: `6px 6px 0 #000`, `hs-sm`: `3px 3px 0 #000`, `hs-lg`: `10px 10px 0 #000`)
  - Tactile 3D press buttons (`.sticker-btn`)
  - Dashed grid borders (`.grid-frame`)
  - Infinite auto-scrolling marquee ribbons (`.marquee`)
  - Floating idle tilt badges (`.idle-bob`)

---

## 🚀 Sections Included

1. **Header & Sticky Navigation**:
   - Centered PB brutalist red stamp
   - Text flip hover animations for desktop navigation (`Work`, `Stack`, `Experience`, `About`, `Contact`)
   - Neo-brutalist mobile drawer with quick badge indicators
2. **Hero Section (`#hero`)**:
   - Giant `-skew-x-[8deg]` display wordmark: **PRANAV.** with multi-layered 3D shadow
   - Animated floating sticker badges (`🎬 SHOWREEL 2026`, `⚡ DAVINCI & PREMIERE`, `🔥 2 AGENCY ROLES`, `🎨 MOTION & 2D ANIM`)
   - Role badge: **VIDEO EDITOR & VISUAL CREATIVE**
   - 1-click CTA sticker buttons linking to projects, showreel, and contact
3. **Tech Stack & Competencies (`#stack`)**:
   - Infinite two-way marquee ribbons showcasing Adobe Creative Suite (Premiere Pro, After Effects, Photoshop, Illustrator, InDesign) and DaVinci Resolve
   - 4 Brutalist competency cards: Video & Post-Production, Motion & Animation, Design & Layout, Print & Editorial
4. **Selected Works & Portfolio (`#work`)**:
   - Numbered project showcase cards with role, year, custom color-coded borders, and tags:
     - `01`: Showreel 2026 (Continuous Cut)
     - `02`: Webasha Creative Campaigns
     - `03`: Ample Technologies Digital Series
     - `04`: CineAura Studios Motion Package
     - `05`: Digital Illustration & Vector Art Collection
     - `06`: Poster & Print Layout Design
   - Interactive modal "Quick View" preview dialogs for each project
   - Verified Canva portfolio CTA banner
5. **Creative Lab / Playground (`#playground`)**:
   - "Pixels at Play: explorations, experiments, and escapades"
   - Clickable interactive experiment cards with "TAP ON ME!" lightbox dialogs
6. **Professional Experience & Education (`#experience`)**:
   - Agency experience: **Webasha Technologies** (Graphic Designer / Video Editor) & **Ample Technologies** (Graphic Designer / Video Editor)
   - Academic education: **Srajan College of Design** (B.Sc. in Media Graphics and Animation, 75%) & **Nowrosjee Wadia College** (HSC, 64%)
   - Working style manifesto card
7. **About Me (`#about`)**:
   - Detailed bio highlighting agency-side post-production, animation theory, and graphic design fundamentals
   - Deliverables checklist
   - Neo-brutalist portrait card with badges and quick links
8. **Contact & Manifesto Footer (`#contact`)**:
   - "LET'S MEET!" neo-brutalist contact card
   - Instant 1-click copyable email (`beyondgreatest33@gmail.com`) with feedback toast
   - Direct phone call link (`+91 8766569752`)
   - Social links and Canva portfolio redirect
   - Back to top button

---

## 🛠️ How to Run Locally

```bash
# 1. Navigate to the project directory
cd C:\Users\tejas\.gemini\antigravity\scratch\pranav-portfolio

# 2. Start the local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 🌐 Deploy to Vercel

```bash
npx vercel
```
