/* ===================================================================
   Chapter 4 · interactive labs (offline, vanilla JS + SVG)
   =================================================================== */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function f(x, n) { return Number(x).toFixed(n === undefined ? 2 : n); }

  var DEMOS = {};

  /* -------------------------------------------- 1 · reference point */
  DEMOS.reference = function (root) {
    var pos = 0, out = $(".out", root), stage = $(".stage", root);
    stage.innerHTML =
      '<svg viewBox="0 0 640 110" role="img" aria-label="Position on a straight line">' +
      '<line x1="40" y1="72" x2="600" y2="72" stroke="#7fd3ff" stroke-width="2"/>' +
      '<g id="tick"></g>' +
      '<circle cx="320" cy="72" r="7" fill="#f59e0b" stroke="#fff" stroke-width="2"/>' +
      '<text x="320" y="52" fill="#f8fafc" font-size="12" text-anchor="middle">O (reference point)</text>' +
      '<g id="obj"><circle r="11" fill="#38bdf8" stroke="#fff" stroke-width="2"/>' +
      '<text y="-16" fill="#e5eefb" font-size="12" text-anchor="middle">object</text></g>' +
      '</svg>';
    var g = $("#tick", stage);
    [-240, -160, -80, 0, 80, 160, 240].forEach(function (v) {
      var x = 320 + v;
      g.insertAdjacentHTML("beforeend",
        '<line x1="' + x + '" y1="66" x2="' + x + '" y2="78" stroke="#7fd3ff"/>' +
        '<text x="' + x + '" y="94" fill="#a8c2e0" font-size="10" text-anchor="middle">' + v +
        (v === 0 ? "" : "") + "</text>");
    });
    function draw() {
      var o = $("#obj", stage);
      o.setAttribute("transform", "translate(" + (320 + pos) + ",72)");
      out.innerHTML = "Position of the object = <b>" + (pos > 0 ? "+" : "") + pos +
        " m</b> from the reference point O. Direction: <b>" +
        (pos > 0 ? "to the right (positive)" : pos < 0 ? "to the left (negative)" : "at the reference point") +
        "</b>. Distance from O = <b>" + Math.abs(pos) + " m</b>.";
    }
    $(".ctrls", root).innerHTML =
      '<button data-go="-160">◀◀ 160 m left</button><button data-go="-80">◀ 80 m left</button>' +
      '<button data-go="0">O</button><button data-go="80">80 m right ▶</button>' +
      '<button data-go="160">160 m right ▶▶</button>';
    $$(".ctrls button", root).forEach(function (b) {
      b.addEventListener("click", function () { pos = parseInt(b.dataset.go, 10); draw(); });
    });
    draw();
  };

  /* ------------------------------------ 2 · distance vs displacement */
  DEMOS.distdisp = function (root) {
    var out = $(".out", root), stage = $(".stage", root);
    var marks = [0, 40, 100, 40];            /* O → B → A → back to B */
    var times = [0, 4, 10, 16];
    stage.innerHTML =
      '<svg viewBox="0 0 640 120" role="img" aria-label="Athlete on a straight track">' +
      '<line x1="40" y1="70" x2="600" y2="70" stroke="#7fd3ff" stroke-width="2"/>' +
      [0, 20, 40, 60, 80, 100].map(function (v) {
        var x = 40 + v * 5.2;
        return '<line x1="' + x + '" y1="64" x2="' + x + '" y2="76" stroke="#7fd3ff"/>' +
          '<text x="' + x + '" y="92" fill="#a8c2e0" font-size="10" text-anchor="middle">' + v + " m</text>";
      }).join("") +
      '<rect x="40" y="66" width="260" height="8" fill="rgba(56,189,248,.28)"/>' +
      '<g id="who"><circle r="12" fill="#f59e0b" stroke="#fff" stroke-width="2"/>' +
      '<text y="-16" fill="#e5eefb" font-size="12" text-anchor="middle">athlete</text></g>' +
      '<text x="40" y="46" fill="#7fd3ff" font-size="11">O start</text>' +
      '<text x="248" y="46" fill="#7fd3ff" font-size="11">B 40 m</text>' +
      '<text x="560" y="46" fill="#7fd3ff" font-size="11">A 100 m</text>' +
      '</svg>';
    var i = 0;
    function draw() {
      var p = marks[i];
      $("#who", stage).setAttribute("transform", "translate(" + (40 + p * 5.2) + ",70)");
      var dist = 0;
      for (var k = 1; k <= i; k++) dist += Math.abs(marks[k] - marks[k - 1]);
      out.innerHTML = "At t = <b>" + times[i] + " s</b> the athlete is <b>" + p + " m</b> from O. " +
        "Total distance travelled = <b>" + dist + " m</b> &nbsp;|&nbsp; Displacement = <b>" +
        (p - 0) + " m</b> in the positive direction.";
    }
    $(".ctrls", root).innerHTML = '<button data-step="1">▶ Next position</button><button data-reset="1">↺ Restart</button>';
    $$(".ctrls button", root).forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.dataset.reset) { i = 0; } else { i = (i + 1) % marks.length; }
        draw();
      });
    });
    draw();
  };

  /* ------------------------------------------------- 3 · average speed */
  DEMOS.speed = function (root) {
    var out = $(".out", root), stage = $(".stage", root);
    stage.innerHTML =
      '<svg viewBox="0 0 640 150" role="img" aria-label="Three vehicles on a road">' +
      '<line x1="30" y1="120" x2="610" y2="120" stroke="#7fd3ff" stroke-width="2"/>' +
      [0, 50, 100, 150, 200, 250, 300].map(function () { return ""; }).join("") +
      [0, 60, 120, 180, 240, 300].map(function (v) {
        var x = 30 + v * 1.9;
        return '<line x1="' + x + '" y1="114" x2="' + x + '" y2="126" stroke="#7fd3ff"/>' +
          '<text x="' + x + '" y="142" fill="#a8c2e0" font-size="10" text-anchor="middle">' + v + " m</text>";
      }).join("") +
      '<g id="c1"><text x="0" y="30" font-size="18">🚗</text></g>' +
      '<g id="c2"><text x="0" y="66" font-size="18">🚕</text></g>' +
      '<g id="c3"><text x="0" y="102" font-size="18">🏍️</text></g>' +
      '</svg>';
    var t = 0, timer = null;
    $(".ctrls", root).innerHTML = '<button data-run="1">▶ Play 10 s</button><button data-reset="1">↺ Reset</button>' +
      '<span class="cap">Car 🚗 uniform · Taxi 🚕 speeding up · Bike 🏍️ slowing down</span>';
    function posOf(kind, tt) {
      if (kind === "uni") return 20 * tt;                       /* 20 m/s constant */
      if (kind === "up") return 0.5 * 3 * tt * tt;              /* a = 3 m/s²   */
      return 30 * tt - 0.5 * 3 * tt * tt;                       /* a = −3 m/s²  */
    }
    function draw() {
      var kinds = ["uni", "up", "down"], ids = ["c1", "c2", "c3"], rows = [], names = [];
      kinds.forEach(function (k, idx) {
        var p = Math.max(0, posOf(k, t));
        $("#" + ids[idx], stage).setAttribute("transform", "translate(" + (30 + p * 1.9) + ",0)");
        rows.push(f(p, 1) + " m");
        names.push(["uniform (20 m s⁻¹)", "speeding up (a = 3 m s⁻²)", "slowing down (a = −3 m s⁻²)"][idx]);
      });
      var d1 = 20 * t, d2 = 0.5 * 3 * t * t, d3 = Math.max(0, 30 * t - 0.5 * 3 * t * t);
      out.innerHTML = "t = <b>" + f(t, 1) + " s</b> &nbsp;·&nbsp; " +
        "🚗 uniform: <b>" + f(d1, 1) + " m</b>, average speed <b>20 m s⁻¹</b> | " +
        "🚕 speeding up: <b>" + f(d2, 1) + " m</b>, average speed <b>" + f(t ? d2 / t : 0, 1) + " m s⁻¹</b> | " +
        "🏍️ slowing down: <b>" + f(d3, 1) + " m</b>, average speed <b>" + f(t ? d3 / t : 0, 1) + " m s⁻¹</b>.<br>" +
        "Distance covered in equal intervals of time is <b>equal</b> only for the uniform car.";
    }
    $$(".ctrls button", root).forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.dataset.reset) { clearInterval(timer); t = 0; draw(); return; }
        clearInterval(timer); t = 0; draw();
        timer = setInterval(function () {
          t += 0.25; if (t > 10) { t = 10; clearInterval(timer); }
          draw();
        }, 70);
      });
    });
    draw();
  };

  /* ------------------------------------------------------ 4 · velocity */
  DEMOS.velocity = function (root) {
    var out = $(".out", root), stage = $(".stage", root);
    stage.innerHTML =
      '<svg viewBox="0 0 640 120" role="img" aria-label="Swimmer in a 25 m pool">' +
      '<rect x="60" y="45" width="520" height="34" rx="6" fill="rgba(56,189,248,.16)" stroke="#3b82f6"/>' +
      '<text x="60" y="34" fill="#a8c2e0" font-size="11">one end</text>' +
      '<text x="520" y="34" fill="#a8c2e0" font-size="11">other end</text>' +
      '<text x="320" y="98" fill="#a8c2e0" font-size="11" text-anchor="middle">length of pool = 25 m</text>' +
      '<g id="sw"><text x="0" y="70" font-size="20">🏊</text></g></svg>';
    var t = 0, timer = null;
    $(".ctrls", root).innerHTML = '<button data-run="1">▶ Swim to and fro (50 s)</button><button data-reset="1">↺ Reset</button>';
    function draw() {
      var frac = (t / 25) % 2;                       /* 0 → 1 → 0 */
      var along = frac <= 1 ? frac : 2 - frac;
      $("#sw", stage).setAttribute("transform", "translate(" + (60 + along * 500) + ",0)");
      var dist = t <= 25 ? (t / 25) * 25 : 25 + ((t - 25) / 25) * 25;
      var disp = (t <= 25 ? (t / 25) * 25 : 50 - (t / 25) * 25) - 0;
      if (t > 25) disp = ((t - 25) / 25) * -25 + 0;
      out.innerHTML = "t = <b>" + f(t, 1) + " s</b> · total distance = <b>" + f(dist, 1) +
        " m</b> · displacement = <b>" + f(disp, 1) + " m</b><br>average speed = <b>" +
        f(t ? dist / t : 0, 2) + " m s⁻¹</b> · average velocity = <b>" + f(t ? disp / t : 0, 2) +
        " m s⁻¹</b>. At the end of the 50 s round trip, displacement is <b>0 m</b> but average speed is <b>1 m s⁻¹</b>.";
    }
    $$(".ctrls button", root).forEach(function (b) {
      b.addEventListener("click", function () {
        clearInterval(timer);
        if (b.dataset.reset) { t = 0; draw(); return; }
        t = 0; draw();
        timer = setInterval(function () { t += 1; if (t >= 50) { t = 50; clearInterval(timer); } draw(); }, 120);
      });
    });
    draw();
  };

  /* -------------------------------------------------- 5 · acceleration */
  DEMOS.accel = function (root) {
    var out = $(".out", root);
    $(".ctrls", root).innerHTML =
      '<label>u = <b class="uv">36</b> km h⁻¹</label><input type="range" class="ur" min="0" max="108" step="18" value="36">' +
      '<label>v = <b class="vv">54</b> km h⁻¹</label><input type="range" class="vr" min="0" max="108" step="18" value="54">' +
      '<label>t = <b class="tv">10</b> s</label><input type="range" class="tr" min="1" max="30" value="10">';
    function draw() {
      var u = +$(".ur", root).value / 3.6, v = +$(".vr", root).value / 3.6, t = +$(".tr", root).value;
      $(".uv", root).textContent = $(".ur", root).value;
      $(".vv", root).textContent = $(".vr", root).value;
      $(".tv", root).textContent = t;
      var a = (v - u) / t;
      out.innerHTML = "u = <b>" + f(u, 2) + " m s⁻¹</b>, v = <b>" + f(v, 2) + " m s⁻¹</b>, t = <b>" + t +
        " s</b> → average acceleration a = (v − u)/t = <b>" + f(a, 3) + " m s⁻²</b>.<br>" +
        (Math.abs(a) < 1e-9 ? "Velocity is not changing, so acceleration is <b>zero</b> — the object may still be moving fast."
          : a > 0 ? "Velocity is increasing, so acceleration acts <b>in the direction of velocity</b>."
          : "Velocity is decreasing, so acceleration acts <b>opposite to the direction of velocity</b> (negative acceleration).") +
        '<br>In 1 s the velocity changes by <b>' + f(a, 2) + " m s⁻¹</b>.";
    }
    $$("input", root).forEach(function (i) { i.addEventListener("input", draw); });
    draw();
  };

  /* ---------------------------------------------- 6 · position-time */
  DEMOS.ptgraph = function (root) {
    var out = $(".out", root), stage = $(".stage", root);
    var uni = { t: [0, 1, 2, 3, 4, 5, 6], s: [0, 20, 40, 60, 80, 100, 120] };
    var acc = { t: [0, 1, 2, 3, 4, 5, 6], s: [0, 5, 20, 45, 80, 125, 180] };
    var rest = { t: [0, 1, 2, 3, 4, 5, 6], s: [40, 40, 40, 40, 40, 40, 40] };
    var W = 560, H = 260, x0 = 60, y0 = 215, sx = 70, sy = 0.95;
    function svg(data, colour, label) {
      var pts = data.t.map(function (t, i) { return (x0 + t * sx) + "," + (y0 - data.s[i] * sy); });
      var grid = "";
      for (var t = 0; t <= 6; t++) grid += '<line x1="' + (x0 + t * sx) + '" y1="' + y0 + '" x2="' + (x0 + t * sx) + '" y2="30" stroke="rgba(127,211,255,.14)"/>' +
        '<text x="' + (x0 + t * sx) + '" y="' + (y0 + 16) + '" fill="#a8c2e0" font-size="10" text-anchor="middle">' + t + "</text>";
      for (var s = 0; s <= 180; s += 20) grid += '<line x1="' + x0 + '" y1="' + (y0 - s * sy) + '" x2="' + (x0 + 6 * sx) + '" y2="' + (y0 - s * sy) + '" stroke="rgba(127,211,255,.08)"/>' +
        (s % 40 === 0 ? '<text x="' + (x0 - 8) + '" y="' + (y0 - s * sy + 4) + '" fill="#a8c2e0" font-size="10" text-anchor="end">' + s + "</text>" : "");
      return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Position-time graph">' + grid +
        '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + 6 * sx + 20) + '" y2="' + y0 + '" stroke="#7fd3ff" stroke-width="2"/>' +
        '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="22" stroke="#7fd3ff" stroke-width="2"/>' +
        '<text x="' + (x0 + 6 * sx) + '" y="' + (y0 + 34) + '" fill="#7fd3ff" font-size="11">time (s)</text>' +
        '<text x="8" y="22" fill="#7fd3ff" font-size="11">position (m)</text>' +
        '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + colour + '" stroke-width="3"/>' +
        data.t.map(function (t, i) {
          return '<circle cx="' + (x0 + t * sx) + '" cy="' + (y0 - data.s[i] * sy) + '" r="3.5" fill="' + colour + '"/>';
        }).join("") +
        '<text x="' + (x0 + 8) + '" y="44" fill="' + colour + '" font-size="12">' + label + '</text></svg>';
    }
    $(".ctrls", root).innerHTML =
      '<button data-d="uni">Uniform motion</button><button data-d="acc">Accelerated motion</button>' +
      '<button data-d="rest">At rest</button>';
    function show(kind) {
      if (kind === "uni") { stage.innerHTML = svg(uni, "#38bdf8", "straight line → constant velocity"); out.innerHTML = "Points: (0,0), (1,20), (2,40) … (6,120). The graph is a <b>straight line</b>, so the object moves with <b>constant velocity</b>. Slope = (120 − 0)/(6 − 0) = <b>20 m s⁻¹</b>. Distance in every 1 s interval is the same 20 m, so it is <b>uniform motion</b>."; }
      else if (kind === "acc") { stage.innerHTML = svg(acc, "#f59e0b", "curve → velocity is changing"); out.innerHTML = "Points: (0,0), (1,5), (2,20), (3,45) … The graph is a <b>curve</b> (parabola), so the velocity is <b>not constant</b> — the object is in <b>accelerated motion</b>. The positions covered in successive seconds are 5, 15, 25, 35, 45, 55 m: increasing, so the speed is increasing."; }
      else { stage.innerHTML = svg(rest, "#a78bfa", "horizontal line → object is at rest"); out.innerHTML = "Position stays at <b>40 m</b> for all times. A line parallel to the time axis means the position does not change, so the object is <b>at rest at 40 m</b> from the origin, and its velocity is <b>zero</b>."; }
    }
    $$(".ctrls button", root).forEach(function (b) {
      b.addEventListener("click", function () { show(b.dataset.d); });
    });
    show("uni");
  };

  /* ---------------------------------------------- 7 · velocity-time */
  DEMOS.vtgraph = function (root) {
    var out = $(".out", root), stage = $(".stage", root);
    var W = 560, H = 260, x0 = 60, y0 = 215, sx = 16, sy = 12;
    var data = { t: [0, 5, 10, 15, 20, 25, 30], v: [0, 2.5, 5, 7.5, 10, 12.5, 15] };
    function draw(t1, t2) {
      var grid = "", pts = [];
      for (var t = 0; t <= 30; t += 5) grid += '<line x1="' + (x0 + t * sx) + '" y1="' + y0 + '" x2="' + (x0 + t * sx) + '" y2="26" stroke="rgba(127,211,255,.12)"/>' +
        '<text x="' + (x0 + t * sx) + '" y="' + (y0 + 16) + '" fill="#a8c2e0" font-size="10" text-anchor="middle">' + t + "</text>";
      for (var v = 0; v <= 15; v += 5) grid += '<line x1="' + x0 + '" y1="' + (y0 - v * sy) + '" x2="' + (x0 + 30 * sx) + '" y2="' + (y0 - v * sy) + '" stroke="rgba(127,211,255,.08)"/>' +
        '<text x="' + (x0 - 8) + '" y="' + (y0 - v * sy + 4) + '" fill="#a8c2e0" font-size="10" text-anchor="end">' + v + "</text>";
      data.t.forEach(function (t, i) { pts.push((x0 + t * sx) + "," + (y0 - data.v[i] * sy)); });
      var v1 = data.v[data.t.indexOf(t1)] || 0, v2 = data.v[data.t.indexOf(t2)] || 0;
      var shade = '<polygon points="' + (x0 + t1 * sx) + "," + y0 + " " + (x0 + t1 * sx) + "," + (y0 - v1 * sy) + " " +
        (x0 + t2 * sx) + "," + (y0 - v2 * sy) + " " + (x0 + t2 * sx) + "," + y0 + '" fill="rgba(56,189,248,.3)" stroke="#38bdf8"/>';
      stage.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Velocity-time graph">' + grid + shade +
        '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + 30 * sx + 20) + '" y2="' + y0 + '" stroke="#7fd3ff" stroke-width="2"/>' +
        '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="22" stroke="#7fd3ff" stroke-width="2"/>' +
        '<polyline points="' + pts.join(" ") + '" fill="none" stroke="#38bdf8" stroke-width="3"/>' +
        '<text x="' + (x0 + 30 * sx) + '" y="' + (y0 + 34) + '" fill="#7fd3ff" font-size="11">time (s)</text>' +
        '<text x="6" y="20" fill="#7fd3ff" font-size="11">velocity (m s⁻¹)</text></svg>';
      var area = 0.5 * (v1 + v2) * (t2 - t1);
      var a = (v2 - v1) / (t2 - t1);
      out.innerHTML = "Between t = <b>" + t1 + " s</b> and t = <b>" + t2 + " s</b>: velocity changes from <b>" + v1 +
        " m s⁻¹</b> to <b>" + v2 + " m s⁻¹</b>.<br>Slope = (v₂ − v₁)/(t₂ − t₁) = <b>" + f(a, 3) +
        " m s⁻²</b> = acceleration. Area under the graph = ½(v₁ + v₂)(t₂ − t₁) = <b>" + f(area, 1) +
        " m</b> = displacement.<br>The straight rising line means <b>constant acceleration in the direction of velocity</b>. Whole 30 s: area = ½ × 30 × 15 = <b>225 m</b>.";
    }
    $(".ctrls", root).innerHTML = '<label>from <b class="t1">10</b> s</label><input type="range" class="r1" min="0" max="25" step="5" value="10">' +
      '<label>to <b class="t2">20</b> s</label><input type="range" class="r2" min="5" max="30" step="5" value="20">';
    function pick() {
      var t1 = +$(".r1", root).value, t2 = +$(".r2", root).value;
      if (t2 <= t1) { t2 = Math.min(30, t1 + 5); $(".r2", root).value = t2; }
      $(".t1", root).textContent = t1; $(".t2", root).textContent = t2;
      draw(t1, t2);
    }
    $$("input", root).forEach(function (i) { i.addEventListener("input", pick); });
    pick();
  };

  /* ------------------------------------------- 8 · kinematic equations */
  DEMOS.kinematics = function (root) {
    var out = $(".out", root);
    $(".ctrls", root).innerHTML =
      '<label>u = <b class="uv">0</b> m s⁻¹</label><input type="range" class="ur" min="0" max="30" value="0">' +
      '<label>a = <b class="av">4</b> m s⁻²</label><input type="range" class="ar" min="-6" max="6" step="0.5" value="4">' +
      '<label>t = <b class="tv">5</b> s</label><input type="range" class="tr" min="1" max="20" value="5">';
    function draw() {
      var u = +$(".ur", root).value, a = +$(".ar", root).value, t = +$(".tr", root).value;
      $(".uv", root).textContent = u; $(".av", root).textContent = f(a, 1); $(".tv", root).textContent = t;
      var v = u + a * t, s = u * t + 0.5 * a * t * t, chk = u * u + 2 * a * s;
      out.innerHTML =
        "v = u + at = " + u + " + (" + f(a, 1) + " × " + t + ") = <b>" + f(v, 2) + " m s⁻¹</b><br>" +
        "s = ut + ½at² = (" + u + " × " + t + ") + (½ × " + f(a, 1) + " × " + t + "²) = <b>" + f(s, 2) + " m</b><br>" +
        "v² = u² + 2as → v² = " + f(chk, 1) + ", so v = <b>" + f(Math.sqrt(Math.max(0, chk)), 2) + " m s⁻¹</b> (check)<br>" +
        (a === 0 ? "With a = 0 the velocity stays the same and the body moves with <b>uniform velocity</b>."
          : a < 0 ? "Negative acceleration means the body is <b>slowing down</b>."
          : "Positive acceleration means the velocity is <b>increasing by " + f(a, 1) + " m s⁻¹ every second</b>.");
    }
    $$("input", root).forEach(function (i) { i.addEventListener("input", draw); });
    draw();
  };

  /* ------------------------------------------------ 9 · braking distance */
  DEMOS.braking = function (root) {
    var out = $(".out", root), stage = $(".stage", root);
    stage.innerHTML = '<svg viewBox="0 0 640 120" role="img" aria-label="Car braking before an obstacle">' +
      '<line x1="20" y1="86" x2="620" y2="86" stroke="#7fd3ff" stroke-width="2"/>' +
      '<rect x="520" y="52" width="16" height="34" fill="#e11d48"/>' +
      '<text x="528" y="44" fill="#fecdd3" font-size="11" text-anchor="middle">obstacle</text>' +
      '<g id="car"><text x="0" y="82" font-size="22">🚌</text></g>' +
      '<rect id="bar" x="20" y="98" height="7" fill="rgba(56,189,248,.45)"/></svg>';
    $(".ctrls", root).innerHTML =
      '<label>speed <b class="sv">36</b> km h⁻¹</label><input type="range" class="sr" min="18" max="108" step="18" value="36">' +
      '<label>reaction time <b class="rt">0.5</b> s</label><input type="range" class="rr" min="0" max="1.5" step="0.1" value="0.5">' +
      '<label>braking a <b class="ba">2.5</b> m s⁻²</label><input type="range" class="br" min="1" max="6" step="0.5" value="2.5">';
    function draw() {
      var u = +$(".sr", root).value / 3.6, rt = +$(".rr", root).value, a = +$(".br", root).value;
      $(".sv", root).textContent = $(".sr", root).value;
      $(".rt", root).textContent = f(rt, 1);
      $(".ba", root).textContent = f(a, 1);
      var react = u * rt, brake = (u * u) / (2 * a), total = react + brake;
      $("#car", stage).setAttribute("transform", "translate(" + (20 + Math.min(460, total * 5)) + ",0)");
      $("#bar", stage).setAttribute("width", Math.min(600, total * 5));
      out.innerHTML = "u = <b>" + f(u, 2) + " m s⁻¹</b> · reaction distance = u × t = <b>" + f(react, 1) +
        " m</b> · braking distance = v²/2a = <b>" + f(brake, 1) + " m</b> · <b>total stopping distance = " +
        f(total, 1) + " m</b>.<br>" + (total < 30
          ? "The bus stops in " + f(total, 1) + " m, so it <b>stops before</b> the obstacle 30 m ahead. ✅"
          : "The bus needs " + f(total, 1) + " m but the obstacle is only 30 m ahead — it would <b>not stop in time</b>. ❌ That is why a safe distance is needed.") +
        "<br>Double the speed and the braking distance becomes four times as large, because v² appears in v² = u² + 2as.";
    }
    $$("input", root).forEach(function (i) { i.addEventListener("input", draw); });
    draw();
  };

  /* ------------------------------------------- 10 · circular motion */
  DEMOS.circular = function (root) {
    var out = $(".out", root), stage = $(".stage", root);
    var R = 90, cx = 320, cy = 130;
    stage.innerHTML = '<svg viewBox="0 0 640 270" role="img" aria-label="Marble moving in a circle with velocity along the tangent">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="#3b82f6" stroke-width="3"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="#7fd3ff"/>' +
      '<line id="rad" x1="' + cx + '" y1="' + cy + '" x2="' + (cx + R) + '" y2="' + cy + '" stroke="#a8c2e0" stroke-dasharray="4 4"/>' +
      '<text id="rlab" x="' + (cx + 45) + '" y="' + (cy - 8) + '" fill="#a8c2e0" font-size="11">R</text>' +
      '<line id="tan" x1="0" y1="0" x2="0" y2="0" stroke="#f59e0b" stroke-width="3"/>' +
      '<text id="tlab" x="0" y="0" fill="#fbbf24" font-size="11">velocity (tangent)</text>' +
      '<circle id="m" r="10" fill="#38bdf8" stroke="#fff" stroke-width="2"/>' +
      '<text x="8" y="262" fill="#a8c2e0" font-size="11">Lift the ring: the marble flies off along the tangent.</text></svg>';
    var ang = 0, timer = null, speed = 60;
    $(".ctrls", root).innerHTML = '<button data-run="1">▶ Start</button><button data-stop="1">❚❚ Stop</button>' +
      '<label>speed <b class="sv">60</b> m s⁻¹</label><input type="range" class="sr" min="10" max="120" step="10" value="60">' +
      '<label>radius <b class="rv">90</b> m</label><input type="range" class="rr" min="40" max="120" step="10" value="90">';
    function draw() {
      var x = cx + R * Math.cos(ang), y = cy + R * Math.sin(ang);
      var tx = x - 55 * Math.sin(ang), ty = y + 55 * Math.cos(ang);
      $("#m", stage).setAttribute("cx", x); $("#m", stage).setAttribute("cy", y);
      $("#tan", stage).setAttribute("x1", x); $("#tan", stage).setAttribute("y1", y);
      $("#tan", stage).setAttribute("x2", tx); $("#tan", stage).setAttribute("y2", ty);
      $("#tlab", stage).setAttribute("x", tx + 4); $("#tlab", stage).setAttribute("y", ty - 4);
      $("#rad", stage).setAttribute("x2", x); $("#rad", stage).setAttribute("y2", y);
      var T = (2 * Math.PI * R) / speed;
      out.innerHTML = "speed constant = <b>" + speed + " m s⁻¹</b> · radius R = <b>" + R + " m</b> · " +
        "distance in one revolution = 2πR = <b>" + f(2 * Math.PI * R, 1) + " m</b> · " +
        "time period T = 2πR/v = <b>" + f(T, 2) + " s</b> · displacement after one full revolution = <b>0 m</b>, " +
        "so average velocity for one revolution = <b>0 m s⁻¹</b>.<br>" +
        "The speed is the same everywhere, but the <b>direction of velocity keeps changing</b> (always along the tangent), " +
        "so uniform circular motion is an <b>accelerated motion</b>.";
    }
    $$(".ctrls button", root).forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.dataset.stop) { clearInterval(timer); return; }
        clearInterval(timer);
        timer = setInterval(function () { ang += 0.06 * (speed / 60); draw(); }, 50);
      });
    });
    $$("input", root).forEach(function (i) {
      i.addEventListener("input", function () {
        if (i.classList.contains("sr")) { speed = +i.value; $(".sv", root).textContent = i.value; }
        else { R = +i.value; $(".rr", root).textContent = i.value; }
        var c = $("#m", stage).parentNode.querySelector("circle");
        c.setAttribute("r", R);
        $("#rad", stage).setAttribute("x2", cx + R);
        draw();
      });
    });
    draw();
  };

  /* ------------------------------------------------------------ boot */
  function boot() {
    $$("[data-demo]").forEach(function (root) {
      var name = root.getAttribute("data-demo");
      if (DEMOS[name]) { try { DEMOS[name](root); } catch (e) {} }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
