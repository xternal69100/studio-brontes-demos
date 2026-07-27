/* main.js — open hours Europe/Zurich + reveals (repos = visible) */
(function () {
  "use strict";

  var TZ = "Europe/Zurich";

  /* Weekly hours: [openMin, closeMin] from midnight; null = closed */
  var WEEK = {
    1: [6 * 60, 19 * 60], /* Mon */
    2: [6 * 60, 19 * 60],
    3: [6 * 60, 19 * 60],
    4: [6 * 60, 19 * 60],
    5: [6 * 60, 19 * 60],
    6: [6 * 60, 18 * 60], /* Sat */
    0: null /* Sun */
  };
  var DAY_FR = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

  function partsInZurich(date) {
    var fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ,
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    });
    var map = {};
    fmt.formatToParts(date).forEach(function (p) {
      if (p.type !== "literal") map[p.type] = p.value;
    });
    var wdMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return {
      day: wdMap[map.weekday],
      hour: parseInt(map.hour, 10),
      minute: parseInt(map.minute, 10),
      y: parseInt(map.year, 10),
      m: parseInt(map.month, 10),
      d: parseInt(map.day, 10)
    };
  }

  function fmtHour(mins) {
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    return m ? h + " h " + String(m).padStart(2, "0") : h + " h";
  }

  function computeStatus(now) {
    var p = partsInZurich(now || new Date());
    var mins = p.hour * 60 + p.minute;
    var slot = WEEK[p.day];
    if (slot && mins >= slot[0] && mins < slot[1]) {
      return {
        state: "open",
        short: "Ouvert",
        long: "Selon les horaires habituels : ouvert jusqu’à " + fmtHour(slot[1])
      };
    }
    /* next opening */
    for (var i = 0; i < 8; i++) {
      var day = (p.day + i) % 7;
      var s = WEEK[day];
      if (!s) continue;
      if (i === 0 && mins < s[0]) {
        return {
          state: "closed",
          short: "Fermé",
          long: "Selon les horaires habituels : fermé · prochaine ouverture aujourd’hui, " + fmtHour(s[0])
        };
      }
      if (i > 0) {
        return {
          state: "closed",
          short: "Fermé",
          long: "Selon les horaires habituels : fermé · prochaine ouverture " + DAY_FR[day] + ", " + fmtHour(s[0])
        };
      }
    }
    return {
      state: "closed",
      short: "Fermé",
      long: "Selon les horaires habituels : fermé"
    };
  }

  function applyStatus() {
    var st = computeStatus(new Date());
    document.querySelectorAll("[data-open-status]").forEach(function (el) {
      el.setAttribute("data-state", st.state);
      var short = el.querySelector(".status-short");
      var long = el.querySelector(".status-long");
      var full = el.querySelector(".status-full");
      if (short) short.textContent = st.short;
      if (long) long.textContent = st.long;
      if (full) full.textContent = st.long;
      el.setAttribute("aria-label", st.long + ". Vérifier les jours fériés.");
    });
  }

  function nextBoundaryMs() {
    var p = partsInZurich(new Date());
    var mins = p.hour * 60 + p.minute;
    var candidates = [];
    for (var i = 0; i < 8; i++) {
      var day = (p.day + i) % 7;
      var s = WEEK[day];
      if (!s) continue;
      [s[0], s[1]].forEach(function (boundary) {
        var deltaDays = i;
        var deltaMins = deltaDays * 24 * 60 + boundary - mins;
        if (deltaMins <= 0) return;
        candidates.push(deltaMins);
      });
    }
    candidates.sort(function (a, b) { return a - b; });
    var m = candidates[0] || 60;
    return m * 60 * 1000 + 500;
  }

  function scheduleRefresh() {
    applyStatus();
    var t = nextBoundaryMs();
    if (t > 6 * 60 * 60 * 1000) t = 60 * 60 * 1000;
    setTimeout(scheduleRefresh, t);
  }

  /* Mobile nav */
  function setupNav() {
    var toggle = document.querySelector(".nav-toggle");
    var drawer = document.querySelector(".nav-drawer");
    if (!toggle || !drawer) return;
    function close() {
      toggle.setAttribute("aria-expanded", "false");
      drawer.classList.remove("is-open");
      document.body.classList.remove("is-nav-open");
    }
    function open() {
      toggle.setAttribute("aria-expanded", "true");
      drawer.classList.add("is-open");
      document.body.classList.add("is-nav-open");
      var first = drawer.querySelector("a");
      if (first) first.focus();
    }
    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") close();
      else open();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
  }

  /* Scroll reveals — enhancement only, never hide base content */
  function setupReveals() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var nodes = document.querySelectorAll(".reveal, .reveal-media, .ferment-bar, .hero-media");
    if (reduce) {
      nodes.forEach(function (n) {
        n.classList.add("is-inview", "is-animated");
      });
      return;
    }
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) {
        n.classList.add("is-inview", "is-animated");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            if (entry.target.classList.contains("hero-media")) {
              entry.target.classList.add("is-animated");
            }
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach(function (n) { io.observe(n); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    scheduleRefresh();
    setupNav();
    setupReveals();
  });
})();
