/* Bistrot Sauge V2 — motion minimal auto-hébergé (≤8 KiB)
   - scroll-reveal sections + stagger lignes carte
   - underline nav active via IntersectionObserver + aria-current
   - ferme le menu mobile après activation d'un lien
   - no-op si prefers-reduced-motion
   Contenu visible sans ce script.
*/
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  var mobile = document.querySelector(".nav-mobile");
  var desktopLinks = document.querySelectorAll(".nav-desktop a[href^='#']");
  var sections = ["maison", "carte", "venir", "reserver"].map(function (id) {
    return document.getElementById(id);
  }).filter(Boolean);

  if (mobile) {
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (mobile.open) mobile.open = false;
      });
    });
  }

  function setCurrent(id) {
    desktopLinks.forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href === "#" + id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setCurrent(e.target.id);
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { navIo.observe(s); });
  }

  if (reduce) return;

  root.classList.add("js-motion");

  var targets = document.querySelectorAll(".reveal, .stagger");
  if (!targets.length || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

  targets.forEach(function (el) { io.observe(el); });
})();
