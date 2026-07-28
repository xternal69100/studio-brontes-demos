/* main.js — Nettoyage Lausanne
   Progressive enhancement: dual nav and preserved motion vocabulary.
   Content remains visible without JS. No opacity:0 base states. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* Page continuity is additive: normal links remain normal with JS off, reduced
     motion, modifier keys, external URLs, downloads and form actions untouched. */
  if (!reduce) {
    var pageTransition = document.createElement("div");
    pageTransition.className = "v3-page-transition" + (window.location.hash ? "" : " is-entering");
    pageTransition.setAttribute("aria-hidden", "true");
    pageTransition.innerHTML = '<span class="v3-page-transition__mark">Nettoyage<br>Lausanne</span><span class="v3-page-transition__line"></span>';
    document.body.appendChild(pageTransition);
    if (!window.location.hash) {
      window.setTimeout(function () { pageTransition.classList.remove("is-entering"); }, 760);
    }

    document.addEventListener("click", function (event) {
      var link = event.target.closest && event.target.closest("a[href]");
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute("download")) return;
      var url;
      try { url = new URL(link.href, window.location.href); } catch (_) { return; }
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname || !/\.html$/i.test(url.pathname)) return;
      event.preventDefault();
      pageTransition.classList.add("is-leaving");
      window.setTimeout(function () { window.location.assign(url.href); }, 700);
    });
  }

  /* ── V2 Monopo motion layer: additive, native scroll is never replaced. ── */
  var progress = document.createElement("div");
  progress.className = "v2-progress";
  progress.setAttribute("aria-hidden", "true");
  progress.innerHTML = '<span class="v2-progress__fill"></span>';
  document.body.appendChild(progress);
  var scrollLabel = document.createElement("div");
  scrollLabel.className = "v2-scroll-label";
  scrollLabel.setAttribute("aria-hidden", "true");
  scrollLabel.textContent = "00 / 100";
  document.body.appendChild(scrollLabel);

  if (!reduce && document.querySelector(".hero") && !window.location.hash) {
    var intro = document.createElement("div");
    intro.className = "v2-intro";
    /* Inline first paint prevents a white flash while the CSS animation layer resolves. */
    intro.style.cssText = "position:fixed;inset:0;z-index:100;pointer-events:none;overflow:hidden;color:#fff;background:#030303";
    intro.setAttribute("aria-hidden", "true");
    intro.innerHTML = '<span class="v2-intro__index">01 — LAUSANNE</span><span class="v2-intro__word"><i>Nettoyage</i><b>Lausanne</b></span><span class="v2-intro__phrase">Le bon geste<br>pour chaque surface.</span><span class="v2-intro__rule"></span>';
    document.body.appendChild(intro);
    root.classList.add("intro-playing");
    window.setTimeout(function () {
      root.classList.remove("intro-playing");
      intro.remove();
    }, 1480);
  }

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
    scrollLabel.textContent = String(Math.round(p * 100)).padStart(2, "0") + " / 100";
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
      var first = panel.querySelector("[data-nav-close]") || panel.querySelector("a, button");
      if (first) {
        first.focus();
        window.requestAnimationFrame(function () { first.focus(); });
        window.setTimeout(function () { first.focus(); }, 50);
      }
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

  /* A native hash jump can run before fonts and the final page height settle.
     Reveal the destination first, then align it again once layout is stable. */
  function alignHashTarget() {
    if (!window.location.hash) return;
    var id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch (_) { return; }
    var target = document.getElementById(id);
    if (!target) return;
    if (target.matches("[data-reveal], [data-stagger]")) target.classList.add("is-inview");
    target.querySelectorAll("[data-reveal], [data-stagger]").forEach(function (el) {
      el.classList.add("is-inview");
    });
    function jumpToTarget() {
      /* Cancel any native smooth hash animation and set the final coordinate
         synchronously; repeat on the next frame and after load for font shifts. */
      var previousBehavior = root.style.scrollBehavior;
      var banner = document.querySelector(".preversion");
      var offset = (banner ? banner.getBoundingClientRect().height : 0) + 16;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset));
      window.requestAnimationFrame(function () {
        root.style.scrollBehavior = previousBehavior;
      });
    }
    jumpToTarget();
    window.requestAnimationFrame(jumpToTarget);
  }
  if (window.location.hash) {
    alignHashTarget();
    if (document.readyState !== "complete") {
      window.addEventListener("load", alignHashTarget, { once: true });
    }
  }
  window.addEventListener("hashchange", alignHashTarget);

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

})();

/* --banner-h : hauteur réelle du bandeau de préversion.
   Le hero vaut un écran plein mais démarre SOUS ce bandeau ; sans cette mesure il dépasse le
   premier écran d'autant (99 px à 390 px de large, où le bandeau tient sur 4 lignes) et pousse
   le badge « scroll down » hors champ. Sans JS la variable reste à 0 : le hero fait alors
   100svh comme avant, ce qui reste lisible. */
(function () {
  var banner = document.querySelector(".preversion");
  if (!banner) return;
  var poser = function () {
    document.documentElement.style.setProperty(
      "--banner-h",
      Math.round(banner.getBoundingClientRect().height) + "px"
    );
  };
  poser();
  window.addEventListener("resize", poser, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(poser);
})();
