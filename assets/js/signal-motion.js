/* All motion enhances readable, static HTML. Native touch scrolling stays intact. */
(() => {
  "use strict";
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".reading-progress span");
  const toggle = document.querySelector(".motion-toggle");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = matchMedia("(min-width: 901px) and (pointer: fine)");
  const tallScreen = matchMedia("(min-height: 600px)");
  const lowPower =
    Boolean(navigator.connection?.saveData) ||
    (navigator.hardwareConcurrency || 4) <= 2;
  let paused = false;
  try {
    paused = localStorage.getItem("quiet-signal-motion") === "paused";
  } catch {}
  let lenis,
    animationContext,
    revealObserver,
    particleFrame = 0,
    resizeFrame = 0;
  let heroVisible = true;
  const enabled = () => !paused && !reduced.matches;
  const cinematic = () => desktop.matches && tallScreen.matches && !lowPower;

  // Scroll progress updates once per frame, including with native/mobile scrolling.
  let scrollFrame = 0;
  let scrollDistance = Math.max(1, root.scrollHeight - innerHeight);
  function updateScroll() {
    scrollFrame = 0;
    // Hysteresis prevents the compact header's height change toggling at its boundary.
    if (scrollY > 80) header?.classList.add("is-scrolled");
    else if (scrollY < 16) header?.classList.remove("is-scrolled");
    if (progress)
      progress.style.transform = `scaleX(${Math.min(1, scrollY / scrollDistance)})`;
  }
  addEventListener(
    "scroll",
    () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
    },
    { passive: true },
  );
  function measureScroll() {
    scrollDistance = Math.max(1, root.scrollHeight - innerHeight);
    updateScroll();
  }
  addEventListener("resize", measureScroll, { passive: true });
  if ("ResizeObserver" in window)
    new ResizeObserver(measureScroll).observe(document.body);
  updateScroll();

  function syncOverlay() {
    if (!lenis) return;
    if (
      document.body.classList.contains("menu-open") ||
      document.querySelector("dialog[open]")
    )
      lenis.stop();
    else lenis.start();
  }
  document.addEventListener("overlaychange", syncOverlay);
  function tick(time) {
    lenis?.raf(time * 1000);
  }
  function setupScroll() {
    window.gsap?.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
    window.__lenis = null;
    if (
      enabled() &&
      desktop.matches &&
      !lowPower &&
      window.Lenis &&
      window.gsap
    ) {
      lenis = new window.Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        anchors: false,
        prevent: (node) =>
          Boolean(
            node.closest(
              "dialog, .site-nav, textarea, select, [data-lenis-prevent]",
            ),
          ),
      });
      lenis.on("scroll", () => window.ScrollTrigger?.update());
      window.gsap.ticker.add(tick);
      syncOverlay();
      window.__lenis = lenis;
    }
  }
  // Keep URLs, focus, keyboard activation and browser history correct for anchors.
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (
      !link ||
      !lenis ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target ||
      link.hasAttribute("download") ||
      link.hasAttribute("data-talk-filter")
    )
      return;
    const url = new URL(link.href, location.href);
    if (
      url.origin !== location.origin ||
      url.pathname !== location.pathname ||
      url.search !== location.search ||
      !url.hash
    )
      return;
    let target;
    try {
      target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    } catch {
      return;
    }
    if (!target) return;
    event.preventDefault();
    const complete = () => {
      history.pushState(null, "", url.hash);
      dispatchEvent(new HashChangeEvent("hashchange"));
      const hadTabindex = target.hasAttribute("tabindex");
      if (!hadTabindex) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (!hadTabindex)
        target.addEventListener(
          "blur",
          () => target.removeAttribute("tabindex"),
          { once: true },
        );
    };
    lenis.scrollTo(target, { offset: -80, onComplete: complete });
  });

  function setupAnimations() {
    revealObserver?.disconnect();
    animationContext?.revert();
    root.classList.remove("story-motion");
    if (!enabled() || !window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    const rich = cinematic();
    root.classList.toggle("story-motion", rich);
    animationContext = gsap.context(() => {
      if (document.querySelector(".hero")) {
        gsap.from(".hero-copy > *", {
          y: 26,
          opacity: 0,
          duration: 1.05,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });
        gsap.to(".hero-art", {
          yPercent: rich ? 14 : 4,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
        gsap.to(".hero-orbit", {
          rotation: 35,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
        if (rich) {
          gsap.to(".hero-copy", {
            yPercent: -12,
            opacity: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom 15%",
              scrub: 0.7,
            },
          });
          gsap.to(".noise-word", {
            xPercent: -5,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
            },
          });
          gsap.to(".hero-aside", {
            y: -70,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom center",
              scrub: 0.7,
            },
          });
        }
      }
      if (rich)
        document.querySelectorAll(".signal-journey").forEach((journey) => {
          const find = (selector) => journey.querySelector(selector);
          const captions = [...journey.querySelectorAll(".journey-caption")];
          gsap.set(captions, { autoAlpha: 0, y: 12 });
          gsap.set(captions[0], { autoAlpha: 1, y: 0 });
          gsap.set(find(".journey-quiet"), {
            opacity: 0,
            scaleY: 0.6,
            transformOrigin: "50% 50%",
          });
          const story = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: journey,
              start: "top 30%",
              end: "bottom 80%",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });
          story
            .to(
              find(".journey-noise"),
              { rotation: 30, scale: 0.55, opacity: 0, duration: 2.6 },
              0,
            )
            .to(
              find(".journey-orbits"),
              { rotation: 85, scale: 0.86, duration: 3 },
              0,
            )
            .to(find(".journey-core"), { scale: 2.4, duration: 1.35 }, 0)
            .to(find(".journey-core"), { scale: 0.85, duration: 1.65 }, 1.35)
            .to(
              find(".journey-glow"),
              { scale: 1.2, opacity: 0.6, duration: 3 },
              0,
            )
            .to(
              find(".journey-quiet"),
              { opacity: 1, scaleY: 1, duration: 1.3 },
              1.7,
            )
            .to(find(".journey-meter > span"), { scaleX: 1, duration: 3 }, 0);
          captions.slice(1).forEach((caption, i) => {
            const at = i + 0.65;
            story
              .to(captions[i], { autoAlpha: 0, y: -12, duration: 0.18 }, at)
              .to(caption, { autoAlpha: 1, y: 0, duration: 0.2 }, at + 0.14);
          });
        });
      document.querySelectorAll(".voice-field").forEach((field) => {
        const amount = rich ? 120 : 36;
        gsap.to(field.querySelectorAll(".voice-fragment"), {
          x: (_, el) =>
            parseFloat(getComputedStyle(el).getPropertyValue("--x")) < 50
              ? -amount
              : amount,
          y: (_, el) =>
            parseFloat(getComputedStyle(el).getPropertyValue("--y")) < 50
              ? -amount * 0.5
              : amount * 0.5,
          rotation: (i) => (i % 2 ? 5 : -5),
          opacity: 0.08,
          scale: 0.85,
          ease: "none",
          scrollTrigger: {
            trigger: field,
            start: "top 65%",
            end: "bottom 20%",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo(
          field.querySelector(".voice-beacon"),
          { scale: 0.9 },
          {
            scale: 1.12,
            ease: "none",
            scrollTrigger: {
              trigger: field,
              start: "top 85%",
              end: "bottom 25%",
              scrub: 0.7,
            },
          },
        );
        gsap.fromTo(
          field.querySelector(".voice-thread > span"),
          { y: -40, opacity: 0 },
          {
            y: 70,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: field,
              start: "top 75%",
              end: "bottom 10%",
              scrub: 0.5,
            },
          },
        );
      });
      document.querySelectorAll(".manifesto").forEach((quote) => {
        if (!rich) return;
        gsap.fromTo(
          quote.querySelectorAll(".manifesto-word, .manifesto-quote"),
          { opacity: 0.22, y: 7 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            ease: "none",
            scrollTrigger: {
              trigger: quote,
              start: "top 82%",
              end: "center 46%",
              scrub: 0.45,
            },
          },
        );
      });
      if (rich)
        document.querySelectorAll(".voices-grid").forEach((grid) => {
          grid.querySelectorAll(".voice-card > img").forEach((img, i) => {
            gsap.fromTo(
              img,
              { scale: 1.14, yPercent: i % 2 ? -3 : 3 },
              {
                scale: 1,
                yPercent: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: img.parentElement,
                  start: "top bottom",
                  end: "bottom 35%",
                  scrub: 0.8,
                },
              },
            );
          });
        });
      document.querySelectorAll(".journey").forEach((list) => {
        list.querySelectorAll("li").forEach((step) => {
          gsap.fromTo(
            step,
            { x: rich ? 28 : 0, opacity: 0.35 },
            {
              x: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: step,
                start: "top 94%",
                end: "top 72%",
                scrub: 0.4,
              },
            },
          );
        });
      });
      if (rich)
        document.querySelectorAll(".final-signal h2").forEach((title) => {
          gsap.fromTo(
            title,
            { scale: 0.9, y: 35 },
            {
              scale: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: title.parentElement,
                start: "top 90%",
                end: "center center",
                scrub: 0.8,
              },
            },
          );
        });
      document.querySelectorAll(".signal-ribbon > div").forEach((el) => {
        gsap.to(el, {
          xPercent: -16,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
      document
        .querySelectorAll(".stage-art .signal-art, .final-signal .signal-art")
        .forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0.85, opacity: 0.45 },
            {
              scaleX: 1.08,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom center",
                scrub: 1,
              },
            },
          );
        });
      if (rich)
        document.querySelectorAll(".community-photo > img").forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 1.12, yPercent: -4 },
            {
              scale: 1,
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        });
    });
    // Animate only when a block enters view; no content remains hidden off screen.
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }, i) => {
          if (!isIntersecting) return;
          revealObserver.unobserve(target);
          animationContext.add(() =>
            gsap.fromTo(
              target,
              { y: rich ? 48 : 18, opacity: 0.25 },
              {
                y: 0,
                opacity: 1,
                duration: rich ? 1 : 0.65,
                delay: Math.min(i, 3) * 0.08,
                ease: "power3.out",
                clearProps: "transform,opacity",
              },
            ),
          );
        });
      },
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(
        ".reveal, .section-heading, .lab-heading, .registration-panel, .page-intro, .edition-heading",
      )
      .forEach((el) => revealObserver.observe(el));
    window.ScrollTrigger.refresh();
  }

  // A small, bounded particle field. No work is done off-screen or in background tabs.
  const canvas = document.querySelector(".signal-particles");
  const context = canvas?.getContext("2d");
  const hero = document.querySelector(".hero");
  let width = 0,
    height = 0,
    particles = [],
    lastFrame = 0;
  function sizeParticles() {
    if (!context) return;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: innerWidth < 700 ? 22 : 48 }, (_, i) => ({
      x: (((i * 137.51) % 1000) / 1000) * width,
      y: (((i * 243.73) % 1000) / 1000) * height,
      r: i % 4 === 0 ? 1.4 : 0.7,
      speed: 0.2 + (i % 5) * 0.08,
    }));
    drawParticles(0);
  }
  function drawParticles(delta) {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    particles.forEach((p, i) => {
      p.y -= p.speed * delta;
      if (p.y < -4) p.y = height + 4;
      context.fillStyle =
        i % 4 === 0 ? "rgba(255,101,88,.7)" : "rgba(232,224,209,.5)";
      context.beginPath();
      context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      context.fill();
    });
  }
  function animateParticles(time) {
    const delta = lastFrame ? Math.min((time - lastFrame) / 16.67, 3) : 0;
    lastFrame = time;
    drawParticles(delta);
    particleFrame = requestAnimationFrame(animateParticles);
  }
  function particleTick(time, delta) {
    drawParticles(Math.min(delta / 16.67, 3));
  }
  function syncParticles() {
    cancelAnimationFrame(particleFrame);
    window.gsap?.ticker.remove(particleTick);
    lastFrame = 0;
    if (context && enabled() && !lowPower && heroVisible && !document.hidden) {
      if (window.gsap) window.gsap.ticker.add(particleTick);
      else particleFrame = requestAnimationFrame(animateParticles);
    }
  }
  if (hero && context) {
    sizeParticles();
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      syncParticles();
    }).observe(hero);
    addEventListener(
      "resize",
      () => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(sizeParticles);
      },
      { passive: true },
    );
    document.addEventListener("visibilitychange", syncParticles);
  }

  // This control responds directly to the visitor, even when decorative motion is off.
  const tuning = document.querySelector("#signal-tuning");
  function tune() {
    if (!tuning) return;
    const value = Number(tuning.value),
      noise = 1 - value / 100;
    tuning.style.setProperty("--tuning", `${value}%`);
    tuning.setAttribute("aria-valuetext", `${value} percent clarity`);
    document.querySelector("[data-signal-value]").textContent = String(
      value,
    ).padStart(2, "0");
    document.querySelector("[data-signal-state]").textContent =
      value < 30
        ? "Lost in the noise"
        : value < 70
          ? "Finding focus"
          : "A little more clarity";
    document.querySelectorAll("[data-wave]").forEach((path, row) => {
      let d = "";
      for (let x = 0; x <= 800; x += 4) {
        const envelope = Math.sin((x / 800) * Math.PI);
        const calm = Math.sin(x / 90 + row * 0.12) * 15;
        const chaos =
          (Math.sin(x / 12 + row * 0.65) * 27 +
            Math.sin(x / 31 + row) * 43 +
            Math.cos(x / 5 + row) * 8) *
          noise;
        const y = 110 + (row - 6) * (2 + noise * 7) + (calm + chaos) * envelope;
        d += `${x ? " L" : "M"}${x} ${y.toFixed(1)}`;
      }
      path.setAttribute("d", d);
    });
  }
  tuning?.addEventListener("input", tune);
  tune();

  // Local highlights use one queued frame and cached bounds, with no global cursor loop.
  let lightFrame = 0;
  const litCards = [...document.querySelectorAll(".spotlight-card")];
  litCards.forEach((card) => {
    const light = document.createElement("span");
    light.className = "card-spotlight";
    light.setAttribute("aria-hidden", "true");
    card.prepend(light);
    let bounds;
    card.addEventListener("pointerenter", () => {
      if (!enabled() || !desktop.matches || lowPower) return;
      bounds = card.getBoundingClientRect();
      card.classList.add("is-lit");
    });
    card.addEventListener(
      "pointermove",
      (event) => {
        if (!enabled() || !desktop.matches || lowPower || !bounds) return;
        if (!card.classList.contains("is-lit")) {
          bounds = card.getBoundingClientRect();
          card.classList.add("is-lit");
        }
        const x = event.clientX - bounds.left,
          y = event.clientY - bounds.top;
        cancelAnimationFrame(lightFrame);
        lightFrame = requestAnimationFrame(() => {
          light.style.setProperty("--spot-x", `${x}px`);
          light.style.setProperty("--spot-y", `${y}px`);
        });
      },
      { passive: true },
    );
    card.addEventListener("pointerleave", () => {
      bounds = null;
      card.classList.remove("is-lit");
    });
  });
  // Decorative text resolves once; screen-reader content and event copy are untouched.
  const decodeFrames = new Map();
  const decodeLabels = [...document.querySelectorAll("[data-decode]")];
  const originalLabels = new Map(
    decodeLabels.map((el) => [el, el.textContent]),
  );
  function decodeLabel(el) {
    if (!enabled() || lowPower || document.hidden) return;
    cancelAnimationFrame(decodeFrames.get(el));
    const original = originalLabels.get(el),
      start = performance.now();
    let previousStep = -1;
    function render(now) {
      const fraction = Math.min(1, (now - start) / 480),
        step = Math.floor(fraction * 16);
      if (step !== previousStep) {
        previousStep = step;
        const resolved = Math.ceil(original.length * fraction);
        el.textContent = [...original]
          .map((char, i) =>
            i < resolved || char === " " ? char : "/_+.:"[(step + i) % 5],
          )
          .join("");
      }
      if (fraction < 1) decodeFrames.set(el, requestAnimationFrame(render));
      else {
        el.textContent = original;
        decodeFrames.delete(el);
      }
    }
    decodeFrames.set(el, requestAnimationFrame(render));
  }
  const decodeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          decodeLabel(target);
          decodeObserver.unobserve(target);
        }
      });
    },
    { threshold: 1 },
  );
  decodeLabels.forEach((el) => {
    decodeObserver.observe(el);
    el.addEventListener("pointerenter", () => decodeLabel(el));
  });
  function clearDetails() {
    cancelAnimationFrame(lightFrame);
    litCards.forEach((el) => el.classList.remove("is-lit"));
    decodeFrames.forEach((frame, el) => {
      cancelAnimationFrame(frame);
      el.textContent = originalLabels.get(el);
    });
    decodeFrames.clear();
  }
  // Bounds are invalidated when scrolling moves a card under a stationary pointer.
  addEventListener("scroll", clearDetails, { passive: true });
  addEventListener("resize", clearDetails, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearDetails();
  });

  function applyPreference() {
    clearDetails();
    const motionOn = enabled();
    root.classList.toggle("motion-paused", !motionOn);
    toggle?.setAttribute("aria-pressed", String(!motionOn));
    toggle?.setAttribute(
      "aria-label",
      reduced.matches
        ? "Motion reduced by your system preference"
        : motionOn
          ? "Pause decorative motion"
          : "Enable decorative motion",
    );
    if (toggle) {
      toggle.querySelector("[data-motion-label]").textContent = reduced.matches
        ? "Reduced motion"
        : motionOn
          ? "Motion on"
          : "Motion off";
      toggle.disabled = reduced.matches;
    }
    setupScroll();
    setupAnimations();
    syncParticles();
    updateScroll();
    window.dispatchEvent(new Event("quiet-signal-motion"));
  }
  toggle?.addEventListener("click", () => {
    paused = !paused;
    try {
      localStorage.setItem("quiet-signal-motion", paused ? "paused" : "on");
    } catch {}
    applyPreference();
  });
  reduced.addEventListener("change", applyPreference);
  desktop.addEventListener("change", () => {
    setupScroll();
    setupAnimations();
  });
  tallScreen.addEventListener("change", setupAnimations);
  applyPreference();

  /* ─────────────────────────────────────────────────────────
     NOISE PARADOX CLIMAX INTERACTIVE SCRIPTS
     - Live Countdown
     - Decrypt Text Scrambler
     - Atmospheric Meteor & Particle Canvas
     ───────────────────────────────────────────────────────── */
  function initNoiseParadoxClimax() {
    const section = document.querySelector(".noise-paradox-climax");
    if (!section) return;

    // 1. Live Countdown
    const daysEl = section.querySelector('[data-countdown="days"]');
    const hoursEl = section.querySelector('[data-countdown="hours"]');
    const minsEl = section.querySelector('[data-countdown="minutes"]');
    const secsEl = section.querySelector('[data-countdown="seconds"]');

    const targetDate = new Date("2026-10-30T17:30:00+05:30").getTime();

    function updateCountdown() {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(d).padStart(2, "0");
      if (hoursEl) hoursEl.textContent = String(h).padStart(2, "0");
      if (minsEl) minsEl.textContent = String(m).padStart(2, "0");
      if (secsEl) secsEl.textContent = String(s).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 2. Decrypt Text Scramble for PARADOX
    const scrambleEl = section.querySelector('[data-scramble]');
    if (scrambleEl) {
      const originalText = scrambleEl.getAttribute("data-scramble") || scrambleEl.textContent.trim();
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?~/";
      let scrambleTimer = null;
      let isScrambling = false;

      function triggerScramble() {
        if (isScrambling || !enabled()) return;
        isScrambling = true;
        let iteration = 0;
        const maxIterations = 14;

        clearInterval(scrambleTimer);
        scrambleTimer = setInterval(() => {
          iteration += 1;
          const next = originalText
            .split("")
            .map((char, index) => {
              if (index < (iteration / maxIterations) * originalText.length) {
                return originalText[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");

          scrambleEl.textContent = next;

          if (iteration >= maxIterations) {
            clearInterval(scrambleTimer);
            scrambleEl.textContent = originalText;
            isScrambling = false;
          }
        }, 40);
      }

      scrambleEl.addEventListener("mouseenter", triggerScramble);

      // Scramble on scroll trigger once
      if ("IntersectionObserver" in window) {
        const obs = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              triggerScramble();
              obs.disconnect();
            }
          },
          { threshold: 0.3 }
        );
        obs.observe(scrambleEl);
      }
    }

    // 3. Ambient Canvas Particles & Meteors
    const canvas = section.querySelector(".noise-climax-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animId = null;

    function resizeCanvas() {
      width = canvas.width = section.clientWidth;
      height = canvas.height = section.clientHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // Floating particles
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * (width || 800),
      y: Math.random() * (height || 600),
      size: Math.random() * 1.5 + 0.8,
      speedY: -(Math.random() * 0.4 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    // Meteors
    const meteors = Array.from({ length: 4 }, () => resetMeteor());

    function resetMeteor(m = {}) {
      m.x = Math.random() * (width || 800) + 100;
      m.y = Math.random() * ((height || 600) * 0.4) - 50;
      m.len = Math.random() * 60 + 40;
      m.speed = Math.random() * 4 + 3;
      m.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; // roughly 45 degrees
      m.alpha = Math.random() * 0.4 + 0.2;
      return m;
    }

    let isSectionVisible = true;
    if ("IntersectionObserver" in window) {
      const visObs = new IntersectionObserver((entries) => {
        isSectionVisible = entries[0].isIntersecting;
      });
      visObs.observe(section);
    }

    function renderCanvas() {
      if (!isSectionVisible || paused || reduced.matches) {
        animId = requestAnimationFrame(renderCanvas);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Render red ambient particles
      ctx.fillStyle = "#e62b1e";
      for (const p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render meteors
      for (const m of meteors) {
        m.x -= Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;

        if (m.x < -100 || m.y > height + 100) {
          resetMeteor(m);
        }

        const tailX = m.x + Math.cos(m.angle) * m.len;
        const tailY = m.y - Math.sin(m.angle) * m.len;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, "rgba(230, 43, 30, " + m.alpha + ")");
        grad.addColorStop(1, "rgba(230, 43, 30, 0)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(renderCanvas);
    }

    renderCanvas();
  }

  /* ─────────────────────────────────────────────────────────
     MIND STORY SCROLL REVEALS & UNIVERSAL SCRAMBLER
     ───────────────────────────────────────────────────────── */
  function initMindStory() {
    // 1. Text Scrambler for all [data-scramble] elements
    const scramblers = document.querySelectorAll("[data-scramble]");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?~/";

    scramblers.forEach((el) => {
      const originalText = el.getAttribute("data-scramble") || el.textContent.trim();
      let isScrambling = false;
      let timer = null;

      function runScramble() {
        if (isScrambling || !enabled()) return;
        isScrambling = true;
        let iter = 0;
        const maxIter = 14;

        clearInterval(timer);
        timer = setInterval(() => {
          iter += 1;
          el.textContent = originalText
            .split("")
            .map((char, index) => {
              if (index < (iter / maxIter) * originalText.length) {
                return originalText[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");

          if (iter >= maxIter) {
            clearInterval(timer);
            el.textContent = originalText;
            isScrambling = false;
          }
        }, 40);
      }

      el.addEventListener("mouseenter", runScramble);

      if ("IntersectionObserver" in window) {
        const obs = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              runScramble();
              obs.disconnect();
            }
          },
          { threshold: 0.3 }
        );
        obs.observe(el);
      }
    });

    // 2. Video safety & autoplay handler for both videos
    const mindVideos = document.querySelectorAll(".mind-visual .mind-video");
    mindVideos.forEach((video) => {
      // Ensure video plays continuously and retries safely if browser restricts autoplay
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          // Retry on user interaction
          const resumeOnInteract = () => {
            video.play().catch(() => {});
            window.removeEventListener("scroll", resumeOnInteract);
            window.removeEventListener("touchstart", resumeOnInteract);
            window.removeEventListener("click", resumeOnInteract);
          };
          window.addEventListener("scroll", resumeOnInteract, { once: true, passive: true });
          window.addEventListener("touchstart", resumeOnInteract, { once: true, passive: true });
          window.addEventListener("click", resumeOnInteract, { once: true, passive: true });
        });
      }

      // Defer / pause playback when out of viewport to optimize GPU & power
      if ("IntersectionObserver" in window) {
        const videoObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                if (video.paused) video.play().catch(() => {});
              } else {
                if (!video.paused) video.pause();
              }
            });
          },
          { rootMargin: "250px" }
        );
        videoObserver.observe(video);
      }
    });

    // 3. Scroll-triggered entrance for mind-beats & parallax using GSAP / ScrollTrigger.
    // Runs only while motion is on; reverting leaves the cards fully visible.
    let mindContext;
    function setupMindMotion() {
      mindContext?.revert();
      mindContext = null;
      if (!enabled() || !window.gsap || !window.ScrollTrigger) return;
      mindContext = window.gsap.context(() => {
    const beats = document.querySelectorAll(".mind-beat");
    beats.forEach((beat) => {
      const card = beat.querySelector(".mind-card");
      const visual = beat.querySelector(".mind-visual");

      {
        // Entrance: card fades in with 20px upward movement
        window.gsap.fromTo(
          card,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: beat,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Entrance: sculpture reveals with smooth fade-in and 20px upward movement
        window.gsap.fromTo(
          visual,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: beat,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Restrained vertical parallax (approx 20px) while scrolling through the section
        window.gsap.to(visual, {
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: beat,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }
    });
      });
    }
    setupMindMotion();
    window.addEventListener("quiet-signal-motion", setupMindMotion);
  }

  // Past speakers carousel: swipe/scroll, arrows and gentle auto-advance.
  function initVoicesCarousel() {
    const wrap = document.querySelector("[data-carousel]");
    const track = wrap?.querySelector("[data-carousel-track]");
    if (!track) return;
    const step = () => {
      const card = track.querySelector(".voice-card");
      return card ? card.getBoundingClientRect().width + 20 : track.clientWidth;
    };
    const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    const go = (dir) => {
      if (dir > 0 && atEnd()) track.scrollTo({ left: 0 });
      else if (dir < 0 && track.scrollLeft <= 4)
        track.scrollTo({ left: track.scrollWidth });
      else track.scrollBy({ left: dir * step() });
    };
    wrap.querySelector(".carousel-prev")?.addEventListener("click", () => go(-1));
    wrap.querySelector(".carousel-next")?.addEventListener("click", () => go(1));
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    });
    let hold = false;
    let visible = false;
    ["pointerenter", "focusin", "pointerdown", "touchstart"].forEach((t) =>
      wrap.addEventListener(t, () => (hold = true), { passive: true }),
    );
    ["pointerleave", "focusout", "touchend"].forEach((t) =>
      wrap.addEventListener(t, () => (hold = false), { passive: true }),
    );
    if ("IntersectionObserver" in window)
      new IntersectionObserver((e) => (visible = e[0].isIntersecting), {
        threshold: 0.3,
      }).observe(wrap);
    setInterval(() => {
      if (hold || !visible || document.hidden || !enabled()) return;
      go(1);
    }, 3500);
  }
  initVoicesCarousel();

  // Home page ambient dots: slow drift, gently pushed away by the cursor.
  function initAmbientDots() {
    if (!document.querySelector(".hero")) return;
    const canvas = document.createElement("canvas");
    canvas.className = "ambient-dots";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0,
      h = 0,
      dpr = 1,
      dots = [],
      raf = 0;
    const mouse = { x: -9999, y: -9999 };
    const R = 150;

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      w = innerWidth;
      h = innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(w < 700 ? 28 : 64, Math.round((w * h) / 24000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 0.8 + Math.random() * 1.4,
        red: Math.random() < 0.18,
      }));
    }
    function draw(move) {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        if (move) {
          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < R && dist > 0.1) {
            const f = ((R - dist) / R) * 0.6;
            d.vx += (dx / dist) * f * 0.12;
            d.vy += (dy / dist) * f * 0.12;
          }
          d.vx *= 0.985;
          d.vy *= 0.985;
          d.x += d.vx + Math.sin((d.y + d.x) * 0.002) * 0.04;
          d.y += d.vy;
          if (d.x < -10) d.x = w + 10;
          if (d.x > w + 10) d.x = -10;
          if (d.y < -10) d.y = h + 10;
          if (d.y > h + 10) d.y = -10;
        }
        const near = Math.hypot(d.x - mouse.x, d.y - mouse.y) < R;
        ctx.globalAlpha = near ? 0.55 : 0.26;
        ctx.fillStyle = d.red ? "#ff6558" : "#f3f1ee";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, 6.283);
        ctx.fill();
        if (near) {
          ctx.globalAlpha = 0.12;
          ctx.strokeStyle = d.red ? "#ff6558" : "#f3f1ee";
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }
    function frame() {
      draw(true);
      raf = requestAnimationFrame(frame);
    }
    function sync() {
      cancelAnimationFrame(raf);
      raf = 0;
      if (enabled() && !document.hidden) frame();
      else draw(false);
    }
    resize();
    sync();
    addEventListener("resize", () => {
      resize();
      sync();
    });
    addEventListener(
      "pointermove",
      (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      },
      { passive: true },
    );
    document.addEventListener("pointerleave", () => (mouse.x = mouse.y = -9999));
    document.addEventListener("visibilitychange", sync);
    addEventListener("quiet-signal-motion", sync);
  }
  initAmbientDots();

  initNoiseParadoxClimax();
  initMindStory();

  addEventListener(
    "load",
    () => {
      window.ScrollTrigger?.refresh();
      measureScroll();
    },
    { once: true },
  );
})();
