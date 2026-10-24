import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const publicDir = new URL('../public/', import.meta.url);
const script = readFileSync(new URL('portfolio.js', publicDir), 'utf8');

test('Home video sources load only while active and release when hidden', () => {
  const context = { document: { hidden: false } };
  runInNewContext(script.slice(script.indexOf('function setVideoActive'), script.indexOf('function initHomeProjects')), context);
  let source = null, plays = 0, releases = 0;
  const video = {
    dataset: { src: '/original-full-quality.mp4' }, paused: true,
    getAttribute: () => source,
    set src(value) { source = value; },
    play() { this.paused = false; plays++; return Promise.resolve(); },
    pause() { this.paused = true; },
    removeAttribute() { source = null; }, load() { releases++; }
  };
  context.setHomeVideoActive(video, false);
  assert.equal(source, null);
  context.setHomeVideoActive(video, true);
  assert.equal(source, video.dataset.src);
  assert.equal(plays, 1);
  context.setHomeVideoActive(video, true);
  assert.equal(plays, 1);
  context.setHomeVideoActive(video, false);
  assert.equal(source, null);
  assert.equal(releases, 1);
  context.document.hidden = true;
  context.setHomeVideoActive(video, true);
  assert.equal(source, null);
  context.document.hidden = false;
  context.setHomeVideoActive(video, true);
  assert.equal(plays, 2);
});

test('Home previews are ready before scroll; hidden detail videos pause without losing progress', () => {
  const home = readFileSync(new URL('reference.html', publicDir), 'utf8');
  for (const video of home.matchAll(/<video\b[^>]*>/g)) {
    assert.match(video[0], / poster="\/assets\/posters\/optimized\//);
    assert.doesNotMatch(video[0], /\ssrc=/);
  }
  for (const img of home.matchAll(/<img\b[^>]*>/g)) assert.match(img[0], /\ssrc=/);
  const context = { document: { hidden: false } };
  runInNewContext(script.slice(script.indexOf('function setVideoActive'), script.indexOf('function initHomeProjects')), context);
  const attrs = {};
  const video = {
    dataset: { src: '/original.mp4' }, paused: true, currentTime: 12,
    getAttribute: name => attrs[name],
    set src(value) { attrs.src = value; }, set poster(value) { attrs.poster = value; },
    play() { this.paused = false; return Promise.resolve(); }, pause() { this.paused = true; },
    removeAttribute(name) { delete attrs[name]; }, load() {}
  };
  const item = { querySelectorAll: () => [video] };
  context.activateHomeProject(item, false);
  context.activateHomeProject(item, true);
  context.document.hidden = true;
  context.setVideoActive(video, true);
  assert.equal(video.paused, true);
  assert.equal(video.currentTime, 12);
  assert.equal(attrs.src, '/original.mp4');
});

test('footer music controls stay in sync and remember mute across pages', () => {
  const storage = new Map();
  function page() {
    const handlers = {};
    const audio = {
      paused: true, plays: 0,
      addEventListener(event, handler) { handlers[event] = handler; },
      play() { this.paused = false; this.plays++; handlers.play(); return Promise.resolve(); },
      pause() { this.paused = true; handlers.pause(); }
    };
    const toggles = [0, 1].map(() => ({
      attributes: {}, contains: () => false,
      setAttribute(name, value) { this.attributes[name] = value; },
      addEventListener(event, handler) { this[event] = handler; }
    }));
    runInNewContext(readFileSync(new URL('contact-sound.js', publicDir), 'utf8'), {
      document: { getElementById: () => audio, querySelectorAll: () => toggles,
        addEventListener(event, handler) { handlers[event] = handler; } },
      window: { addEventListener() {} },
      sessionStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) }
    });
    return { audio, toggles, handlers };
  }
  const first = page();
  assert.equal(first.audio.plays, 0);
  first.toggles[0].click();
  assert.ok(first.toggles.every(toggle => toggle.attributes['aria-pressed'] === 'true'));
  assert.equal(storage.get('portfolio-music'), 'on');
  const next = page();
  assert.equal(next.audio.plays, 1);
  next.toggles[1].click();
  assert.ok(next.toggles.every(toggle => toggle.attributes['aria-pressed'] === 'false'));
  assert.equal(storage.get('portfolio-music'), 'off');
  next.handlers.pointerdown({ target: {} });
  assert.equal(next.audio.plays, 1);
  assert.equal(page().audio.plays, 0);
});

test('all pages share native Home navigation and footer music; Home labels match Work', () => {
  for (const filename of readdirSync(publicDir).filter(name => name.endsWith('reference.html'))) {
    const html = readFileSync(new URL(filename, publicDir), 'utf8');
    assert.match(html, /<script src="\/portfolio\.js" defer><\/script>/, filename);
    assert.doesNotMatch(html, /barba\.umd|barba\.init/, filename);
    const nav = html.slice(html.indexOf('<div class="footer-links-flex is-nav">'));
    assert.match(nav, /href="\/" target="_top">Home<\/a>/, filename);
    const footers = [...html.matchAll(/<nav\b[^>]*data-wf--nav--variant="(?:base|footer)"[^>]*>.*?<\/nav>/g)];
    assert.ok(footers[0][0].includes('class="contact-sound"'), filename);
    for (const footer of footers.filter(match => match[0].includes('data-wf--nav--variant="footer"'))) {
      assert.ok(footer[0].includes('class="contact-sound"'), filename);
    }
    assert.equal((html.match(/id="contact-music"/g) || []).length, 1, filename);
    for (const link of html.matchAll(/<a\b[^>]*href="\/(?!\/)[^>]*>/g)) {
      assert.ok(link[0].includes('target="_top"'), filename);
    }
  }
  const home = readFileSync(new URL('reference.html', publicDir), 'utf8');
  assert.doesNotMatch(home, /Brand &amp; Identity/);
  for (const card of home.split('<div class="home-projects-item w-dyn-item"').slice(1)) {
    const title = card.match(/home-project-item-title[^>]*>([^<]+)/)[1];
    const tags = [...card.matchAll(/home-project-categpries[^>]*>([^<]+)/g)].map(match => match[1]);
    assert.deepEqual(tags, title === 'Kemedis' ? ['Quality Assurance', 'Quality Assurance'] :
      ['Social Media Specialist', 'Content Creator', 'Social Media Specialist', 'Content Creator']);
  }
});
