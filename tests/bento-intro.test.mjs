import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the actual hook, RAF clock and renderer with a layout-only DOM adapter.
// These tests validate playback/geometry contracts; browser visual QA is still separate.
function loadModule(path, globals, dependencies = {}) {
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: (name) => dependencies[name], ...globals }, { filename: path });
  return exports;
}
const timeline = loadModule('../lib/bento-intro.ts');

class Element {
  style = { removeProperty(name) { delete this[name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())]; } };
  dataset = {};
  attributes = {};
  inert = false;
  hidden = false;
  scrollTop = 0;
  constructor(rect = { left: 0, top: 0, width: 10, height: 15 }) { this.rect = rect; }
  getBoundingClientRect() { return { ...this.rect, bottom: this.rect.top + this.rect.height }; }
  setAttribute(name, value) { this.attributes[name] = value; }
  querySelector() { return this.child ??= new Element(); }
  get offsetLeft() { return this.rect.left; }
  get offsetWidth() { return this.rect.width; }
}

function mount({ width = 1440, height = 900, seen = false, reduced = false, storageBlocked = false } = {}) {
  let now = 0, nextId = 0, cleanup;
  const scheduled = new Map(), effects = [], states = [], listeners = new Map(), observers = [];
  const root = new Element(); root.dataset.startup = 'intro';
  const background = new Element(); root.parentElement = { querySelector: () => background };
  const terminal = new Element({ left: 24, top: 46, width: (width - 80) / 3, height: height * 0.62 });
  const words = ['build', 'me', 'a', 'portfolio'].map((word, i) => new Element({ left: [30, 75, 100, 115][i], top: 0, width: word.length * 8 + 6, height: 20 }));
  const lines = timeline.LINE_TIMES.map((_, index) => new Element({ left: 36, top: 180 + index * 16, width: 340, height: 16 }));
  const cards = timeline.DEAL.map((deal, index) => {
    const element = new Element({ left: 40 + index * 80, top: 80 + index * 65, width: ['education', 'contact'].includes(deal.id) ? 190 : 420, height: 230 });
    element.dataset.introTile = deal.id;
    return element;
  });
  const waves = [0, 1].map((i) => {
    const svg = new Element(), band = new Element(), ring = i === 0 ? new Element() : null;
    svg.querySelector = (selector) => selector === '[data-wave-band]' ? band : ring;
    return svg;
  });
  const selectors = new Map([
    ['.bento-editor', terminal],
    ...['.cc-scroll', '.bento-grid', '.intro-card', '.intro-prompt', '.intro-highlight', '.intro-caret', '.intro-return', '.intro-building', '.bento-bar', '.bento-message', '.bento-startup-skip'].map((selector) => [selector, new Element()]),
    ...timeline.DEAL.map((deal, i) => [`[data-intro-tile="${deal.id}"]`, cards[i]]),
  ]);
  selectors.get('.cc-scroll').rect = { left: 36, top: 100, width: 400, height: height * 0.5 };
  root.querySelector = (selector) => selectors.get(selector);
  root.querySelectorAll = (selector) => ({ '.intro-word': words, '[data-intro-line]': lines, '.intro-wave': waves })[selector];
  const motionListeners = new Map();
  const motion = { matches: reduced, addEventListener: (name, callback) => motionListeners.set(name, callback), removeEventListener: (name) => motionListeners.delete(name) };
  const window = {
    innerWidth: width, innerHeight: height, location: { hash: '' }, scrollTo() {},
    matchMedia: (query) => query.includes('reduced') ? motion : { get matches() { return window.innerWidth < 900 || window.innerHeight < 620; } },
    addEventListener(name, callback) { listeners.set(name, callback); }, removeEventListener(name) { listeners.delete(name); },
  };
  const storage = new Map(seen ? [['portfolio:intro:landed:v2', '1']] : []);
  const globals = {
    window, document: { getElementById: () => null, fonts: { ready: { then() {} } } },
    performance: { now: () => now }, queueMicrotask: (callback) => callback(),
    requestAnimationFrame: (callback) => { scheduled.set(++nextId, callback); return nextId; },
    cancelAnimationFrame: (id) => scheduled.delete(id),
    sessionStorage: { getItem: (key) => { if (storageBlocked) throw Error('blocked'); return storage.get(key); }, setItem: (key, value) => { if (storageBlocked) throw Error('blocked'); storage.set(key, value); } },
    ResizeObserver: class { constructor(callback) { observers.push(callback); } observe() {} disconnect() {} },
  };
  const react = {
    useState: (initial) => [initial, (value) => states.push(value)],
    useCallback: (callback) => callback,
    useRef: (current) => ({ current }),
    useLayoutEffect: (callback) => effects.push(callback),
  };
  const hook = loadModule('../components/ui/use-bento-intro.ts', globals, { react, '@/lib/bento-intro': timeline });
  const controls = hook.useBentoIntro({ current: root });
  effects.forEach((effect) => { cleanup = effect(); });
  function run(milliseconds) {
    const until = now + milliseconds;
    while (now < until && scheduled.size) {
      now = Math.min(until, now + 10);
      const callbacks = [...scheduled.values()]; scheduled.clear(); callbacks.forEach((callback) => callback(now));
    }
  }
  return { root, terminal, cards, words, lines, selectors, window, motion, controls, run, storage, states, scheduled, listeners, observers, motionListeners, cleanup };
}

