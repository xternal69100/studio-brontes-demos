/**
 * Catalogue Brontès — enhancement only.
 * Content and all 7 links work with JS disabled.
 * Marks document when motion may run; honors prefers-reduced-motion.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = false;

  try {
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {
    reduce = false;
  }

  root.classList.add("js");
  if (reduce) {
    root.classList.add("rm");
  } else {
    root.classList.add("motion-ok");
  }

  /* After first paint window, freeze any leftover WAAPI if reduced flips mid-session */
  if (reduce && typeof document.getAnimations === "function") {
    window.setTimeout(function () {
      document.getAnimations().forEach(function (a) {
        try {
          a.cancel();
        } catch (err) {
          /* ignore */
        }
      });
    }, 50);
  }
})();
