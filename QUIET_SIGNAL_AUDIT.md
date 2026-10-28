# Quiet Signal implementation audit

Completed: 18 October 2026. Scope: the main TEDxNITKSurathkal site and its archive presentation. Local implementation; not deployed.

## Delivered

Homepage TEDx introduction: restored the original “What is TEDx?” copy and existing wireframe-hands image directly before the shoreline/community section. Includes the original official TEDx-program link, compact responsive layout, lazy image loading and the site's existing reveal/reduced-motion behavior.

Registration UI follow-up: replaced the announcement-only panel with a responsive event registration form on both the homepage and registration page. Preserved the existing API fields and validation. NITK and other-institution details switch without submitting; inactive fields stay disabled. Registration remains closed in content settings, with a disabled button and a separate JavaScript request guard. Browser checks covered both branches, five widths, automated accessibility, closed-mode request prevention and mocked live-mode success/error handling. No real registration was submitted.

Homepage shortening follow-up: removed the attention-experiment tuner, its “Less noise. More meaning.” ribbon, and the Experience/journey block from the homepage. The full Experience page remains accessible through the navigation. The game teaser and other homepage sections remain. Original source preservation in `legacy-original/` is unchanged.

- Thirteen static pages with shared navigation/footer, cinematic homepage, four-stage theme story, historical speaker profiles, experience journey, community, partners, team, contact, Salon, registration/FAQ and archives.
- Responsive original artwork, local fonts, semantic HTML, visible keyboard focus, native dialogs/FAQ, reduced-motion support and a mobile menu.
- Preserved 84 talks, historical edition anchors, game/theme routes, the existing registration API payload and analytics identifier.
- Centralized new-edition content and a dependency-free build/preview/check workflow. The motion update adds self-hosted GSAP/ScrollTrigger and Lenis browser libraries; no framework or package installation is needed.

## Header and motion update

- Inspected the live AeroNITK navigation implementation at https://aeronitk.in. Adapted its centered, compact scrolled state and full-height phone menu to TEDx branding.
- Header: 74px desktop, 60px phone, 56px scrolled; keyboard-accessible mobile menu, focus containment, background inert state, and reading progress.
- Added GSAP entry/parallax/waveform/ribbon transitions, a lightweight hero particle field, atmospheric backgrounds and an interactive signal tuner. Speaker cards use a full-width layout on small phones.
- Added smooth desktop wheel/anchor scrolling, native phone scrolling, a persistent motion toggle and live system reduced-motion handling. Particles pause off-screen and in hidden tabs.
- Rechecked all 13 pages at seven widths: no JavaScript errors, overflow or automated WCAG A/AA violations. Additional homepage checks passed at 13 widths from 320px to 1920px.
- Open-menu accessibility, focus wrap, background inert state, landscape menu access, persistent motion preference, tuner arrow/Home/End keys, reduced-motion changes and the original 13 interaction checks passed. Real mobile devices and assistive-technology testing remain outside this browser-based audit.
- Smooth anchors preserve URL/focus and clear the compact header. Archive filtering works with smoothing enabled. Blocking the animation libraries leaves page content and the signal tuner functional.

## Verification

### Final compact and game teaser pass

- Tightened hero sizing, section spacing, scroll-story chapters, artwork and footer. Measured homepage height fell from 12,019 to 10,439px at 1440px wide (13%), 11,282 to 10,059px at 768px (11%), and 11,616 to 10,159px at 390px (13%), with motion enabled in the same browser.
- Combined the existing reference-inspired word cloud, red signal thread, archive rail and scroll story with a more compact presentation. Tablet navigation now uses the full menu through 1100px; homepage speaker cards form a native swipeable rail through 900px.
- Added a radar-style game teaser and hero invitation. Both open an explicitly labelled coming-soon panel; no new game is claimed to be playable. A single optional `game.url` content setting enables the eventual destination after a rebuild.
- Fixed dialog focus restoration when multiple buttons open the same panel, and an archive-player scroll handler that referenced a missing reduced-motion variable. Archive playback scrolling also respects the visitor's motion toggle.
- Repeated all 13 page checks at seven widths and all 13 existing interaction checks: no page errors, horizontal overflow or automated accessibility violations. The final homepage passed 14 viewport checks from 320 to 1920px, tablet menu/desktop resize cleanup, touch-tablet interactions, keyboard speaker-rail access and game dialog focus/close checks. The open game dialog passed automated accessibility checks. Reduced-motion mode removes the scroll triggers.
- Reviewed desktop/phone hero, tablet menu and phone game screenshots. Browser emulation does not replace testing on physical devices. Event data, the 84 talks and registration settings remain unchanged.

### Additional reference details

