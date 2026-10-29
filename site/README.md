# The Quiet Signal — editing and running the site

The website remains plain HTML, CSS and JavaScript, served directly by GitHub Pages. A small dependency-free Node script renders shared navigation, footer and page templates into the existing root HTML files. Generated HTML is committed so hosting does not need Node or a build service.

## Run locally

Requires Node.js 18 or newer. No package installation is needed for these commands.

```sh
npm run build
npm run check
npm run dev
```

Open `http://127.0.0.1:3000`. The preview server supports both `/about` and `/about.html`, like the existing site. Stop it with Ctrl+C. Set `PORT` if 3000 is occupied.

`npm test` runs the same checks as `npm run check`. There is no framework bundle or `dist` directory. The existing Gulp packages and lockfile are retained for historical code; `npm install` is optional and is **not** needed for this site workflow. The old Gulp pipeline is not used by the redesigned pages.

## Content and source files

| File | Purpose |
| --- | --- |
| `site/content.json` | Theme, description, event status, contact details, FAQ, new speakers and past partners |
| `site/build.mjs` | Shared page templates and static HTML generation |
| `site/archive-content.html` | Preserved historical edition content and deep links |
| `site/talks.json` | All 85 talks, grouped by original edition IDs |
| `assets/css/quiet-signal.css` | Design tokens, layouts, responsiveness and reduced motion |
| `assets/js/quiet-signal.js` | Menu, speaker dialogs, archive player/filter and registration |
| `assets/css/signal-motion.css` | Compact header, phone menu, signal tuner and motion presentation |
| `assets/css/finishing.css` | Final compact spacing, phone/tablet speaker rail and game teaser |
| `assets/js/signal-motion.js` | GSAP transitions, Lenis scrolling, particles, tuning and motion preferences |
| `assets/js/vendor/` | Pinned, self-hosted GSAP/ScrollTrigger and Lenis distributions and license information |
| `assets/js/team-list.js` | Existing team data, consumed at build time |
| `assets/js/past-editions.js` | Existing historical speaker data, consumed at build time |
| `site/serve.mjs` | Local static server |
| `site/check.mjs` | Static integrity and content regression checks |

Edit these sources, then run `npm run build`. Direct changes to the generated root pages are overwritten by the next build. The generated pages are `index`, `about`, `speakers`, `event`, `venue`, `registration`, `team`, `partners`, `contact`, `salon`, `past-editions`, `talk-archives` and `404`, all with `.html` extensions.

The archived theme/game pages remain on their original routes. `theme.html` is still the original theme game; the new theme is at `/about.html#theme`. The homepage preserves `#theme`, `#speakers`, `#subscribe` and `#faq` anchors.

## Confirm the next edition

The design kit has no confirmed date, room, lineup, ticket pricing or agenda for The Noise Paradox. Previous edition details are labelled as historical. To announce the next edition:

1. Update `event.dateLabel`, `event.location`, `event.address` and `event.venueLabel` in `content.json`.
2. Add confirmed `event.schedule` entries with `time` and `title` strings. An empty array shows a coming-soon message.
3. Add confirmed speakers to `speakers`. Each object takes `name`, `title`, `image` (repo-relative path), `description` (plain text), and optional `id` and `url` (a real profile/talk destination). With an empty array, the site explicitly says the lineup is unannounced and features historical speakers.
4. Confirm team roles and contact details against the existing roster before launch. Historical sponsors are presented as previous-edition partners.
5. Review the theme copy, image rights and brand presentation with the organizers.

## Registration

`registration.open` defaults to `false`. The original Vercel endpoint is preserved, but the new edition does not collect details until it is intentionally enabled.

The same registration form appears on the homepage and `/registration.html`. It remains visible while registration is closed, with conditional fields available for preview and a disabled submit button. The JavaScript submit handler independently blocks requests while `data-open` is false. Selecting NITK reveals institutional email and roll number; selecting another institution reveals college, email and phone. Without JavaScript, the form is hidden and a contact fallback is shown.

