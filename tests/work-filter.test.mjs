import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';
import assert from 'node:assert/strict';

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
  const code = html.slice(html.indexOf('function initFilters()'), html.indexOf('function initWorkVideoHover'));
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
