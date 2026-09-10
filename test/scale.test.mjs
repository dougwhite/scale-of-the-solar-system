import test from 'node:test';
import assert from 'node:assert/strict';
import {AU,BASE,EARTH_DIAMETER,objects,kmAt,pixelsPerKm,screenY,nearestIndex,clampCamera} from '../dist/data.js';
test('one scale preserves Earth diameter and distance at every zoom',()=>{for(const z of [.0101,.025,.1,1,4]){assert.ok(Math.abs(EARTH_DIAMETER*pixelsPerKm(z)-88*z)<1e-10);assert.ok(Math.abs((screenY(0,AU,z,780)-390)/(-88*z)-AU/EARTH_DIAMETER)<1e-8);}});
test('all destinations are ordered and centered at any zoom, including estimated Planet X',()=>{objects.forEach((o,i)=>{assert.equal(screenY(kmAt(o),kmAt(o),.037,667),333.5);assert.equal(nearestIndex(kmAt(o)),i);if(i)assert.ok(o.au>objects[i-1].au);});const x=objects.at(-1);assert.ok(Math.abs(x.diameter/EARTH_DIAMETER-2.3)<.0001);assert.ok(x.diameter>x.diameterEstimate[0]&&x.diameter<x.diameterEstimate[1]);assert.equal(x.hypothetical,true);});
test('virtual camera handles distances beyond DOM scroll limits without loss of local detail',()=>{const x=600*AU;assert.ok(x*BASE>500000000);assert.ok(Math.abs(screenY(x+1/BASE,x,1,667)-334.5)<.00001);assert.equal(clampCamera(-1e15),-1392700);assert.equal(clampCamera(1e15),805*AU);});
