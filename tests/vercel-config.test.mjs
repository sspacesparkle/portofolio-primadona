import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import test from 'node:test';

const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const projects = JSON.parse(await readFile(new URL('../app/project-data.json', import.meta.url), 'utf8'));

test('Vercel serves all four pages and 15 projects from existing static HTML', async () => {
  assert.equal(config.framework, null);
  assert.equal(config.outputDirectory, 'public');
  assert.equal(Object.keys(projects).length, 15);
  for (const route of ['/', '/work', '/info', '/contact']) {
    const rewrite = config.rewrites.find(rule => rule.source === route);
    assert.ok(rewrite, route);
    await access(new URL(`../public${rewrite.destination}`, import.meta.url));
  }
  const rewrite = config.rewrites.find(rule => rule.source === '/work/:slug');
  assert.ok(rewrite);
  for (const [slug, project] of Object.entries(projects)) {
    const destination = rewrite.destination.replace(':slug', slug);
    const html = await readFile(new URL(`../public${destination}`, import.meta.url), 'utf8');
    assert.ok(html.includes(project.title.replaceAll('&', '&amp;')), slug);
  }
});