Before setting `registration.open` to `true`, confirm the endpoint is accepting the intended edition, replace `registration.message` with approved registration copy, and update the relevant FAQ answers for eligibility and admission. Do not announce prices or availability until confirmed. Run `npm run build` after the update.

The request remains a JSON POST with `name`, `reason`, `college`, `email`, `rollNumber` and `phoneNumber`. NITK attendees use an `@nitk.edu.in` email and an eight-character roll number. Other attendees provide an institution, email and ten-digit phone number. The inactive fieldset is disabled so it cannot block browser validation. Success resets the form and fieldsets; errors preserve the entered details. Duplicate clicks are guarded, requests time out after 20 seconds, and no data is stored in localStorage.

Browser tests used mocked API responses. A real submission requires an organizer-approved end-to-end test before enabling registration. The backend source and its server-side validation are outside this repo.

## Assets and analytics

The compact header follows AeroNITK's scroll behaviour: the desktop navigation centers as the header shrinks from 74px to 56px. Phones retain the logo in a 60px header and use a full-height menu with keyboard focus containment and background content made inert. The full menu applies through 1100px to prevent crowded tablet navigation. Homepage speaker cards use a native swipeable rail through 900px; the dedicated speaker page retains its grid.

GSAP/ScrollTrigger animate entry, waveforms, the hero and the editorial ribbon. Lenis smooths desktop wheel scrolling; phones keep native touch scrolling. A persistent motion control and the system reduced-motion preference disable decorative animation and smoothing. Particles stop when the hero is off-screen or the tab is hidden. The signal tuner remains usable by touch, mouse and keyboard when motion is disabled. No audio is played.

The runtime libraries are pinned under `assets/js/vendor`; the build and preview still require no package installation. Read that directory's README for versions and licenses.

The four theme cards become a sticky scroll story on wide, sufficiently tall screens with a fine pointer. Its SVG illustration is generated in `stageJourney()` and driven by the scoped timeline in `signal-motion.js`. Phones, short landscape screens, data-saving/two-core devices and reduced-motion mode retain the compact theme grid. This update changes presentation only; `site/content.json` remains the source of event data. The audit includes the local scroll timing sample and its limitations.

`voiceField()` adds the decorative word cloud and red signal thread. `editionRail()` builds the homepage timeline from the existing talk groups and edition names. The timeline scrolls natively and supports keyboard focus; its years are links to the existing archives. Card highlights and the decorative badge's decoding effect live in `signal-motion.js` and follow the same motion preference.

See `ASSETS.md` for artwork and font sources. Existing official branding, team, speaker and sponsor assets are reused. The new hero is decorative concept artwork; it does not depict NITK or the event venue.

The existing analytics identifier (`UA-110715968-3`) is preserved. It is an older Universal Analytics configuration; organizers should supply the intended current analytics configuration. Tracking delivery was not verified. YouTube embeds load after a visitor chooses a talk; direct YouTube links remain available.

Build, check and commit the generated root HTML alongside source changes when using the existing GitHub Pages publishing process. No deployment or Git push is performed by these commands.

## Future game

The homepage has two game invitations: “Find the hidden signal” in the hero and “Reveal the signal” beneath the tuner. Both open the same accessible coming-soon dialog. The game is not implemented yet. Escape, the close button and “Keep exploring” return focus to the original invitation. Without JavaScript, visitors see a coming-soon message and an Instagram updates link.

When the game is ready, add a top-level `game` object to `site/content.json`, for example `"game": { "url": "/new-game.html" }`, using the real game route. Run `npm run build` and `npm test`. Both invitations then become “Play the game” links and the coming-soon dialog is omitted. Existing legacy games retain their original routes.

## Shorter homepage

The attention-experiment tuner, its ?Less noise. More meaning.? ribbon, and the Experience/journey block are omitted from the homepage. Experience remains at `/event.html` through the main menu. Their source helpers remain available for future reuse; they are not rendered on the homepage.
