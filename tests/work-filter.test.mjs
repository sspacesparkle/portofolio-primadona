import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('Work uses the eight supplied project logos without hover videos', () => {
  const publicDir = new URL('../public/', import.meta.url);
  const work = readFileSync(new URL('work-reference.html', publicDir), 'utf8');
  const slugs = ['coarse-and-fine', 'fine-folks', 'iolo-pizza', 'indo-alam-resort',
    'laus-kopi', 'kamietiam', 'machimoto', 'sidecar'];
  let count = 0;
  for (const card of work.split('<div class="work-grid-coll-item w-dyn-item"').slice(1)) {
    const slug = card.match(/href="\/work\/([^"]+)"/)[1];
    if (!slugs.includes(slug)) continue;
    const thumbnail = card.slice(0, card.indexOf('work-grid-thumb-infos'));
    assert.ok(thumbnail.includes(`src="/assets/logo/work/${slug}.webp"`), slug);
    assert.ok(existsSync(new URL(`assets/logo/work/${slug}.webp`, publicDir)), slug);
    assert.ok(!thumbnail.includes('<video'), slug);
    assert.match(thumbnail, /alt="[^"]+ logo"/);
    count++;
  }
  assert.equal(count, slugs.length);
});

test('all 15 detail headers match their Work filters and use the corrected project name', () => {
  const publicDir = new URL('../public/', import.meta.url);
  const work = readFileSync(new URL('work-reference.html', publicDir), 'utf8');
  const cards = work.split('<div class="work-grid-coll-item w-dyn-item"').slice(1);
  assert.equal(cards.length, 15);
  for (const card of cards) {
    const slug = card.match(/href="\/work\/([^"]+)"/)[1];
    const expected = [...card.slice(card.indexOf('<div class="hide w-dyn-list"'))
      .matchAll(/fs-cmsfilter-field="category">([^<]+)/g)]
      .map(match => match[1]).filter(category => category !== 'All Work');
    const detail = readFileSync(new URL(`work-${slug}-reference.html`, publicDir), 'utf8');
    const header = detail.slice(0, detail.indexOf('home-project-item-title'));
    const actual = [...header.matchAll(/home-project-categpries[^>]*>([^<]+)/g)].map(match => match[1]);
    assert.deepEqual(actual, expected, slug);
    if (slug === 'kemedis') assert.deepEqual(actual, ['Quality Assurance']);
  }
  for (const filename of readdirSync(publicDir).filter(name => name.endsWith('reference.html'))) {
    const html = readFileSync(new URL(filename, publicDir), 'utf8');
    assert.ok(!/(?:Denn(?:'|&#x27;)s|Deens) Sambal/.test(html), filename);
  }
  const projects = JSON.parse(readFileSync(new URL('../app/project-data.json', import.meta.url), 'utf8'));
  assert.equal(projects['denns-sambal'].title, "Deen's Sambal");
});

test('Work filter clicks show 14 creative projects, only Kemedis for QA, and all 15 on reset', () => {
  const html = readFileSync(new URL('../public/work-reference.html', import.meta.url), 'utf8');
  const cards = html.split('<div class="work-grid-coll-item w-dyn-item"').slice(1).map(markup => {
    const slug = markup.match(/href="\/work\/([^"]+)"/)[1];
    const categoryMarkup = markup.slice(markup.indexOf('<div class="hide w-dyn-list"'));
    const tags = [...categoryMarkup.matchAll(/fs-cmsfilter-field="category">([^<]+)/g)].map(match => match[1]);
    return { slug, hidden: false, style: {}, classList: { contains: () => true },
      querySelectorAll: () => tags.map(textContent => ({ textContent })),
      querySelector: () => ({ textContent: '' }) };
  });
  const buttons = ['All Work', 'Social Media Specialist', 'Content Creator', 'Quality Assurance'].map(category => ({
    input: { checked: false }, classList: { toggle() {} },
    querySelector(selector) { return selector === 'input' ? this.input : { textContent: category }; },
    addEventListener(event, handler) { this.click = handler; }
  }));
  const script = readFileSync(new URL('../public/portfolio.js', import.meta.url), 'utf8');
  const code = script.slice(script.indexOf('function initFilters()'), script.indexOf('function initWorkVideoHover'));
  runInNewContext(code + '\ninitFilters();', { document: {
    querySelector: () => ({ children: cards }), querySelectorAll: () => buttons
  } });
  for (const index of [1, 3, 2, 0, 3, 0]) {
    buttons[index].click();
    const visible = cards.filter(card => !card.hidden && card.style.display !== 'none');
    assert.equal(visible.length, index === 0 ? 15 : index === 3 ? 1 : 14);
    if (index === 3) assert.equal(visible[0].slug, 'kemedis');
    if (index === 1 || index === 2) assert.ok(visible.every(card => card.slug !== 'kemedis'));
    assert.equal(buttons.filter(button => button.input.checked).length, 1);
  }
});
