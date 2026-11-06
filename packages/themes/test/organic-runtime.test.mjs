import assert from "node:assert/strict";
import { test } from "node:test";
import { paintForest, paintClay } from "../src/organic-paint.ts";
import { mountOrganicCanvas } from "../src/organic-runtime.ts";

function environment() {
  const keys = [
    "window",
    "document",
    "requestAnimationFrame",
    "cancelAnimationFrame",
    "getComputedStyle",
    "ResizeObserver",
    "IntersectionObserver",
    "MutationObserver",
    "matchMedia",
    "devicePixelRatio",
  ];
  const originals = keys.map((key) => [
    key,
    Object.getOwnPropertyDescriptor(globalThis, key),
  ]);
  const queue = new Map(),
    observers = [],
    queries = [],
    variables = new Map();
  let serial = 0,
    paints = 0;
  class Observer {
    constructor(callback) {
      this.callback = callback;
      this.disconnected = false;
      observers.push(this);
    }
    observe() {}
    disconnect() {
      this.disconnected = true;
    }
  }
  class Intersection extends Observer {}
  const document = new EventTarget();
  document.head = {};
  document.hidden = false;
  const window = new EventTarget();
  const surface = { parentElement: null };
  const host = {
    parentElement: surface,
    getBoundingClientRect: () => ({ width: 180, height: 120 }),
  };
  const gradient = { addColorStop() {} };
  const context = new Proxy(
    {},
    {
      get(_target, key) {
        if (key === "createLinearGradient" || key === "createRadialGradient")
          return () => gradient;
        if (key === "clearRect") return () => paints++;
        return () => {};
      },
      set() {
        return true;
      },
    },
  );
  const attributes = new Map();
  const canvas = Object.assign(new EventTarget(), {
    parentElement: host,
    width: 0,
    height: 0,
    getContext: () => context,
    toggleAttribute: (name, on) =>
      on ? attributes.set(name, "") : attributes.delete(name),
    removeAttribute: (name) => attributes.delete(name),
  });
  const style = {
    borderTopLeftRadius: "24px",
    borderTopRightRadius: "8px",
    borderBottomLeftRadius: "16px",
    borderBottomRightRadius: "30px 12px",
    paddingTop: "40px",
    paddingBottom: "40px",
    paddingLeft: "40px",
    paddingRight: "40px",
    backgroundColor: "#fdfbf3",
    borderTopColor: "#73825a",
    display: "block",
    getPropertyValue: (key) => variables.get(key) || "",
  };
  const globals = {
    window,
    document,
    devicePixelRatio: 2,
    ResizeObserver: Observer,
    MutationObserver: Observer,
    IntersectionObserver: Intersection,
    getComputedStyle: () => style,
    requestAnimationFrame: (callback) => {
      const id = ++serial;
      queue.set(id, callback);
      return id;
    },
    cancelAnimationFrame: (id) => queue.delete(id),
    matchMedia: () => {
      const query = Object.assign(new EventTarget(), { matches: false });
      queries.push(query);
      return query;
    },
  };
  for (const [key, value] of Object.entries(globals))
    Object.defineProperty(globalThis, key, {
      value,
      writable: true,
      configurable: true,
    });
  return {
    canvas,
    queue,
    observers,
    queries,
    variables,
    attributes,
    document,
    window,
    get paints() {
      return paints;
    },
    flush(now) {
      for (const [id, callback] of [...queue]) {
        queue.delete(id);
        callback(now);
      }
    },
    restore() {
      for (const [key, descriptor] of originals)
        if (descriptor) Object.defineProperty(globalThis, key, descriptor);
        else delete globalThis[key];
    },
  };
}

test("optional motion stops offscreen, at twenty seconds, and fully releases its resources", () => {
  const env = environment();
  let dispose;
  try {
    const start = performance.now();
    dispose = mountOrganicCanvas(
      env.canvas,
      "forest",
      paintForest,
      17,
      true,
      "system",
    );
    env.flush(start + 40);
    assert.ok(env.attributes.has("data-running"));
    assert.ok(env.paints > 0);
    assert.ok(env.queue.size > 0);
    const intersection = env.observers.find(
      (observer) => observer.constructor.name === "Intersection",
    );
    intersection.callback([{ isIntersecting: false }]);
    assert.equal(env.queue.size, 0);
    assert.equal(env.attributes.has("data-running"), false);
    intersection.callback([{ isIntersecting: true }]);
    env.flush(start + 120);
    assert.ok(env.attributes.has("data-running"));
    env.flush(start + 20100);
    assert.equal(env.attributes.has("data-running"), false);
    assert.equal(env.queue.size, 0);
    dispose();
    dispose = undefined;
    assert.ok(env.observers.every((observer) => observer.disconnected));
    env.window.dispatchEvent(new Event("resize"));
    env.document.dispatchEvent(new Event("visibilitychange"));
    env.queries.forEach((query) => query.dispatchEvent(new Event("change")));
    assert.equal(env.queue.size, 0, "Unmounted renderers must never restart");
  } finally {
    dispose?.();
    env.restore();
  }
});

test("reduced motion stays static and ordinary density edits settle without a background loop", () => {
  const env = environment();
  let dispose;
  try {
    let now = performance.now();
    dispose = mountOrganicCanvas(
      env.canvas,
      "cushion",
      paintClay,
      31,
      true,
      "reduced",
    );
    env.flush(now + 40);
    assert.equal(env.attributes.has("data-running"), false);
    assert.equal(env.queue.size, 0);
    dispose();
    dispose = mountOrganicCanvas(
      env.canvas,
      "forest",
      paintForest,
      17,
      false,
      "system",
    );
    env.flush(now + 80);
    env.variables.set("--dixy-organic-density", "15");
    env.observers.find((observer) => !observer.disconnected).callback([]);
    for (let step = 0; step < 120 && env.queue.size; step++)
      env.flush(now + 120 + step * 40);
    assert.equal(env.queue.size, 0);
    assert.equal(env.attributes.has("data-running"), false);
    assert.ok(env.canvas.width * env.canvas.height <= 2_000_000);
  } finally {
    dispose?.();
    env.restore();
  }
});
