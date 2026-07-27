/*! Suan Nai — nav + motion + form simulation · vanilla · PE-safe · no network */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* Force image decode so first paint / QA scroll sees pixels */
  try {
    var imgs = document.images;
    for (var ii = 0; ii < imgs.length; ii++) {
      if (imgs[ii].decode) imgs[ii].decode().catch(function () {});
    }
  } catch (e) {}


  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Mobile nav: close on link ── */
  var mobile = document.querySelector(".nav-mobile");
  if (mobile) {
    mobile.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("a");
      if (a && mobile.open) mobile.open = false;
    });
  }

  /* ── Hero ready ── */
  var hero = document.querySelector(".hero");
  if (hero) {
    if (reduce) {
      hero.classList.add("is-ready");
    } else {
      requestAnimationFrame(function () {
        hero.classList.add("is-ready");
      });
    }
  }

  function showAll() {
    var all = document.querySelectorAll(".cascade, .clairiere-photo, [data-motion], .rule");
    for (var i = 0; i < all.length; i++) all[i].classList.add("is-in");
    runCounts(true);
  }

  function runCounts(instant) {
    var counters = document.querySelectorAll("[data-count]");
    for (var c = 0; c < counters.length; c++) {
      (function (el) {
        if (el.dataset.counted) return;
        el.dataset.counted = "1";
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        if (instant || reduce) {
          el.textContent = String(target) + suffix;
          return;
        }
        var start = performance.now();
        var dur = 900;
        function tick(now) {
          var t = Math.min(1, (now - start) / dur);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = String(Math.round(target * eased)) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      })(counters[c]);
    }
  }

  if (reduce || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        for (var n = 0; n < entries.length; n++) {
          var e = entries[n];
          if (!e.isIntersecting) continue;
          var t = e.target;
          t.classList.add("is-in");
          if (t.querySelector && t.querySelector("[data-count]")) runCounts(false);
          if (t.hasAttribute("data-count")) runCounts(false);
          io.unobserve(t);
        }
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    var observeList = document.querySelectorAll(".cascade, .clairiere-photo, [data-motion]");
    for (var i = 0; i < observeList.length; i++) io.observe(observeList[i]);
  }

  /* ── Reservation form — 100% local simulation ── */
  var form = document.getElementById("resa-form");
  var confirmEl = document.getElementById("resa-confirm");
  if (!form) return;

  var noscript = form.querySelector(".form-noscript");
  if (noscript) noscript.hidden = true;

  var durationBySoin = {
    parcours: ["2 h 30"],
    nuad: ["60 min", "90 min", "120 min"],
    huiles: ["60 min", "90 min"],
    pochons: ["90 min"],
    dos: ["45 min"],
    pieds: ["45 min", "60 min"],
    duo: ["60 min", "90 min"],
    sport: ["90 min"],
    clairiere: ["1 h"]
  };

  var soinSelect = form.querySelector("#soin");
  var dureeSelect = form.querySelector("#duree");
  var dureeGroup = form.querySelector('[data-group="duree"]');

  function fillDurees() {
    if (!soinSelect || !dureeSelect) return;
    var key = soinSelect.value || "parcours";
    var opts = durationBySoin[key] || ["—"];
    dureeSelect.innerHTML = "";
    for (var d = 0; d < opts.length; d++) {
      var o = document.createElement("option");
      o.value = opts[d];
      o.textContent = opts[d];
      dureeSelect.appendChild(o);
    }
    if (opts.length <= 1 && dureeGroup) {
      dureeSelect.setAttribute("aria-readonly", "true");
    } else if (dureeSelect) {
      dureeSelect.removeAttribute("aria-readonly");
    }
  }
  if (soinSelect) {
    soinSelect.addEventListener("change", fillDurees);
    fillDurees();
  }

  function clearErrors() {
    var groups = form.querySelectorAll(".form-group");
    for (var g = 0; g < groups.length; g++) {
      groups[g].classList.remove("is-invalid");
      var inp = groups[g].querySelector("input, select, textarea");
      if (inp) inp.removeAttribute("aria-invalid");
    }
  }

  function invalidate(id, msg) {
    var field = form.querySelector("#" + id);
    if (!field) return;
    var group = field.closest(".form-group");
    if (!group) return;
    group.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");
    var err = group.querySelector(".error");
    if (err && msg) err.textContent = msg;
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    clearErrors();

    var firstBad = null;
    var required = ["soin", "duree", "date", "creneau", "prenom", "telephone"];
    for (var r = 0; r < required.length; r++) {
      var el = form.querySelector("#" + required[r]);
      if (!el) continue;
      var val = (el.value || "").trim();
      if (!val) {
        invalidate(required[r], "Ce champ est obligatoire.");
        if (!firstBad) firstBad = el;
      }
    }

    var tel = form.querySelector("#telephone");
    if (tel && tel.value.trim() && tel.value.trim().length < 6) {
      invalidate("telephone", "Indiquez un numéro illustratif d’au moins 6 caractères.");
      if (!firstBad) firstBad = tel;
    }

    if (firstBad) {
      firstBad.focus();
      return;
    }

    /* Zero network, zero storage */
    form.classList.add("is-hidden");
    form.setAttribute("aria-hidden", "true");
    if (confirmEl) {
      confirmEl.classList.add("is-visible");
      confirmEl.setAttribute("tabindex", "-1");
      confirmEl.focus();
      if (confirmEl.scrollIntoView) {
        confirmEl.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    }
  });
})();
