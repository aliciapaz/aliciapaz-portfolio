// Desktop-only graph of notes: the three fields are fixed hubs, notes link to
// their fields and to their related notes. The layout is computed up front and
// drawn once (no animation), so it is also fine under prefers-reduced-motion.
(function () {
  var SVG_NS = "http://www.w3.org/2000/svg";
  var WIDTH = 720;
  var HEIGHT = 520;
  var HUBS = { music: [200, 150], software: [520, 150], territorio: [360, 400] };
  var desktop = window.matchMedia("(min-width: 60rem) and (pointer: fine)");

  function seededRandom(seed) {
    return function () {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
  }

  function buildNodes(data) {
    var random = seededRandom(42);
    var nodes = {};
    data.fields.forEach(function (f) {
      nodes["field:" + f.id] = { id: f.id, title: f.name, hub: true, x: HUBS[f.id][0], y: HUBS[f.id][1] };
    });
    data.notes.forEach(function (n) {
      var x = 0;
      var y = 0;
      n.fields.forEach(function (f) { x += HUBS[f][0]; y += HUBS[f][1]; });
      nodes[n.id] = {
        id: n.id, title: n.title, hub: false,
        x: x / n.fields.length + (random() - 0.5) * 60,
        y: y / n.fields.length + (random() - 0.5) * 60
      };
    });
    return nodes;
  }

  function buildEdges(data) {
    var edges = [];
    var seen = {};
    data.notes.forEach(function (n) {
      n.fields.forEach(function (f) { edges.push({ a: n.id, b: "field:" + f, kind: "field", rest: 120 }); });
      n.related.forEach(function (r) {
        var key = [n.id, r].sort().join("|");
        if (seen[key]) return;
        seen[key] = true;
        edges.push({ a: n.id, b: r, kind: "related", rest: 70 });
      });
    });
    return edges;
  }

  function settle(nodes, edges) {
    var list = Object.keys(nodes).map(function (k) { return nodes[k]; });
    for (var step = 0; step < 400; step++) {
      var cooling = 1 - step / 400;
      list.forEach(function (a) {
        if (a.hub) return;
        list.forEach(function (b) {
          if (a === b) return;
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var d2 = Math.max(dx * dx + dy * dy, 25);
          a.x += (dx / d2) * 260 * cooling;
          a.y += (dy / d2) * 260 * cooling;
        });
      });
      edges.forEach(function (e) {
        var a = nodes[e.a];
        var b = nodes[e.b];
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var d = Math.sqrt(dx * dx + dy * dy) || 1;
        var pull = ((d - e.rest) / d) * 0.12 * cooling;
        if (!a.hub) { a.x += dx * pull; a.y += dy * pull; }
        if (!b.hub) { b.x -= dx * pull; b.y -= dy * pull; }
      });
      list.forEach(function (n) {
        n.x = Math.min(Math.max(n.x, 100), WIDTH - 100);
        n.y = Math.min(Math.max(n.y, 30), HEIGHT - 30);
      });
    }
  }

  function el(name, attrs, parent) {
    var node = document.createElementNS(SVG_NS, name);
    Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(node);
    return node;
  }

  function draw(container, nodes, edges, label) {
    var svg = el("svg", { class: "graph", viewBox: "0 0 " + WIDTH + " " + HEIGHT, role: "img", "aria-label": label });
    var lines = edges.map(function (e) {
      var a = nodes[e.a];
      var b = nodes[e.b];
      var line = el("line", { class: "graph-edge graph-edge-" + e.kind, x1: a.x, y1: a.y, x2: b.x, y2: b.y }, svg);
      return { edge: e, line: line };
    });
    Object.keys(nodes).forEach(function (key) {
      var n = nodes[key];
      var group = el(n.hub ? "g" : "a", n.hub ? { class: "graph-hub" } : { class: "graph-note", href: "#note-" + n.id }, svg);
      el("circle", { cx: n.x, cy: n.y, r: n.hub ? 6 : 3.5 }, group);
      el("text", { x: n.x, y: n.y - (n.hub ? 14 : 9), "text-anchor": "middle" }, group).textContent = n.title;
      group.addEventListener("mouseenter", function () { highlight(lines, key, true); });
      group.addEventListener("mouseleave", function () { highlight(lines, key, false); });
    });
    container.appendChild(svg);
    container.classList.add("is-graph");
  }

  function highlight(lines, key, on) {
    lines.forEach(function (l) {
      if (l.edge.a === key || l.edge.b === key) l.line.classList.toggle("is-active", on);
    });
  }

  function init() {
    var container = document.querySelector("[data-notes-graph]");
    var source = document.getElementById("notes-data");
    if (!container || !source || container.classList.contains("is-graph")) return;
    var data = JSON.parse(source.textContent);
    var nodes = buildNodes(data);
    var edges = buildEdges(data);
    settle(nodes, edges);
    draw(container, nodes, edges, container.querySelector("svg").getAttribute("aria-label"));
  }

  function initWhenDesktop() {
    if (desktop.matches) init();
  }

  desktop.addEventListener("change", initWhenDesktop);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initWhenDesktop);
  else initWhenDesktop();
})();
