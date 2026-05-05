(function () {
  "use strict";

  var COOKIE_KEY = "helix_cookie_prefs";

  function qs(s, r) {
    return (r || document).querySelector(s);
  }
  function qsa(s, r) {
    return [].slice.call((r || document).querySelectorAll(s));
  }

  var yearEl = qs("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Ada pill — deepen shadow on scroll */
  var navPill = qs("#helix-nav-pill");
  function onScroll() {
    if (!navPill) return;
    if (window.scrollY > 8) {
      navPill.classList.add("shadow-brand-lg", "ring-1", "ring-brand-grey/60");
    } else {
      navPill.classList.remove("shadow-brand-lg", "ring-1", "ring-brand-grey/60");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile drawer */
  var drawer = qs("#hx-nav-drawer");
  var navOpen = qs("#hx-nav-open");
  var navClose = qs("#hx-nav-close");

  function lockBody(lock) {
    document.body.classList.toggle("hx-lock", !!lock);
  }

  function openDrawer() {
    if (!drawer || !navOpen) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    navOpen.setAttribute("aria-expanded", "true");
    lockBody(true);
  }

  function closeDrawer() {
    if (!drawer || !navOpen) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    navOpen.setAttribute("aria-expanded", "false");
    if (!demoModal || demoModal.hidden) {
      if (!prefsPanel || prefsPanel.hidden) lockBody(false);
    }
  }

  if (navOpen) {
    navOpen.addEventListener("click", function () {
      openDrawer();
    });
  }
  if (navClose) {
    navClose.addEventListener("click", closeDrawer);
  }
  qsa("[data-close-nav]").forEach(function (el) {
    el.addEventListener("click", closeDrawer);
  });

  /* Reveal on scroll */
  var toReveal = qsa(".hx-reveal:not(.is-visible)");
  if ("IntersectionObserver" in window && toReveal.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (ent) {
          if (!ent.isIntersecting) return;
          ent.target.classList.add("is-visible");
          io.unobserve(ent.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 }
    );
    toReveal.forEach(function (el) {
      io.observe(el);
    });
  } else {
    toReveal.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Demo modal */
  var demoModal = qs("#demo-modal");
  var demoForm = qs("#demo-form");
  var demoStatus = qs("#demo-form-status");
  var lastFocus = null;

  function trap(container, ev) {
    var nodes = qsa(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      container
    ).filter(function (n) {
      return !n.disabled && n.offsetParent !== null;
    });
    if (!nodes.length) return;
    var first = nodes[0];
    var last = nodes[nodes.length - 1];
    if (ev.key !== "Tab") return;
    if (ev.shiftKey && document.activeElement === first) {
      ev.preventDefault();
      last.focus();
    } else if (!ev.shiftKey && document.activeElement === last) {
      ev.preventDefault();
      first.focus();
    }
  }

  function onDemoKey(ev) {
    if (ev.key === "Escape") closeDemo();
    if (demoModal && !demoModal.hidden)
      trap(qs(".hx-modal-sheet", demoModal), ev);
  }

  function openDemo() {
    if (!demoModal) return;
    closeDrawer();
    lastFocus = document.activeElement;
    demoModal.hidden = false;
    lockBody(true);
    var btn = qs("button[data-close-demo]", demoModal);
    if (btn) btn.focus();
    document.addEventListener("keydown", onDemoKey);
  }

  function closeDemo() {
    if (!demoModal) return;
    demoModal.hidden = true;
    document.removeEventListener("keydown", onDemoKey);
    if (demoForm) {
      demoForm.classList.remove("hx-form--attempted");
      qsa(".hx-field", demoForm).forEach(function (el) {
        el.classList.remove("hx-touched");
      });
    }
    if (!drawer || !drawer.classList.contains("is-open")) {
      if (!prefsPanel || prefsPanel.hidden) lockBody(false);
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  qsa("[data-open-demo]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (btn.tagName === "A") e.preventDefault();
      openDemo();
    });
  });
  qsa("[data-close-demo]").forEach(function (el) {
    el.addEventListener("click", closeDemo);
  });

  if (demoForm && demoStatus) {
    demoForm.addEventListener("submit", function (e) {
      e.preventDefault();
      demoForm.classList.add("hx-form--attempted");
      if (!demoForm.reportValidity()) return;

      // Collect fields
      var firstName = qs("[name='firstName']", demoForm).value.trim();
      var lastName = qs("[name='lastName']", demoForm).value.trim();
      var jobTitle = qs("[name='jobTitle']", demoForm).value.trim();
      var facility = qs("[name='facility']", demoForm).value.trim();
      var email = qs("[name='email']", demoForm).value.trim();
      var phone = qs("[name='phone']", demoForm).value.trim();
      var estimatedUsers = qs("[name='estimatedUsers']", demoForm).value.trim();
      var details = qs("[name='details']", demoForm).value.trim();
      var fullName = (firstName + " " + lastName).trim();

      // Build a clean, readable email body
      var lines = [];
      lines.push("New Demo Request");
      lines.push("================");
      lines.push("");
      lines.push("CONTACT");
      lines.push("-------");
      lines.push("Name:        " + (fullName || "-"));
      lines.push("Job Title:   " + (jobTitle || "-"));
      lines.push("Facility:    " + (facility || "-"));
      lines.push("Email:       " + (email || "-"));
      lines.push("Phone:       " + (phone || "-"));
      lines.push("");
      lines.push("DEPLOYMENT");
      lines.push("----------");
      lines.push("Estimated Users: " + (estimatedUsers || "-"));
      lines.push("");
      lines.push("DETAILS");
      lines.push("-------");
      lines.push(details || "(none provided)");
      lines.push("");
      lines.push("--");
      lines.push("Submitted from helix-website demo form.");
      var prettyMessage = lines.join("\n");

      // Send only curated, labeled fields so the email is clean
      var formData = new FormData();
      formData.append("Name", fullName);
      formData.append("Email", email);
      formData.append("Phone", phone);
      formData.append("Job Title", jobTitle);
      formData.append("Facility", facility);
      formData.append("Estimated Users", estimatedUsers);
      formData.append("Details", details);
      formData.append("message", prettyMessage);
      formData.append("_subject", "New Demo Request \u2014 " + (fullName || email));
      formData.append("_format", "plain");
      if (email) formData.append("_replyto", email);

      demoStatus.textContent = "Sending...";

      fetch(demoForm.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      })
      .then(function(response) {
        if (response.ok) {
          demoStatus.textContent = "✓ Demo request sent successfully! We'll be in touch within one business day.";
          demoForm.reset();
          demoForm.classList.remove("hx-form--attempted");
          qsa(".hx-field", demoForm).forEach(function (el) {
            el.classList.remove("hx-touched");
          });
          setTimeout(closeDemo, 3000);
        } else {
          demoStatus.textContent = "Error sending request. Please try again.";
        }
      })
      .catch(function() {
        demoStatus.textContent = "Error sending request. Please try again.";
      });
    });
  }

  var contactForm = qs("#contact-form");
  var contactStatus = qs("#contact-form-status");

  if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      contactForm.classList.add("hx-form--attempted");
      if (!contactForm.reportValidity()) return;

      var email = qs("[name='email']", contactForm).value.trim();
      var topic = qs("[name='topic']", contactForm).value.trim();
      var message = qs("[name='message']", contactForm).value.trim();
      var nameField = qs("[name='name']", contactForm);
      var senderName = nameField ? nameField.value.trim() : "";

      // Build a clean, readable email body
      var lines = [];
      lines.push("New Contact Message");
      lines.push("===================");
      lines.push("");
      lines.push("From:    " + (senderName || "(not provided)"));
      lines.push("Email:   " + (email || "-"));
      lines.push("Topic:   " + (topic || "-"));
      lines.push("");
      lines.push("MESSAGE");
      lines.push("-------");
      lines.push(message || "(empty)");
      lines.push("");
      lines.push("--");
      lines.push("Submitted from helix-website contact form.");
      var prettyMessage = lines.join("\n");

      var formData = new FormData();
      if (senderName) formData.append("Name", senderName);
      formData.append("Email", email);
      formData.append("Topic", topic);
      formData.append("Message", message);
      formData.append("message", prettyMessage);
      formData.append("_subject", "Helix Contact \u2014 " + (topic || "New Message"));
      formData.append("_format", "plain");
      if (email) formData.append("_replyto", email);

      contactStatus.textContent = "Sending...";

      fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      })
      .then(function(response) {
        if (response.ok) {
          contactStatus.textContent = "✓ Message sent! We'll get back to you soon.";
          contactForm.reset();
          contactForm.classList.remove("hx-form--attempted");
          qsa(".hx-field", contactForm).forEach(function (el) {
            el.classList.remove("hx-touched");
          });
        } else {
          contactStatus.textContent = "Error sending message. Please try again.";
        }
      })
      .catch(function() {
        contactStatus.textContent = "Error sending message. Please try again.";
      });
    });
  }

  /* Blur validation highlight (demo + contact + cookie prefs) */
  function wireFieldBlur(root) {
    if (!root) return;
    qsa(".hx-field", root).forEach(function (el) {
      el.addEventListener("blur", function () {
        el.classList.add("hx-touched");
      });
      el.addEventListener("input", function () {
        if (el.checkValidity()) el.classList.remove("hx-touched");
      });
      el.addEventListener("change", function () {
        if (el.checkValidity()) el.classList.remove("hx-touched");
      });
    });
  }
  wireFieldBlur(demoForm);
  wireFieldBlur(contactForm);
  var prefsCard = qs(".hx-prefs-card");
  if (prefsCard) wireFieldBlur(prefsCard);

  /* Animated hero chat */
  var chatRoot = qs("#helix-chat-demo");
  var chatMsgs = chatRoot ? qsa("[data-chat-msg]", chatRoot) : [];
  var chatTyping = qs("#helix-chat-typing");
  var chatTimer = null;

  function clearChatAnim() {
    if (chatTimer) clearTimeout(chatTimer);
    chatTimer = null;
  }

  function runChatLoop() {
    if (!chatRoot || !chatMsgs.length) return;
    var reduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      chatMsgs.forEach(function (m) {
        m.classList.add("helix-chat-demo__msg--show");
      });
      return;
    }
    var step = 0;
    function clearAll() {
      chatMsgs.forEach(function (m) {
        m.classList.remove("helix-chat-demo__msg--show");
      });
      if (chatTyping) chatTyping.classList.remove("helix-chat-demo__typing--on");
    }
    function tick() {
      clearChatAnim();
      if (step < chatMsgs.length) {
        chatMsgs[step].classList.add("helix-chat-demo__msg--show");
        step++;
        chatTimer = setTimeout(tick, step === chatMsgs.length ? 900 : 780);
      } else if (step === chatMsgs.length) {
        if (chatTyping) chatTyping.classList.add("helix-chat-demo__typing--on");
        step++;
        chatTimer = setTimeout(tick, 1100);
      } else {
        if (chatTyping) chatTyping.classList.remove("helix-chat-demo__typing--on");
        step++;
        chatTimer = setTimeout(function () {
          clearAll();
          step = 0;
          tick();
        }, 2200);
      }
    }
    clearAll();
    tick();
  }
  runChatLoop();

  /* Cookies */
  function getPrefs() {
    try {
      var raw = localStorage.getItem(COOKIE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function savePrefs(p) {
    try {
      localStorage.setItem(COOKIE_KEY, JSON.stringify(p));
    } catch (e) {}
    if (p.analytics) {
      console.info("[Helix] Analytics enabled — add your tag manager here.");
    }
  }

  var banner = qs("#cookie-banner");
  var prefsPanel = qs("#cookie-settings");
  var prefAnalytics = qs("#pref-analytics");

  function showBanner() {
    if (banner) banner.hidden = false;
  }
  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  function openPrefs() {
    if (!prefsPanel) return;
    var p = getPrefs();
    if (prefAnalytics) prefAnalytics.checked = !!(p && p.analytics);
    prefsPanel.hidden = false;
    lockBody(true);
  }

  function closePrefs() {
    if (!prefsPanel) return;
    prefsPanel.hidden = true;
    if ((!demoModal || demoModal.hidden) && (!drawer || !drawer.classList.contains("is-open")))
      lockBody(false);
  }

  var existingPrefs = getPrefs();
  if (!existingPrefs) showBanner();
  else if (existingPrefs.analytics) {
    console.info("[Helix] Analytics cookies accepted previously — mount tags here.");
  }

  qs("#cookie-accept") &&
    qs("#cookie-accept").addEventListener("click", function () {
      savePrefs({ essential: true, analytics: true });
      hideBanner();
    });
  qs("#cookie-decline") &&
    qs("#cookie-decline").addEventListener("click", function () {
      savePrefs({ essential: true, analytics: false });
      hideBanner();
    });

  qsa("#open-cookie-settings").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      openPrefs();
    });
  });

  qsa("[data-close-prefs]").forEach(function (el) {
    el.addEventListener("click", closePrefs);
  });

  qs("#cookie-save-prefs") &&
    qs("#cookie-save-prefs").addEventListener("click", function () {
      savePrefs({
        essential: true,
        analytics: !!(prefAnalytics && prefAnalytics.checked),
      });
      closePrefs();
      hideBanner();
    });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeDrawer();
    closePrefs();
    closeDemo();
  });
})();
