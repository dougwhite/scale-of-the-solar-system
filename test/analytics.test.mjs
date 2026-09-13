import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const code = await readFile('dist/analytics.js', 'utf8');
for (const [url, expected] of [
  ['https://dougwhite.github.io/scale-of-the-solar-system/', 1],
  ['http://localhost:8080/scale-of-the-solar-system/', 0],
  ['https://someone.github.io/scale-of-the-solar-system/', 0],
  ['https://dougwhite.github.io/another-project/', 0],
  ['https://dougwhite.github.io/scale-of-the-solar-system-copy/', 0],
  ['https://html-classic.itch.zone/html/123/index.html', 0],
  ['file:///tmp/scale-of-the-solar-system/index.html', 0],
]) test(`analytics scope: ${url}`, () => {
  const scripts = [];
  runInNewContext(code, {location: new URL(url), document: {
    createElement: () => ({setAttribute(name, value) {this[name] = value;}}),
    head: {appendChild: script => scripts.push(script)},
  }});
  assert.equal(scripts.length, expected);
  if (expected) {
    assert.equal(scripts[0].src, 'https://static.cloudflareinsights.com/beacon.min.js');
    assert.equal(scripts[0].type, 'module');
    assert.match(JSON.parse(scripts[0]['data-cf-beacon']).token, /^[a-f0-9]{32}$/);
  }
});
