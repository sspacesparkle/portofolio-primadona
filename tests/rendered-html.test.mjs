import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const projects = JSON.parse(await readFile(new URL('../app/project-data.json', import.meta.url), 'utf8'));
const { default: worker } = await import('../dist/server/index.js');

async function render(path) {
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: 'text/html' } }),
    { ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} });
}

test('primary routes render portfolio frames', async () => {
  for (const [route, file] of [['/', 'reference.html'], ['/work', 'work-reference.html'], ['/info', 'info-reference.html'], ['/contact', 'contact-reference.html']]) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.ok(html.includes(`src="/${file}"`), route);
    assert.doesNotMatch(html, /Your site is taking shape|Building your site|Glitch.{0,10}Grit/);
  }
});

test('all 15 project routes render matching frames and metadata', async () => {
  assert.equal(Object.keys(projects).length, 15);
  for (const [slug, project] of Object.entries(projects)) {
    const response = await render(`/work/${slug}`);
    assert.equal(response.status, 200, slug);
    const html = await response.text();
    assert.ok(html.includes(`src="/work-${slug}-reference.html"`), slug);
    assert.ok(html.includes(project.title.replaceAll('&', '&amp;')), slug);
    assert.doesNotMatch(html, /\/og\.png/);
  }
});

test('unknown projects return 404 instead of an empty frame', async () => {
  assert.equal((await render('/work/not-a-project')).status, 404);
  assert.equal((await render('/work/toString')).status, 404);
});
