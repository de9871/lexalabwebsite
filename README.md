# Lexa Lab Website Prototype

A static HTML/CSS prototype for the **Lexa Lab** (Language, Literacy & Executive Function in Autism) at Georgia State University. This serves as a polished web shell and Squarespace design reference — not a production-deployed site.

---

## Project Structure

```
lexa_lab_website/
├── index.html          — Home page (lab wordmark + latest-news block)
├── about.html          — About the Lab
├── team.html           — Meet the Team (PI, Grad/Undergrad RAs, Alumni, Tech Support)
├── research.html       — Current Research (Project READ + research interests)
├── past-research.html  — Past Research (content pending PI document)
├── publications.html   — Publications & Presentations
├── news.html           — News (5 dated items, newest first)
├── contact.html        — Contact / Participant Registry form
├── assets/
│   ├── css/
│   │   └── styles.css  — All shared styles (design tokens, layout, components)
│   ├── js/
│   │   └── nav.js      — Mobile menu toggle, scroll shadow, active link state
│   └── images/
│       └── lexa-lab-logo.png — Lab logo (replace with final file if updated)
└── README.md           — This file
```

---

## How to Open Locally

Open any page directly in a browser:

```
cd lexa_lab_website
open index.html
```

Or run a local server if you need relative paths to resolve correctly:

```
python3 -m http.server 8000
```

Then visit: `http://localhost:8000`

---

## Editing Guide

| What to update | Where to find it |
|---|---|
| Lab name | `<title>` tags, nav logo, and footer — all 6 HTML files |
| Subtitle | `.nav-logo-sub` span in each file's `<header>` |
| Header navigation | `<nav aria-label="Main navigation">` and `<nav id="mobile-menu">` in each file |
| Hero copy | `<section class="hero">` in `index.html` |
| Photo placeholders | All `<div class="img-placeholder">` elements — see Photo Replacement Guide below |
| Team member names | `team.html` — replace role headings, `.ph-note` spans, and bio text in each `.team-card` |
| Team bios | `team.html` — `<p class="body-md">` inside each `.team-card` |
| Research area details | `research.html` — each `<section>` labeled "Research Area 01–06" |
| Contact email | `contact.html` info card + all 6 footer blocks — replace `lexalab@gsu.edu` |
| Contact form | `contact.html` — `<form class="form-stack">` |
| Footer | `<footer class="site-footer">` in each HTML file |
| Logo | `assets/images/lexa-lab-logo.png` — replace file and keep the same filename, or update all `src` references |

---

## Photo Replacement Guide

Each photo slot is a `<div class="img-placeholder">` with an `aria-label` describing the ideal shot. The `<!-- SWAP with: ... -->` comment on each placeholder gives a specific photography brief.

**Recommended photo types:**
- Research session photo (researcher + child, calm lab setting, warm natural light)
- Family participation photo (warm, candid, diverse family)
- Campus / lab photo (GSU building or lab interior, clean and welcoming)
- Team headshots (individual, professional, warm — used in circular crop)

**When replacing a placeholder:**
1. Add a real `<img>` tag with a descriptive `alt` attribute inside the container `<div>`
2. Remove the `img-placeholder`, `ph-labeled`, and `placeholder-inner` elements
3. Keep the `border-radius`, `min-height`, and `aspect-ratio` styles from the old `<div>` on the new `<img>` or its wrapper
4. Use compressed, web-friendly file sizes (JPEG at 80–85% quality, or WebP)

---

## Team Content Guide

Team cards in `team.html` (and the preview grid in `index.html`) use role titles as temporary headings and `<p class="ph-note">` tags as content reminders. Replace with confirmed content from the PI:

- `<h3>` or `<h4>` — replace role placeholder (e.g., "Principal Investigator") with the person's actual name
- `.team-card-role` span — update department or research area as needed
- `<p class="body-md">` — replace generic bio text with the real bio
- `<p class="ph-note">Name and bio to be added.</p>` — delete this line once real content is in place
- Circular `<div class="img-placeholder">` headshot — replace with a real `<img>` headshot

---

## Contact Form

The form in `contact.html` is a static HTML form. It does not submit anywhere yet. It must be connected to a real handler before the site goes live.

