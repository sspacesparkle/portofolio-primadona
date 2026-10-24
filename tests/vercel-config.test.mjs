import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import test from 'node:test';

const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const projects = JSON.parse(await readFile(new URL('../app/project-data.json', import.meta.url), 'utf8'));

test('all pages declare the same transparent Naey favicon before the title and supply browser fallbacks', async () => {
  const publicDir = new URL('../public/', import.meta.url);
  const icon = await readFile(new URL('favicon.ico', publicDir));
  assert.equal(icon.readUInt16LE(2), 1);
  assert.ok(icon.readUInt16LE(4) >= 3);
  const href = `/favicon.ico?v=naey-${createHash('sha256').update(icon).digest('hex').slice(0, 12)}`;
  for (const filename of (await readdir(publicDir)).filter(name => name.endsWith('reference.html'))) {
    const html = await readFile(new URL(filename, publicDir), 'utf8');
    const icons = html.match(/<link\b[^>]*rel="icon"[^>]*>/g);
    assert.equal(icons.length, 1, filename);
    assert.ok(icons[0].includes(`href="${href}"`), filename);
    assert.ok(html.indexOf(icons[0]) < html.indexOf('<title>'), filename);
  }
  await access(new URL('apple-touch-icon.png', publicDir));
});

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
