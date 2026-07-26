/*! Atelier Nord — motion V2 · vanilla IO · ≤8 KiB · no third-party */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nodes = document.querySelectorAll(".reveal, .project-grid, .method-grid, .service-list");

  function showAll() {
    for (var i = 0; i < nodes.length; i++) nodes[i].classList.add("is-in");
  }

  if (reduce || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.1 }
    );
    for (var j = 0; j < nodes.length; j++) io.observe(nodes[j]);
  }

  /* Close mobile menu after activation; keep without-JS usable */
  var mobile = document.querySelector(".nav-mobile");
  if (mobile) {
    mobile.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("a");
      if (a && mobile.open) mobile.open = false;
    });
  }

  /* Optional aria-current on nav anchors while scrolling (non-essential) */
  var sections = ["projets", "methode", "atelier", "contact"];
  var links = document.querySelectorAll('.nav-desktop a[href^="#"]');
  if (links.length && "IntersectionObserver" in window && !reduce) {
    var map = {};
    for (var k = 0; k < links.length; k++) {
      var id = links[k].getAttribute("href").slice(1);
      map[id] = links[k];
    }
    var sio = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var en = entries[i];
          if (!en.isIntersecting) continue;
          var id2 = en.target.id;
          for (var m = 0; m < sections.length; m++) {
            var L = map[sections[m]];
            if (!L) continue;
            if (sections[m] === id2) L.setAttribute("aria-current", "true");
            else L.removeAttribute("aria-current");
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    for (var n = 0; n < sections.length; n++) {
      var el = document.getElementById(sections[n]);
      if (el) sio.observe(el);
    }
  }
})();
