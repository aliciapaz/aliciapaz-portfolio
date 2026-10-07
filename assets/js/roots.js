// Growing roots drawn on <canvas data-roots="hero|strip">.
// hero: animated, tap to seed new roots. strip: one static drawing.
(function () {
  var MAX_TIPS = 450;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  function Roots(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.animated = canvas.dataset.roots === "hero" && !reducedMotion.matches;
    this.visible = true;
    this.frame = null;
  }

  Roots.prototype.reset = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.color = getComputedStyle(this.canvas).getPropertyValue("--root").trim();
    this.tips = [];
    this.seedTop();
    this.grow(this.animated ? 160 : 2000);
  };

  Roots.prototype.seedTop = function () {
    var w = this.width;
    [[0.5, 4], [0.15, 2], [0.85, 2]].forEach(function (s) {
      this.seed(w * s[0], 0, s[1], Math.PI / 2);
    }, this);
  };

  Roots.prototype.seed = function (x, y, count, angle) {
    for (var i = 0; i < count; i++) {
      this.tips.push({ x: x, y: y, a: angle + (Math.random() - 0.5) * 2.2, life: 140 + Math.random() * 140, w: 1.6 });
    }
  };

  Roots.prototype.grow = function (steps) {
    for (var i = 0; i < steps && this.tips.length; i++) this.step();
  };

  Roots.prototype.step = function () {
    var next = [];
    var ctx = this.ctx;
    this.tips.forEach(function (t) {
      if (t.life-- <= 0 || t.w < 0.2) return;
      var nx = t.x + Math.cos(t.a) * 1.3;
      var ny = t.y + Math.sin(t.a) * 1.3;
      ctx.strokeStyle = "rgba(" + this.color + "," + (0.5 + Math.random() * 0.2) + ")";
      ctx.lineWidth = t.w;
      ctx.beginPath();
      ctx.moveTo(t.x, t.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      t.x = nx;
      t.y = ny;
      t.a += (Math.random() - 0.5) * 0.32;
      t.w *= 0.996;
      if (Math.random() < 0.02 && this.tips.length < MAX_TIPS) {
        var turn = (Math.random() < 0.5 ? -1 : 1) * (0.4 + Math.random() * 0.6);
        next.push({ x: t.x, y: t.y, a: t.a + turn, life: t.life * 0.8, w: t.w * 0.7 });
      }
      if (t.x > -5 && t.x < this.width + 5 && t.y > -5 && t.y < this.height + 5) next.push(t);
    }, this);
    this.tips = next;
  };

  Roots.prototype.loop = function () {
    this.frame = null;
    if (!this.visible || document.hidden) return;
    this.step();
    if (this.tips.length < 3 && Math.random() < 0.01) this.seed(Math.random() * this.width, 0, 3, Math.PI / 2);
    this.frame = requestAnimationFrame(this.loop.bind(this));
  };

  Roots.prototype.resume = function () {
    if (this.animated && !this.frame) this.frame = requestAnimationFrame(this.loop.bind(this));
  };

  Roots.prototype.start = function () {
    var self = this;
    this.reset();
    if (!this.animated) return;
    this.canvas.addEventListener("pointerdown", function (e) {
      var r = self.canvas.getBoundingClientRect();
      self.seed(e.clientX - r.left, e.clientY - r.top, 7, Math.random() * Math.PI * 2);
    });
    new IntersectionObserver(function (entries) {
      self.visible = entries[0].isIntersecting;
      self.resume();
    }).observe(this.canvas);
    document.addEventListener("visibilitychange", this.resume.bind(this));
    this.resume();
  };

  function init() {
    var drawings = Array.prototype.map.call(document.querySelectorAll("canvas[data-roots]"), function (canvas) {
      var roots = new Roots(canvas);
      roots.start();
      return roots;
    });
    var lastWidth = window.innerWidth;
    window.addEventListener("resize", function () {
      if (window.innerWidth === lastWidth) return; // ignore mobile toolbar show/hide
      lastWidth = window.innerWidth;
      drawings.forEach(function (d) { d.reset(); });
    });
    darkScheme.addEventListener("change", function () {
      drawings.forEach(function (d) { d.reset(); });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
