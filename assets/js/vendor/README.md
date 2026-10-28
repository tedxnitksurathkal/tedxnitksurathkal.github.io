# Self-hosted motion libraries

These browser distributions are pinned and copied from the official npm packages. They do not require npm installation to preview or deploy this static site.

| Library | Version | Source / license |
| --- | --- | --- |
| GSAP + ScrollTrigger | 3.15.0 | https://www.npmjs.com/package/gsap/v/3.15.0 — https://gsap.com/standard-license/; original copyright/license headers retained |
| Lenis | 1.3.27 | https://www.npmjs.com/package/lenis/v/1.3.27 — MIT; see `lenis-LICENSE.txt` |

The files are served locally, without a runtime CDN dependency. `signal-motion.js` checks availability and leaves content and native scrolling usable if a library fails to load. Update deliberately and repeat the interaction, responsive and reduced-motion checks after an upgrade.
