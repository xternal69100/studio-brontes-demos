/* main.js — Location Lausanne
   Progressive enhancement: dual nav, reveal, form copy/share.
   Content remains visible without JS. No opacity:0 base states. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* ── V2 Monopo motion layer: additive, native scroll is never replaced. ── */
  var progress = document.createElement("div");
  progress.className = "v2-progress";
  progress.setAttribute("aria-hidden", "true");
  progress.innerHTML = '<span class="v2-progress__fill"></span>';
  document.body.appendChild(progress);

  var cursor = document.createElement("div");
  cursor.className = "v2-cursor";
  cursor.setAttribute("aria-hidden", "true");
  document.body.appendChild(cursor);
  var cursorLabel = "Voir";
  var framePending = false;
  function syncMotion() {
    framePending = false;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var p = Math.min(1, Math.max(0, window.scrollY / max));
    root.style.setProperty("--scroll-p", String(p));

    if (!reduce) {
      document.querySelectorAll(".machine-row").forEach(function (row) {
        var rect = row.getBoundingClientRect();
        var shift = Math.max(-14, Math.min(14, (window.innerHeight * 0.52 - (rect.top + rect.height / 2)) * 0.035));
        row.querySelectorAll(".machine-row__media img").forEach(function (image) {
          image.style.setProperty("--row-parallax", shift.toFixed(2) + "px");
        });
      });
    }
  }
  function requestMotion() {
    if (!framePending) { framePending = true; window.requestAnimationFrame(syncMotion); }
  }
  window.addEventListener("scroll", requestMotion, { passive: true });
  window.addEventListener("resize", requestMotion, { passive: true });
  syncMotion();

  if (!reduce) {
    window.addEventListener("pointermove", function (event) {
      root.style.setProperty("--pointer-x", ((event.clientX / window.innerWidth) - 0.5).toFixed(3));
      root.style.setProperty("--pointer-y", ((event.clientY / window.innerHeight) - 0.5).toFixed(3));
      cursor.style.left = event.clientX + "px";
      cursor.style.top = event.clientY + "px";
    }, { passive: true });
    document.querySelectorAll(".machine-row, .btn, .text-link").forEach(function (target) {
      target.addEventListener("pointerenter", function () {
        cursorLabel = target.classList.contains("machine-row") ? "Explorer" : "Suivre";
        cursor.textContent = cursorLabel;
        root.classList.add("cursor-active");
      });
      target.addEventListener("pointerleave", function () { root.classList.remove("cursor-active"); });
    });
    document.querySelectorAll(".machine-row__actions .btn, .hero .btn, .footer-top").forEach(function (target) {
      target.setAttribute("data-magnetic", "");
      target.addEventListener("pointermove", function (event) {
        var r = target.getBoundingClientRect();
        var x = (event.clientX - r.left - r.width / 2) / r.width;
        var y = (event.clientY - r.top - r.height / 2) / r.height;
        target.style.transform = "translate3d(" + (x * 7).toFixed(2) + "px," + (y * 5).toFixed(2) + "px,0)";
      });
      target.addEventListener("pointerleave", function () { target.style.transform = ""; });
    });
  }

  /* ── Mobile nav ── */
  var toggle = document.querySelector("[data-nav-toggle]");
  var panel = document.querySelector("[data-nav-mobile]");
  var closeBtns = document.querySelectorAll("[data-nav-close]");

  function setNav(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    panel.inert = !open;
    document.body.classList.toggle("nav-open", open);
    if (open) {
      var first = panel.querySelector("a, button");
      if (first) first.focus();
    } else {
      toggle.focus();
    }
  }

  if (toggle && panel) {
    panel.setAttribute("aria-hidden", "true");
    panel.inert = true;
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    closeBtns.forEach(function (btn) {
      btn.addEventListener("click", function () { setNav(false); });
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setNav(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        return;
      }
      if (e.key === "Tab" && toggle.getAttribute("aria-expanded") === "true") {
        var focusables = Array.prototype.slice.call(panel.querySelectorAll('a[href], button:not([disabled])')).filter(function (el) { return !el.hidden; });
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ── Scroll reveal ── */
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    document.querySelectorAll("[data-reveal], [data-stagger]").forEach(function (el, idx) {
      if (el.hasAttribute("data-stagger")) {
        Array.prototype.forEach.call(el.children, function (child, i) {
          child.style.setProperty("--i", String(i));
        });
      }
      io.observe(el);
    });
  } else {
    document.querySelectorAll("[data-reveal], [data-stagger]").forEach(function (el) {
      el.classList.add("is-inview");
    });
  }

  /* Footer enters as a scene, not a static end-cap. Its base state stays readable. */
  var footer = document.querySelector(".site-footer");
  if (!reduce && footer && "IntersectionObserver" in window) {
    var footerIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          footer.classList.add("is-footer-inview");
          footerIO.unobserve(footer);
        }
      });
    }, { threshold: 0.14 });
    footerIO.observe(footer);
  }

  /* ── Footer top ── */
  var topBtn = document.querySelector("[data-to-top]");
  if (topBtn) {
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* Commit the enhanced visual state only after navigation, reveals and footer
     observers are wired. If an earlier runtime failure occurs, CSS keeps the
     compact no-script navigation and every content block in its resting state. */
  root.classList.add("js-ready");

  /* ── Prefill machine from query ── */
  var params = new URLSearchParams(window.location.search);
  var machineParam = params.get("machine");
  var machineSelect = document.querySelector("#machine");
  if (machineSelect && machineParam) {
    var map = {
      "puzzi-8-1": "Kärcher Puzzi 8/1",
      "puzzi-9-1": "Kärcher Puzzi 9/1 Bp",
      "sg-4-4": "Kärcher SG 4/4 (sous réserve de plaque)",
      "hd-5-17-cx-plus": "Kärcher HD 5/17 CX Plus (sous réserve de plaque)"
    };
    var val = map[machineParam] || machineParam;
    Array.prototype.forEach.call(machineSelect.options, function (opt) {
      if (opt.value === val || opt.value.indexOf(machineParam) !== -1) {
        machineSelect.value = opt.value;
      }
    });
    if (!machineSelect.value && map[machineParam]) {
      machineSelect.value = map[machineParam];
    }
  }

  /* ── Availability form ── */
  var form = document.querySelector("[data-demande-form]");
  if (!form) return;

  var statusEl = form.querySelector("[data-form-status]");
  var rawEl = document.querySelector("[data-raw-preview]");
  var copyBtn = form.querySelector("[data-copy]");
  var shareBtn = form.querySelector("[data-share]");
  var showRawBtn = form.querySelector("[data-show-raw]");
  var jsOnlyNote = form.querySelector("[data-form-js-note]");

  function setStatus(msg, tone) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.dataset.tone = tone || "";
  }

  function fieldValue(name) {
    var el = form.elements.namedItem(name);
    if (!el) return "";
    if (el instanceof RadioNodeList) {
      return el.value || "";
    }
    return (el.value || "").trim();
  }

  function validate() {
    var ok = true;
    var required = ["nom", "contact", "machine", "debut", "fin", "remise"];
    required.forEach(function (name) {
      var el = form.elements.namedItem(name);
      var wrap = el && el.closest ? el.closest(".field") : null;
      if (!wrap && el && el[0]) wrap = el[0].closest(".field");
      var val = fieldValue(name);
      var invalid = !val;

      if (wrap) wrap.classList.toggle("is-invalid", invalid);
      if (invalid) ok = false;
    });
    var debut = fieldValue("debut");
    var fin = fieldValue("fin");
    if (debut && fin && fin < debut) {
      var finField = form.elements.namedItem("fin");
      if (finField && finField.closest) finField.closest(".field").classList.add("is-invalid");
      ok = false;
      setStatus("La date de fin doit être postérieure ou égale à la date de début.", "err");
    }
    return ok;
  }

  function buildMessage() {
    return [
      "Demande préparée — Location Lausanne",
      "(Préversion site : message préparé par le visiteur, non transmis automatiquement)",
      "",
      "Nom : " + fieldValue("nom"),
      "Téléphone ou e-mail : " + fieldValue("contact"),
      "Machine : " + fieldValue("machine"),
      "Date début : " + fieldValue("debut"),
      "Date fin : " + fieldValue("fin"),
      "Remise : " + fieldValue("remise"),
      "Message : " + (fieldValue("message") || "—"),
      "",
      "—",
      "Je souhaite vérifier la disponibilité et les conditions (caution 100 CHF, Twint ou espèces, Lausanne sur rendez-vous)."
    ].join("\n");
  }

  function refreshRaw() {
    if (!rawEl) return;
    rawEl.textContent = buildMessage();
  }

  form.addEventListener("input", function () {
    setStatus("");
  });

  function copyPreparedRequest() {
    if (!validate()) {
      setStatus("Complétez les champs requis avant de copier.", "err");
      return;
    }
    var text = buildMessage();
    refreshRaw();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        setStatus(
          "Demande copiée. Collez-la dans l’app de votre choix pour nous contacter lorsque le canal public sera indiqué, ou conservez-la pour l’échange convenu.",
          "ok"
        );
      }).catch(function () {
        if (rawEl) {
          rawEl.classList.add("is-open");
          setStatus("Copie automatique indisponible — sélectionnez le texte ci-dessous.", "err");
        }
      });
    } else if (rawEl) {
      rawEl.classList.add("is-open");
      setStatus("Copie automatique indisponible — sélectionnez le texte ci-dessous.", "err");
    }
  }

  if (shareBtn) {
    if (!navigator.share) {
      shareBtn.hidden = true;
    } else {
      shareBtn.addEventListener("click", function () {
        if (!validate()) {
          setStatus("Complétez les champs requis avant de partager.", "err");
          return;
        }
        var text = buildMessage();
        navigator.share({
          title: "Demande préparée — Location Lausanne",
          text: text
        }).then(function () {
          setStatus("Feuille de partage ouverte. Aucune donnée n’a été envoyée par ce site.", "ok");
        }).catch(function () {
          /* user cancelled */
        });
      });
      shareBtn.disabled = false;
    }
  }

  if (showRawBtn && rawEl) {
    showRawBtn.addEventListener("click", function () {
      refreshRaw();
      rawEl.classList.toggle("is-open");
      showRawBtn.setAttribute(
        "aria-expanded",
        rawEl.classList.contains("is-open") ? "true" : "false"
      );
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    copyPreparedRequest();
  });

  /* Buttons begin disabled in the HTML. Enable only after every local handler
     has been installed, so a failed or disabled script cannot turn this into a GET form. */
  if (copyBtn) copyBtn.disabled = false;
  if (showRawBtn) showRawBtn.disabled = false;
  if (jsOnlyNote) jsOnlyNote.hidden = true;
})();
