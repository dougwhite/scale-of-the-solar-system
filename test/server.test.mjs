import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
test('server exposes only public assets on a random port',async()=>{
 const child=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:'0'},stdio:['ignore','pipe','pipe']});
 try{
 const url=await new Promise((resolve,reject)=>{let text='';const timer=setTimeout(()=>reject(new Error('Server timeout')),5000);child.stdout.on('data',d=>{text+=d;const m=text.match(/Local: (http:\/\/localhost:\d+)/);if(m){clearTimeout(timer);resolve(m[1]);}});child.on('error',reject);child.on('exit',code=>{clearTimeout(timer);reject(new Error('Server exited '+code));});});
 for(const file of ['/','/app.js','/data.js','/motion.js','/style.css','/assets/earth.jpg','/assets/sun.jpg','/assets/pluto.jpg','/assets/gaspra.jpg','/assets/arrokoth.png']){const r=await fetch(url+file);assert.equal(r.status,200,file);assert.ok((await r.arrayBuffer()).byteLength>100);}
 assert.equal((await fetch(url+'/assets/temple-garden.mp3')).status,404);
 assert.equal((await fetch(url+'/server.mjs')).status,404);
 assert.equal((await fetch(url+'/%2e%2e%2fpackage.json')).status,403);
 assert.equal((await fetch(url+'/%zz')).status,404);
 assert.equal((await fetch(url+'/',{method:'POST'})).status,405);
 assert.equal((await fetch(url+'/',{method:'HEAD'})).status,200);
 }finally{if(child.exitCode===null&&child.signalCode===null){child.kill();await once(child,'exit');}}
});
