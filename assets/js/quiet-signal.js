/* Progressive enhancement for the static Quiet Signal pages. */
"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.getElementById("site-nav");
function syncMenu(open) {
  document.body.classList.toggle("menu-open", open);
  document
    .querySelectorAll("main, .site-footer, .motion-toggle")
    .forEach((el) => {
      el.inert = open;
    });
  document.dispatchEvent(new Event("overlaychange"));
}
function closeMenu(returnFocus = false) {
  if (!menuToggle || !navigation) return;
  const wasOpen = menuToggle.getAttribute("aria-expanded") === "true";
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  syncMenu(false);
  if (returnFocus && wasOpen) menuToggle.focus();
}
menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("is-open", open);
  syncMenu(open);
});
navigation?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu(true);
  if (
    event.key === "Tab" &&
    menuToggle?.getAttribute("aria-expanded") === "true"
  ) {
    const links = [...navigation.querySelectorAll("a")];
    const last = links.at(-1);
    if (event.shiftKey && document.activeElement === menuToggle) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      menuToggle.focus();
    }
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
window.matchMedia("(min-width: 1101px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const dialogOpeners = new WeakMap();
document.querySelectorAll("[data-dialog]").forEach((button) => {
  const dialog = document.getElementById(button.dataset.dialog);
  if (!dialog) return;
  button.addEventListener("click", () => {
    dialogOpeners.set(dialog, button);
    dialog.showModal();
    document.dispatchEvent(new Event("overlaychange"));
  });
});
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog
    .querySelectorAll("[data-close]")
    .forEach((button) =>
      button.addEventListener("click", () => dialog.close()),
    );
  dialog.addEventListener("click", (event) => {
    const box = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom)
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    dialogOpeners.get(dialog)?.focus({ preventScroll: true });
    document.dispatchEvent(new Event("overlaychange"));
  });
});

// Archive links continue to work without JavaScript; filtering is an enhancement.
const talkGroups = [...document.querySelectorAll(".talk-group")];
function filterTalks() {
  if (!talkGroups.length) return;
  let id = "";
  try {
    id = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    /* An invalid fragment leaves all editions available. */
  }
  const selected = talkGroups.find((group) => group.id === id);
  talkGroups.forEach((group) => {
    group.hidden = Boolean(selected && selected !== group);
  });
  document.querySelectorAll("[data-talk-filter]").forEach((link) => {
    if (link.dataset.talkFilter === id)
      link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}
filterTalks();
window.addEventListener("hashchange", filterTalks);
document.querySelectorAll("[data-video]").forEach((button) => {
  button.addEventListener("click", () => {
    const player = document.getElementById("vid_frame");
    if (!player || !/^[\w-]{11}$/.test(button.dataset.video)) return;
    document.querySelector(".player-placeholder").hidden = true;
    player.hidden = false;
    player.src = `https://www.youtube.com/embed/${button.dataset.video}?rel=0`;
    player.title = button.dataset.title;
    document.getElementById("player-caption").textContent =
      button.dataset.title;
    document.getElementById("talk-player").scrollIntoView({
      behavior:
        reducedMotion.matches ||
        document.documentElement.classList.contains("motion-paused")
          ? "instant"
          : "smooth",
      block: "center",
    });
    player.focus({ preventScroll: true });
  });
});

// Same endpoint and payload as the original site. Enable only for a confirmed edition.
const form = document.getElementById("registration-form");
if (form) {
  const panel = form.closest(".registration-panel");
  const nameInput = document.getElementById("name");
  const collegeType = document.getElementById("college-type");
  const nitkFields = document.getElementById("nitk-fields");
  const otherFields = document.getElementById("non-nitk-fields");
  const collegeName = document.getElementById("college-name");
  const generalEmail = document.getElementById("general-email");
  const phoneNumber = document.getElementById("phone-number");
  const reasonInput = document.getElementById("reason");
  const responseMessage = document.getElementById("form-response");
  const submit = document.getElementById("submit-button");
  const nitkEmail = document.getElementById("nitk-email");
  const roll = document.getElementById("roll-number");
  let submitting = false;

  function updateProgress() {
    if (!panel) return;
    const isNitk = collegeType.value === "nitk";
    const isOther = collegeType.value === "non-nitk";

    const fields = [nameInput, collegeType];
    if (isNitk) {
      fields.push(nitkEmail, roll);
    } else if (isOther) {
      fields.push(collegeName, generalEmail, phoneNumber);
    }
    fields.push(reasonInput);

    let filled = 0;
    fields.forEach((field) => {
      if (field && field.value && field.value.trim().length > 0) {
        filled++;
      }
    });

    let percent = Math.round((filled / fields.length) * 100);

    // When user types in the last box (reason) and other fields are entered, ensure it hits 100%
    if (reasonInput && reasonInput.value.trim().length > 0) {
      const othersFilled = fields
        .filter((f) => f !== reasonInput)
        .every((f) => f && f.value && f.value.trim().length > 0);
      if (othersFilled) {
        percent = 100;
      }
    }

    panel.style.setProperty("--form-progress", `${percent}%`);
  }

  function updateFields() {
    const isNitk = collegeType.value === "nitk";
    const isOther = collegeType.value === "non-nitk";
    nitkFields.hidden = nitkFields.disabled = !isNitk;
    otherFields.hidden = otherFields.disabled = !isOther;
    nitkEmail.setCustomValidity("");
    roll.setCustomValidity("");
  }
  collegeType.addEventListener("change", () => {
    updateFields();
    updateProgress();
  });
  form.addEventListener("input", updateProgress);
  nitkEmail.addEventListener("input", () => nitkEmail.setCustomValidity(""));
  roll.addEventListener("input", () => {
    roll.value = roll.value.toUpperCase();
  });
  updateFields();
  updateProgress();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.dataset.open !== "true") {
      responseMessage.textContent =
        "Registration opens soon. Submissions are currently closed.";
      responseMessage.focus();
      return;
    }
    if (submitting) return;
    const isNitk = collegeType.value === "nitk";
    if (isNitk && !/^[^\s@]+@nitk\.edu\.in$/i.test(nitkEmail.value.trim())) {
      nitkEmail.setCustomValidity(
        "Use your NITK email address ending in @nitk.edu.in.",
      );
      nitkEmail.reportValidity();
      return;
    }
    if (!form.reportValidity()) return;
    submitting = true;
    submit.disabled = true;
    submit.textContent = "Submitting…";
    responseMessage.textContent = "";
    delete responseMessage.dataset.state;
    const value = (id) => document.getElementById(id).value.trim();
    const payload = {
      name: value("name"),
      reason: value("reason"),
      college: isNitk ? "NITK Surathkal" : value("college-name"),
      email: isNitk ? value("nitk-email") : value("general-email"),
      rollNumber: isNitk ? value("roll-number").toUpperCase() : null,
      phoneNumber: isNitk ? null : value("phone-number"),
    };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(form.dataset.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(
          result?.error ||
            "We could not complete your registration. Please try again or contact tedx@nitk.edu.in.",
        );
      if (!result)
        throw new Error(
          "The registration service returned an unexpected response. Contact tedx@nitk.edu.in to confirm your registration before trying again.",
        );
      responseMessage.textContent =
        "Thank you. Your registration was received successfully.";
      responseMessage.dataset.state = "success";
      form.reset();
      updateFields();
    } catch (error) {
      responseMessage.textContent =
        error.name === "AbortError"
          ? "The request timed out. Your registration may have reached us; please contact tedx@nitk.edu.in before submitting again."
          : error instanceof TypeError
            ? "Unable to reach the registration service. Check your connection and try again."
            : error.message;
      responseMessage.dataset.state = "error";
    } finally {
      clearTimeout(timer);
      submitting = false;
      submit.disabled = false;
      submit.innerHTML = 'Register <span aria-hidden="true">↗</span>';
      responseMessage.focus();
    }
  });
}

