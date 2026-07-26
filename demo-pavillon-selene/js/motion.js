/*! Pavillon Séléné — motion · vanilla · single IO · no third-party */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealSel = ".reveal, .oeuvre-grid, .salles-grid";
  var nodes = document.querySelectorAll(revealSel);
  var sections = ["parcours", "oeuvres", "commissariat", "infos"];
  var links = document.querySelectorAll('.nav-desktop a[href^="#"]');
  var map = {};
  var i;

  for (i = 0; i < links.length; i++) {
    map[links[i].getAttribute("href").slice(1)] = links[i];
  }

  function showAll() {
    for (i = 0; i < nodes.length; i++) nodes[i].classList.add("is-in");
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

  /* No JS hide: content stays visible. is-in only triggers CSS entrance. */
  if (reduce || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      for (var n = 0; n < entries.length; n++) {
        var e = entries[n];
        var t = e.target;
        var isReveal =
          t.classList.contains("reveal") ||
          t.classList.contains("oeuvre-grid") ||
          t.classList.contains("salles-grid");

        if (isReveal) {
          if (e.isIntersecting) {
            t.classList.add("is-in");
            io.unobserve(t);
          }
          continue;
        }

        /* Section spy for desktop nav aria-current */
        if (e.isIntersecting && t.id) setCurrent(t.id);
      }
    },
    { root: null, rootMargin: "-12% 0px -35% 0px", threshold: [0, 0.08, 0.2] }
  );

  for (i = 0; i < nodes.length; i++) io.observe(nodes[i]);
  for (i = 0; i < sections.length; i++) {
    var el = document.getElementById(sections[i]);
    if (el) io.observe(el);
  }
})();
