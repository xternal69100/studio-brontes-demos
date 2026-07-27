/* main.js — Location Lausanne
   Progressive enhancement: dual nav, reveal, form copy/share.
   Content remains visible without JS. No opacity:0 base states. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Mobile nav ── */
  var toggle = document.querySelector("[data-nav-toggle]");
  var panel = document.querySelector("[data-nav-mobile]");
  var closeBtns = document.querySelectorAll("[data-nav-close]");

  function setNav(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
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
      if (e.key === "Escape") setNav(false);
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

  /* ── Footer top ── */
  var topBtn = document.querySelector("[data-to-top]");
  if (topBtn) {
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ── Prefill machine from query ── */
  var params = new URLSearchParams(window.location.search);
  var machineParam = params.get("machine");
  var machineSelect = document.querySelector("#machine");
  if (machineSelect && machineParam) {
    var map = {
      "puzzi-8-1": "Kärcher Puzzi 8/1",
      "puzzi-9-1": "Kärcher Puzzi 9/1",
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
    var required = ["prenom", "nom", "telephone", "email", "machine", "debut", "fin", "remise"];
    required.forEach(function (name) {
      var el = form.elements.namedItem(name);
      var wrap = el && el.closest ? el.closest(".field") : null;
      if (!wrap && el && el[0]) wrap = el[0].closest(".field");
      var val = fieldValue(name);
      var invalid = !val;
      if (name === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) invalid = true;
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
      "Demande de disponibilité — Location Lausanne",
      "(Préversion site : message préparé par le visiteur, non transmis automatiquement)",
      "",
      "Prénom : " + fieldValue("prenom"),
      "Nom : " + fieldValue("nom"),
      "Téléphone : " + fieldValue("telephone"),
      "E-mail : " + fieldValue("email"),
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

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
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
    });
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
          title: "Demande de disponibilité — Location Lausanne",
          text: text
        }).then(function () {
          setStatus("Feuille de partage ouverte. Aucune donnée n’a été envoyée par ce site.", "ok");
        }).catch(function () {
          /* user cancelled */
        });
      });
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
    if (copyBtn) copyBtn.click();
  });
})();
