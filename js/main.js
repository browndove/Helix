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

      function fieldVal(name) {
        var el = qs("[name='" + name + "']", demoForm);
        return el ? el.value.trim() : "";
      }
      var firstName = fieldVal("firstName");
      var lastName = fieldVal("lastName");
      var jobTitle = fieldVal("jobTitle");
      var facility = fieldVal("facility");
      var email = fieldVal("email");
      var phone = fieldVal("phone");
      var estimatedUsers = fieldVal("estimatedUsers");
      var details = fieldVal("details");
      var fullName = (firstName + " " + lastName).trim();

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

      var formData = new FormData();
      formData.append("Name", fullName);
      formData.append("Email", email);
      formData.append("Phone", phone);
      formData.append("Job Title", jobTitle);
      formData.append("Facility", facility);
      formData.append("Estimated Users", estimatedUsers);
      formData.append("Details", details);
      formData.append("message", prettyMessage);
      formData.append("_subject", "New Demo Request — " + (fullName || email));
      formData.append("_format", "plain");
      if (email) formData.append("_replyto", email);

      demoStatus.textContent = "Sending...";

      fetch(demoForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            demoStatus.textContent =
              "✓ Demo request sent successfully! We'll be in touch within one business day.";
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
        .catch(function () {
          demoStatus.textContent = "Error sending request. Please try again.";
        });
    });
  }

  var contactForm = qs("#contact-form");
  var contactStatus = qs("#contact-form-status");

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

  if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      contactForm.classList.add("hx-form--attempted");
      if (!contactForm.reportValidity()) return;

      var email = qs("[name='email']", contactForm).value.trim();
      var topicEl = qs("[name='topic']", contactForm);
      var topic = topicEl ? topicEl.value.trim() : "";
      var messageEl = qs("[name='message']", contactForm);
      var message = messageEl ? messageEl.value.trim() : "";
      var firstEl = qs("[name='firstName']", contactForm);
      var lastEl = qs("[name='lastName']", contactForm);
      var nameEl = qs("[name='name']", contactForm);
      var facilityEl = qs("[name='facility']", contactForm);
      var phoneEl = qs("[name='phone']", contactForm);
      var senderName = (
        ((firstEl && firstEl.value) || "") +
        " " +
        ((lastEl && lastEl.value) || "")
      ).trim();
      if (!senderName && nameEl) senderName = nameEl.value.trim();
      var facility = facilityEl ? facilityEl.value.trim() : "";
      var phone = phoneEl ? phoneEl.value.trim() : "";

      var lines = [];
      lines.push("New Contact Message");
      lines.push("===================");
      lines.push("");
      lines.push("From:     " + (senderName || "(not provided)"));
      lines.push("Email:    " + (email || "-"));
      if (facility) lines.push("Facility: " + facility);
      if (phone) lines.push("Phone:    " + phone);
      lines.push("Topic:    " + (topic || "-"));
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
      if (facility) formData.append("Facility", facility);
      if (phone) formData.append("Phone", phone);
      formData.append("Topic", topic);
      formData.append("Message", message);
      formData.append("message", prettyMessage);
      formData.append("_subject", "Helix Contact — " + (topic || "New Message"));
      formData.append("_format", "plain");
      if (email) formData.append("_replyto", email);

      contactStatus.textContent = "Sending...";

      fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
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
        .catch(function () {
          contactStatus.textContent = "Error sending message. Please try again.";
        });
    });
  }

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

  /* ---------------------------------------------------------------------
     Header mega menu — hover on pointer devices, click/keyboard everywhere
     --------------------------------------------------------------------- */
  var navItems = qsa(".hx-nav-item");

  function closeMenus(except) {
    navItems.forEach(function (item) {
      if (item === except) return;
      item.classList.remove("is-open");
      var trigger = qs(".hx-nav-trigger", item);
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }

  navItems.forEach(function (item) {
    var trigger = qs(".hx-nav-trigger", item);
    if (!trigger) return;
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      var willOpen = !item.classList.contains("is-open");
      closeMenus(item);
      item.classList.toggle("is-open", willOpen);
      trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
    item.addEventListener("mouseleave", function () {
      item.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest || !e.target.closest(".hx-nav-item")) closeMenus(null);
  });

  /* ---------------------------------------------------------------------
     Animated counters
     --------------------------------------------------------------------- */
  var reducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function formatCount(value, decimals) {
    var fixed = value.toFixed(decimals);
    var parts = fixed.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count-to"));
    if (isNaN(target)) return;
    var decimals = parseInt(el.getAttribute("data-count-decimals") || "0", 10);
    var prefix = el.getAttribute("data-count-prefix") || "";
    var suffix = el.getAttribute("data-count-suffix") || "";

    if (reducedMotion) {
      el.textContent = prefix + formatCount(target, decimals) + suffix;
      return;
    }

    var duration = 1700;
    var start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + formatCount(target * eased, decimals) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var counters = qsa("[data-count-to]");
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var countObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            runCounter(entry.target);
            countObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach(function (el) {
        countObserver.observe(el);
      });
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ---------------------------------------------------------------------
     Phone preview — scene player with working tab bar
     --------------------------------------------------------------------- */
  var phone = qs("#hx-phone");
  if (phone) {
    var scenes = qsa("[data-scene]", phone);
    var sceneTabs = qsa("[data-scene-target]", phone);
    var order = scenes.map(function (s) {
      return s.getAttribute("data-scene");
    });
    var current = 0;
    var autoplay = !reducedMotion;
    var sceneTimer = null;
    var msgTimers = [];
    var inView = true;

    function clearTimers() {
      if (sceneTimer) clearTimeout(sceneTimer);
      sceneTimer = null;
      msgTimers.forEach(clearTimeout);
      msgTimers = [];
    }

    function playMessages(scene) {
      var items = qsa("[data-msg]", scene);
      if (!items.length) return;
      if (reducedMotion) {
        items.forEach(function (m) {
          m.classList.add("is-shown");
        });
        return;
      }
      items.forEach(function (m) {
        m.classList.remove("is-shown");
      });
      items.forEach(function (m, i) {
        msgTimers.push(
          setTimeout(function () {
            m.classList.add("is-shown");
          }, 260 + i * 620)
        );
      });
    }

    function show(index, fromUser) {
      clearTimers();
      current = (index + scenes.length) % scenes.length;
      scenes.forEach(function (scene, i) {
        scene.classList.toggle("is-active", i === current);
      });
      sceneTabs.forEach(function (tab) {
        var isActive = tab.getAttribute("data-scene-target") === order[current];
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", isActive ? "true" : "false");
      });
      playMessages(scenes[current]);
      if (fromUser) autoplay = false;
      queueNext();
    }

    function queueNext() {
      if (!autoplay || !inView) return;
      var dwell = parseInt(scenes[current].getAttribute("data-dwell") || "4200", 10);
      sceneTimer = setTimeout(function () {
        show(current + 1);
      }, dwell);
    }

    sceneTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-scene-target");
        var index = order.indexOf(target);
        if (index > -1) show(index, true);
      });
    });

    phone.addEventListener("mouseenter", function () {
      if (sceneTimer) clearTimeout(sceneTimer);
      sceneTimer = null;
    });
    phone.addEventListener("mouseleave", queueNext);

    if ("IntersectionObserver" in window) {
      var phoneObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            inView = entry.isIntersecting;
            if (inView) queueNext();
            else clearTimers();
          });
        },
        { threshold: 0.25 }
      );
      phoneObserver.observe(phone);
    }

    show(0);
  }

  /* ---------------------------------------------------------------------
     Tabbed sections
     --------------------------------------------------------------------- */
  qsa("[data-tabs]").forEach(function (group) {
    var tabs = qsa("[data-tab]", group);
    var panels = qsa("[data-tabpanel]", group);

    function activate(name) {
      tabs.forEach(function (tab) {
        var on = tab.getAttribute("data-tab") === name;
        tab.classList.toggle("is-active", on);
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.setAttribute("tabindex", on ? "0" : "-1");
      });
      panels.forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-tabpanel") !== name;
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activate(tab.getAttribute("data-tab"));
      });
      tab.addEventListener("keydown", function (e) {
        var step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        var next = tabs[(index + step + tabs.length) % tabs.length];
        next.focus();
        activate(next.getAttribute("data-tab"));
      });
    });

    if (tabs.length) activate(tabs[0].getAttribute("data-tab"));
  });

  /* ---------------------------------------------------------------------
     Accordions — one open at a time within a group
     --------------------------------------------------------------------- */
  qsa("[data-accordion]").forEach(function (group) {
    var panels = qsa("details.hx-acc", group);
    panels.forEach(function (panel) {
      panel.addEventListener("toggle", function () {
        if (!panel.open) return;
        panels.forEach(function (other) {
          if (other !== panel) other.open = false;
        });
      });
    });
  });

  /* ---------------------------------------------------------------------
     Login form (preview only — no credentials leave the browser)
     --------------------------------------------------------------------- */
  var loginForm = qs("#login-form");
  var loginStatus = qs("#login-status");
  if (loginForm && loginStatus) {
    wireFieldBlur(loginForm);
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      loginForm.classList.add("hx-form--attempted");
      if (!loginForm.reportValidity()) return;
      loginStatus.textContent =
        "This preview build has no authentication backend yet — connect your identity provider to enable sign-in.";
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeDrawer();
    closePrefs();
    closeDemo();
    closeMenus(null);
  });
})();