// Past Editions archive index: active state tracking & smooth animated indicator
(() => {
  const sidebar = document.querySelector(".legacy-archive .sidebar");
  if (!sidebar) return;

  const links = [...sidebar.querySelectorAll("a.nav-link")];
  const panes = links
    .map((link) => {
      const href = link.getAttribute("href");
      return href && href.startsWith("#")
        ? document.getElementById(href.slice(1))
        : null;
    })
    .filter(Boolean);

  if (!panes.length) return;

  let activeId = "";
  let isClickScrolling = false;
  let clickTimeout = null;
  let ticking = false;

  function setActive(id) {
    if (activeId === id) return;
    activeId = id;
    links.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isMatch);
      if (isMatch) {
        link.setAttribute("aria-current", "true");
        link.scrollIntoView?.({ block: "nearest", inline: "nearest" });
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  // Smooth click navigation
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      setActive(target.id);

      isClickScrolling = true;
      if (clickTimeout) clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        isClickScrolling = false;
      }, 750);

      history.replaceState(null, "", href);

      if (window.__lenis) {
        window.__lenis.scrollTo(target, { offset: -120 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Calculate which edition is currently in the reading viewport
  function getActivePane() {
    // 1. If at or near top of the page (hero/intro visible), first edition is active
    if (window.scrollY < 120) {
      return panes[0];
    }

    // 2. If reached bottom of document (footer visible), last edition is active
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 80
    ) {
      return panes[panes.length - 1];
    }

    // 3. Focal reading line: 140px below viewport top (clearing fixed header)
    const readingLine = 140;
    for (let i = 0; i < panes.length; i++) {
      const rect = panes[i].getBoundingClientRect();
      if (rect.top <= readingLine && rect.bottom > readingLine) {
        return panes[i];
      }
    }

    // 4. Safe fallback for boundary gaps: pick latest pane that has crossed reading line
    for (let i = panes.length - 1; i >= 0; i--) {
      const rect = panes[i].getBoundingClientRect();
      if (rect.top <= readingLine) {
        return panes[i];
      }
    }

    return panes[0];
  }

  function update() {
    if (isClickScrolling) {
      ticking = false;
      return;
    }
    const current = getActivePane();
    if (current) {
      setActive(current.id);
    }
    ticking = false;
  }

  function onScroll() {
    if (isClickScrolling) return;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  // Initial state from URL hash or default to first edition
  const initialHash = window.location.hash.slice(1);
  if (initialHash && document.getElementById(initialHash)) {
    setActive(initialHash);
  } else {
    setActive(panes[0].id);
  }
})();

