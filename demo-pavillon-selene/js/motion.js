/*! Pavillon Séléné — motion V2 · vanilla · single IO · PE-safe · no third-party */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nodes = document.querySelectorAll("[data-motion], .reveal, .oeuvre-grid, .salles-grid, .rule-draw, .marquee");
  var sections = ["parcours", "oeuvres", "commissariat", "infos"];
  var links = document.querySelectorAll('.nav-desktop a[href^="#"]');
  var map = {};
  var i;

  for (i = 0; i < links.length; i++) {
    map[links[i].getAttribute("href").slice(1)] = links[i];
  }

  function showAll() {
    var all = document.querySelectorAll(".reveal, .oeuvre-grid, .salles-grid, .rule-draw, [data-motion], .oeuvre, .salle");
    for (i = 0; i < all.length; i++) all[i].classList.add("is-in");
    runCounts(true);
  }

  function setCurrent(id) {
    for (i = 0; i < sections.length; i++) {
      var L = map[sections[i]];
      if (!L) continue;
      if (sections[i] === id) L.setAttribute("aria-current", "true");
      else L.removeAttribute("aria-current");
    }
  }

  var mobile = document.querySelector(".nav-mobile");
  if (mobile) {
    mobile.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("a");
      if (a && mobile.open) mobile.open = false;
    });
  }

  /* Hero ready: kick wipe + line-stagger immediately (no IO) */
  var hero = document.querySelector(".hero");
  if (hero && !reduce) {
    requestAnimationFrame(function () {
      hero.classList.add("is-ready");
    });
  } else if (hero) {
    hero.classList.add("is-ready");
  }

  function runCounts(instant) {
    var counters = document.querySelectorAll("[data-count]");
    for (var c = 0; c < counters.length; c++) {
      (function (el) {
        if (el.dataset.counted) return;
        el.dataset.counted = "1";
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        if (instant || reduce) {
          el.textContent = String(target);
          return;
        }
        var start = performance.now();
        var dur = 800;
        function tick(now) {
          var t = Math.min(1, (now - start) / dur);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = String(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      })(counters[c]);
    }
  }

  if (reduce || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      for (var n = 0; n < entries.length; n++) {
        var e = entries[n];
        var t = e.target;
        if (!e.isIntersecting) continue;

        if (
          t.classList.contains("reveal") ||
          t.classList.contains("oeuvre-grid") ||
          t.classList.contains("salles-grid") ||
          t.classList.contains("rule-draw") ||
          t.classList.contains("proof-strip") ||
          t.hasAttribute("data-motion")
        ) {
          t.classList.add("is-in");
          var nested = t.querySelectorAll(".rule-draw, .oeuvre, .salle");
          for (var k = 0; k < nested.length; k++) nested[k].classList.add("is-in");
          if (t.querySelector && t.querySelector("[data-count]")) runCounts(false);
          if (t.hasAttribute("data-count")) runCounts(false);
          io.unobserve(t);
          continue;
        }

        if (t.id) setCurrent(t.id);
      }
    },
    { root: null, rootMargin: "-10% 0px -20% 0px", threshold: [0, 0.12, 0.25] }
  );

  var observeList = document.querySelectorAll(
    ".reveal, .oeuvre-grid, .salles-grid, .rule-draw, [data-motion], .proof-strip"
  );
  for (i = 0; i < observeList.length; i++) io.observe(observeList[i]);
  for (i = 0; i < sections.length; i++) {
    var el = document.getElementById(sections[i]);
    if (el) io.observe(el);
  }
})();