test('each of eight Write lines owns exactly one card; all cards finish before 6 seconds', () => {
  const lines = timeline.introLines('Preet Patel', 'AI Operations Developer', 'Docebo');
  assert.equal(lines.length, 14);
  assert.equal(lines.filter((line) => line.includes('Write(')).length, 8);
  for (const [index, card] of timeline.DEAL.entries()) {
    assert.match(lines[card.line], /Write\(/);
    assert.ok(timeline.ARRANGE + 0.08 + index * 0.045 + 0.72 < timeline.INTRO_END);
  }
});

for (const [width, height] of [[1440, 900], [1280, 720]]) {
  test(`${width}×${height}: word pop, central flip, individual deals, arrange and clean landing`, () => {
    const app = mount({ width, height });
    assert.equal(app.root.dataset.introPhase, 'prompt');
    assert.equal(app.terminal.style.opacity, '0');
    app.run(400);
    assert.ok(Number(app.words[0].style.opacity) > 0);
    assert.equal(app.words[1].style.opacity, '0');
    app.run(1600);
    assert.equal(app.root.dataset.introPhase, 'deal');
    assert.match(app.terminal.style.transform, /rotateY\(0deg\)/);
    assert.equal(app.cards[0].style.opacity, '0');
    app.run(390); // hero Write at 2.32, dealt at 2.36
    assert.ok(Number(app.cards[0].style.opacity) > 0);
    assert.equal(app.cards[1].style.opacity, '0');
    assert.ok(Number(app.lines[3].child.style.opacity) > 0);
    app.run(1700);
    assert.ok(app.cards.every((card) => Number(card.style.opacity) > 0));
    app.run(600);
    assert.equal(app.root.dataset.introPhase, 'arrange');
    assert.equal(app.selectors.get('.bento-startup-skip').inert, true);
    app.run(1400);
    assert.equal(app.root.dataset.startup, 'ready');
    assert.equal(app.selectors.get('.bento-grid').inert, false);
    for (const element of [app.terminal, ...app.cards, ...app.lines]) {
      assert.equal(element.style.transform, undefined);
      assert.equal(element.style.opacity, undefined);
      assert.equal(element.style.boxShadow, undefined);
    }
    assert.equal(app.scheduled.size, 0);
    assert.equal(app.storage.get('portfolio:intro:landed:v2'), '1');
    app.cleanup();
  });
}

test('Esc accelerates at 4× and does not cut; replay starts from a clean state', () => {
  const app = mount(); app.run(1000);
  app.listeners.get('keydown')({ key: 'Escape', preventDefault() {}, stopImmediatePropagation() {} });
  assert.equal(app.root.dataset.startup, 'intro');
  app.run(1000);
  assert.equal(app.root.dataset.introPhase, 'arrange');
  app.run(300);
  assert.equal(app.root.dataset.startup, 'ready');
  app.controls.replay();
  assert.equal(app.root.dataset.startup, 'intro');
  assert.equal(app.terminal.style.opacity, '0');
  app.run(6100);
  assert.equal(app.root.dataset.startup, 'ready');
  app.cleanup();
});

test('resize during flight remeasures slots and switching to mobile removes table transforms', () => {
  const app = mount(); app.run(2900);
  const before = app.cards[0].style.transform;
  app.cards[0].rect.left += 80;
  app.listeners.get('resize')();
  assert.notEqual(app.cards[0].style.transform, before);
  app.window.innerWidth = 390; app.window.innerHeight = 844;
  app.listeners.get('resize')();
  assert.match(app.cards[0].style.transform, /^translateY\(/);
  assert.ok(app.cards.every((card) => !card.style.transform.includes('scale')));
  app.run(3200);
  assert.equal(app.root.dataset.startup, 'ready');
  app.listeners.get('resize')();
  assert.ok(app.cards.every((card) => card.style.transform === undefined));
  app.cleanup();
});

test('single-column cards rise in deal order after flip', () => {
  const app = mount({ width: 390, height: 844 });
  app.run(2000);
  assert.ok(Number(app.cards[0].style.opacity) > 0);
  assert.equal(app.cards[1].style.opacity, '0');
  app.run(6100);
  assert.equal(app.root.dataset.startup, 'ready');
  app.cleanup();
});

for (const options of [{ seen: true }, { reduced: true }]) {
  test(`${JSON.stringify(options)}: initial visit lands immediately without a running RAF`, () => {
    const app = mount(options);
    assert.equal(app.root.dataset.startup, 'ready');
    assert.equal(app.scheduled.size, 0);
    assert.equal(app.terminal.style.transform, undefined);
    assert.equal(app.states.at(-1), true);
    app.cleanup();
  });
}

test('blocked storage and reduced-motion change during flight both land safely', () => {
  const app = mount({ storageBlocked: true });
  app.run(3000);
  app.motion.matches = true;
  app.motionListeners.get('change')();
  assert.equal(app.root.dataset.startup, 'ready');
  app.cleanup();
});

test('grid and command-palette keys are blocked during playback and released on landing', () => {
  const app = mount();
  for (const event of [{ key: 'w' }, { key: 'k', metaKey: true }]) {
    let prevented = false, stopped = false;
    app.listeners.get('keydown')({ ...event, preventDefault() { prevented = true; }, stopImmediatePropagation() { stopped = true; } });
    assert.ok(prevented && stopped);
  }
  app.run(6100);
  let prevented = false;
  app.listeners.get('keydown')({ key: 'w', preventDefault() { prevented = true; } });
  assert.equal(prevented, false);
  app.cleanup();
});