**Options for the final form handler:**
- **Squarespace Form Block** — recommended if rebuilding in Squarespace; replaces the entire `<form>` element
- **Formspree** — free tier available; add `action="https://formspree.io/f/YOUR_ID"` to the `<form>` tag
- **Google Forms** — embed or redirect; simplest fallback
- **University-approved workflow** — check with GSU IT for any required form or survey system

> **TODO: Connect the contact / participant registry form before launch.**

---

## Pages

| Page | File | Status |
|---|---|---|
| Home | `index.html` | Built — placeholder photos and team names |
| About the Lab | `about.html` | Built — placeholder photos |
| Meet the Team | `team.html` | Built — placeholder names, bios, and headshots |
| Research Projects | `research.html` | Built — research area text complete; project details pending |
| Publications | `publications.html` | Built — entries pending |
| Contact / Registry | `contact.html` | Built — form not yet connected |

---

## Design Notes

- **Colors:** GSU Deep Navy (`#002855`) and GSU Blue (`#0039A6`) as primaries; white and cool gray (`#F4F7FA`) as backgrounds. All defined as CSS custom properties in `:root`.
- **Typography:** IBM Plex Serif (headings) + IBM Plex Sans (body) — an academic, editorial pair loaded from Google Fonts.
- **Tone:** Credible and warm; accessible to families and community participants, not just academic readers.
- **Avoid:** Puzzle pieces, rainbow clichés, cartoon illustrations, generic SaaS stock photography, or overly clinical imagery.
- **CSS architecture:** All styles live in `assets/css/styles.css` as CSS custom properties (design tokens). No Tailwind, no preprocessor, no build step required.
- **Squarespace mapping:** Every major section includes a `SQUARESPACE:` comment in the HTML noting which Squarespace block type to use.

---

## Accessibility Notes

- Text contrast is set to WCAG AA or better throughout.
- All final images must include descriptive `alt` text (the placeholder `aria-label` on each `div` describes the intended photo).
- Headings follow document order (h1 → h2 → h3) on every page.
- Form labels are visible and associated with inputs via `for`/`id`.
- A skip navigation link (`<a class="skip-link">`) is present on every page.
- Do not add autoplay video or flashing/animated content.

---

## Squarespace Rebuild Notes

This prototype is the design and content reference for a future Squarespace build. CSS custom properties in `:root` correspond to Squarespace Site Styles entries. Each HTML section has a `SQUARESPACE:` comment indicating the block type to use.

| Section | Squarespace Block |
|---|---|
| Header / navigation | Header block → Fixed → White background |
| Hero section | Banner block — 2-column layout |
| Mission / intro text | Text block — centered, large quote style |
| Image + text section | Image + Text block — 2 columns |
| Research / team card grid | Summary block — 3 or 4 columns |
| Team directory | Team Member blocks |
| Contact / registry form | Form block |
| Footer | Footer block — 3-column layout |

---

## Known Remaining Tasks

Assets still needed for the 6.3 edits (placeholders are in place):
- [ ] Dr. Yanru Chen headshot → Team page PI card
- [ ] Project READ recruitment flyer → `research.html` Area 01 + News (6/1) + Home latest-news block
- [ ] MoLA presentation photo → News (3/13)
- [ ] Real names/bios for Grad Research Assistants, Undergrad RAs, and Lab Alumni
- [ ] Verify the Project READ screener URL (`https://forms.cloud.microsoft/r/W8QFnat8qS`) is current
- [ ] Confirm the standardized lab email `asdlab@gsu.edu` is correct site-wide
- [ ] Populate `past-research.html` from the PI's separate Past Research document

General / pre-launch:
- [ ] Add final lab photography (replace all `img-placeholder` divs)
- [ ] Confirm department affiliation for GSU listing
- [ ] Confirm campus building and suite details
- [ ] Add real publication and presentation entries to `publications.html`
- [ ] Connect the contact / participant registry form before launch
- [ ] Add a Google Maps embed to `contact.html` (replace `.map-placeholder`)
- [ ] Verify GSU brand compliance before publishing
- [ ] Add favicon to all pages
- [ ] QA mobile layout on real devices
- [ ] Final accessibility check (WCAG AA), incl. Research dropdown keyboard/touch behavior
