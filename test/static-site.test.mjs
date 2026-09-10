import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';

test('static site assets work at both a domain root and a GitHub Pages project path',async()=>{
  const html=await readFile('dist/index.html','utf8');
  const app=await readFile('dist/app.js','utf8');
  const relativeAssets=[...html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)].map(m=>m[1]);
  assert.deepEqual(relativeAssets.sort(),['./app.js','./style.css']);
  assert.doesNotMatch(html,/(?:src|href)="\/(?!\/)/);
  assert.doesNotMatch(app,/["'`]\/assets\//);
  for(const base of ['https://example.org/','https://example.org/scale-of-the-solar-system/']){
    for(const ref of [...relativeAssets,'./assets/earth.jpg','./assets/gaspra.jpg','./assets/arrokoth.png']){
      const url=new URL(ref,base);
      assert.ok(url.href.startsWith(base));
      await access('dist/'+ref.slice(2));
    }
  }
  assert.equal((html.match(/id="scale-text"/g)||[]).length,1);
  assert.ok(html.includes('A scientific imagination experiment developed by GPT-6 Astra.'));
});