- Added a decorative crowd of word bubbles that drifts apart around a red Quiet Signal badge, with a descending signal thread. The scene uses 12 text elements on desktop and six on small phones, without a continuous idle loop or animated blur.
- Added a short text-decoding flourish to the decorative badge. It restores the original label on completion, scrolling, motion pause or background-tab changes, and is excluded from screen-reader content.
- Added local pointer-following highlights to the signal console, registration panel and partner panels. Position changes are batched into one animation frame; touch, reduced-motion and low-power modes skip the tracking effect.
- Added a native horizontally scrollable, keyboard-accessible timeline linking to nine existing talk archive years. Labels come from the existing archive data; no event details or registration settings changed.
- Repeated all 13 page accessibility/responsive/browser checks and the 13 original interaction checks successfully. Additional checks passed for badge text restoration, highlight positioning/pause, keyboard timeline navigation, valid archive destinations and ten viewport widths from 320px to 1920px. Visually reviewed desktop and phone screenshots.

### Scroll storytelling refinement

- Adapted the noise-to-signal scroll concept from the user-provided https://tedxnitk.vercel.app/ reference, using original SVG artwork within the existing Quiet Signal design. Existing event content, people, dates and registration state were not changed in this refinement.
- Added a desktop sticky four-chapter visual: scattered threads resolve into a waveform as the existing Distraction, Overload, Reflection and Clarity cards pass. Added layered hero departure, staggered reveals, word-by-word manifesto illumination, speaker portrait parallax, journey emphasis and a closing title transition.
- The story uses native CSS sticky positioning with no scroll locking or artificial pin spacers. Phones, short landscape screens and devices reporting data saving or two or fewer logical processors use the simpler layout. Pausing motion removes the scroll triggers and restores the compact static layout.
- Optimized progress calculations using cached document height and ResizeObserver. Particles share the GSAP ticker, pause off-screen/in hidden tabs, and remain static in low-power mode. No additional library, video, WebGL scene or network dependency was added.
- Repeated the 13-page browser/accessibility audit and original 13 interaction checks successfully. The motion-enabled homepage passed overflow checks at ten widths from 320 to 1920px; chapter progression, pause cleanup, landscape fallback, live reduced-motion changes and simulated low-power mode passed.
- Local Chromium headless sample: a four-second scripted scroll sweep through the story recorded 576 animation-frame intervals, a 6.9ms median interval, a 7.1ms 95th-percentile interval and no tasks over 50ms. This is a development-machine timing sample, not a guarantee for all devices or a field Core Web Vitals measurement.

| Check | Result |
| --- | --- |
| `npm run build` | 13 static pages generated successfully |
| `npm run check` / `npm test` | Local resources, file-name case, internal anchors, unique IDs, one h1/main landmark per page, image alt attributes and all 84 talks verified |
| Chromium responsive checks | 13 pages × 7 widths: 375, 390, 430, 768, 1024, 1440 and 1920px; no horizontal overflow |
| Browser JavaScript | No page errors on the 13 redesigned routes |
| axe WCAG 2 A/AA + 2.1 AA | No automated violations in the checked page states; reduced motion enabled to avoid sampling reveal transitions |
| Interaction checks | Mobile menu/Escape/focus, navigation, speaker dialog open/close/focus, keyboard FAQ, archive filtering/deep links/player selection passed |
| Registration, mocked API | Both attendee branches, email/phone validation, roll-number normalization, field reset, API failure, network failure and invalid-response handling passed |
| Progressive enhancement | Main content/mobile navigation/FAQ usable with JavaScript disabled; reduced motion disables reveal effects and smooth scrolling |
| Visual review | Desktop and mobile screenshots reviewed against the six reference compositions |

Browser QA used Playwright and axe installed outside the repository as temporary development tools. No real registration was submitted. Automated accessibility checks supplement, rather than replace, manual assistive-technology review. YouTube’s third-party player internals are outside the site’s control; the player loads only when selected.

## Fixed during implementation

- Removed stale homepage handlers that referenced missing elements and obsolete Mailchimp markup.
- Corrected case-sensitive archive image paths and removed an empty image source.
- Fixed archived mobile column overflow and retained working historical anchors.
- Improved small red text and button contrast while preserving the official logo asset.
- Prevented inactive registration fields from interfering with validation; added recoverable errors and submission guards.
- Replaced misleading current-event dates and example tickets with explicit unannounced states.

## Remaining launch inputs

1. Confirm the next event’s date, venue, lineup, programme, registration eligibility and any pricing in `site/content.json`.
2. Verify the external registration backend is serving the intended edition, perform an organizer-approved real submission, then enable `registration.open` and update the registration message/FAQ.
3. Confirm current team roles, contact details, partner status and rights for the existing photographs/fonts. New artwork is metaphorical, not a real campus image.
4. Supply the intended analytics configuration; the existing older UA identifier is retained and tracking delivery is unverified.

The older standalone games, their separate Express/MongoDB backend and experimental microsites remain available at their original paths. They were not rebuilt or comprehensively audited; pre-existing issues within those legacy experiences may remain.

See `site/README.md` for exact commands, file ownership and the content update workflow, and `site/ASSETS.md` for asset provenance.
