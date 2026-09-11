/* ===================================================================
   Chapter 4 · Describing Motion Around Us — site behaviour
   Works fully offline. No external libraries.
   =================================================================== */
(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------------------------------------------------------- nav */
  function navHeight() {
    var nav = $(".nav");
    if (nav) document.documentElement.style.setProperty("--navh", nav.offsetHeight + "px");
  }

  function openDrop(drop, on) {
    if (!drop) return;
    var willOpen = (typeof on === "boolean") ? on : !drop.classList.contains("open");
    drop.classList.toggle("open", willOpen);
    var mb = $(".menu-btn", drop.parentNode || document);
    if (mb) mb.setAttribute("aria-expanded", willOpen ? "true" : "false");
  }

  function closeAll() {
    $$(".drop").forEach(function (d) { openDrop(d, false); });
  }

  document.addEventListener("click", function (e) {
    var mb = e.target.closest ? e.target.closest(".menu-btn") : null;
    if (mb) { e.preventDefault(); openDrop(mb.closest(".drop"), null); return; }

    var ddb = e.target.closest ? e.target.closest(".drop > .dd-btn") : null;
    if (ddb) { e.preventDefault(); openDrop(ddb.parentNode, null); return; }

    var link = e.target.closest ? e.target.closest(".drop-panel a") : null;
    if (link) { closeAll(); return; }

    if (!(e.target.closest && e.target.closest(".drop"))) closeAll();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAll();
  });

  window.addEventListener("resize", function () {
    navHeight();
    if (window.innerWidth > 980) closeAll();
  });
  window.addEventListener("orientationchange", function () { setTimeout(navHeight, 250); });

  /* --------------------------------------------------- audio player */
  var player = null;
  var current = null;

  function stopBtn(btn) {
    if (!btn) return;
    btn.classList.remove("playing");
    var l = $(".lbl", btn);
    if (l && btn.dataset.idle) l.textContent = btn.dataset.idle;
  }

  function audioSrc(src) {
    if (src.indexOf("audio/") === 0 && location.pathname.indexOf("/topics/") !== -1) return "../" + src;
    return src;
  }

  function play(btn) {
    var src = btn.getAttribute("data-src");
    if (!src) return;
    src = audioSrc(src);
    if (current && current !== btn) { try { player.pause(); } catch (e) {} stopBtn(current); }

    if (!player) {
      player = document.createElement("audio");
      player.style.display = "none";
      document.body.appendChild(player);
    }
    if (btn.dataset.idle === undefined) btn.dataset.idle = ($(".lbl", btn) || {}).textContent || "▶ Listen";

    if (current === btn && !player.paused) {
      player.pause();
      stopBtn(btn);
      current = null;
      return;
    }
    if (player.getAttribute("src") !== src) {
      player.setAttribute("src", src);
      player.currentTime = 0;
    }
    var rate = parseFloat(document.body.dataset.rate || "1");
    player.playbackRate = rate;

    var l = $(".lbl", btn);
    player.onended = function () { stopBtn(btn); current = null; };
    player.onerror = function () {
      stopBtn(btn); current = null;
      nativeFallback(btn, src);
    };
    var p = player.play();
    if (p && p.catch) p.catch(function () { stopBtn(btn); current = null; nativeFallback(btn, src); });
    btn.classList.add("playing");
    if (l) l.textContent = "❚❚ Playing";
    current = btn;
  }

  /* if scripted playback fails on a device, drop in a native audio control */
  function nativeFallback(btn, src) {
    if (btn.dataset.fb) return;
    btn.dataset.fb = "1";
    var el = document.createElement("audio");
    el.controls = true;
    el.preload = "auto";
    el.setAttribute("src", src);
    el.className = "aud-native";
    (btn.parentNode || document.body).insertBefore(el, btn.nextSibling);
    var p = el.play();
    if (p && p.catch) p.catch(function () {});
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".aud-btn, .aud-big") : null;
    if (!btn) return;
    if (btn.classList.contains("unavail")) return;
    play(btn);
  });

  /* listen again when a lesson-audio block is re-used */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && player && !player.paused) { player.pause(); stopBtn(current); current = null; }
  });

  /* ------------------------------------------------- speed control */
  $$(".spd button").forEach(function (b) {
    b.addEventListener("click", function () {
      var rate = b.getAttribute("data-rate") || "1";
      document.body.dataset.rate = rate;
      $$(".spd button").forEach(function (x) { x.classList.toggle("on", x === b); });
      if (player) player.playbackRate = parseFloat(rate);
    });
  });

  /* ---------------------------------------------------- quiz engine */
  document.addEventListener("click", function (e) {
    var opt = e.target.closest ? e.target.closest(".opt") : null;
    if (opt && !opt.classList.contains("lock")) {
      var box = opt.closest(".mcq");
      var ok = opt.getAttribute("data-ok") === "1";
      $$(".opt", box).forEach(function (o) {
        o.classList.add("lock");
        if (o.getAttribute("data-ok") === "1") o.classList.add("ok");
        else if (o === opt) o.classList.add("no");
      });
      var fb = $(".feedback", box);
      if (fb) {
        var exp = fb.getAttribute("data-exp") || "";
        fb.classList.add("show", ok ? "ok" : "no");
        fb.innerHTML = (ok ? "<b>✔ Correct.</b> " : "<b>Not quite — the correct answer is highlighted.</b> ") + exp;
      }
      return;
    }

    var rst = e.target.closest ? e.target.closest(".quiz-reset") : null;
    if (rst) {
      var target = rst.getAttribute("data-target");
      var scope = target ? $(target) : rst.closest(".card");
      $$(".mcq", scope).forEach(function (box) {
        $$(".opt", box).forEach(function (o) { o.classList.remove("lock", "ok", "no"); });
        var fb = $(".feedback", box);
        if (fb) { fb.classList.remove("show", "ok", "no"); fb.innerHTML = ""; }
      });
      return;
    }
  });

  /* ------------------------------------------------- page progress */
  function progress() {
    var bar = $(".rbar i");
    if (!bar) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 0;
    bar.style.width = p + "%";
  }
  window.addEventListener("scroll", progress, { passive: true });

  document.addEventListener("DOMContentLoaded", function () {
    navHeight();
    progress();
    var a = $(".aud-btn, .lab button, .opt");
    if (a) a.setAttribute("tabindex", a.getAttribute("tabindex") || "0");
  });
  navHeight();
})();
