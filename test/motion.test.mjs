import test from 'node:test';
import assert from 'node:assert/strict';
import {flingVelocity,momentumStep,starPosition,travelDuration,createTravelPlan,travelPosition} from '../dist/motion.js';
import {BASE,AU,screenY,objects,kmAt,pixelsPerKm} from '../dist/data.js';
test('a 30-second journey shows intermediate worlds only as brief flashes',()=>{
 for(const zoom of [.025,1,4]){
  const height=667,plan=createTravelPlan(0,600*AU,zoom,height);
  assert.ok(Math.abs(plan.duration-30000)<1e-8);
  for(const o of objects.slice(1,-1)){
   let visibleFrames=0;
   for(let t=0;t<plan.duration;t+=1000/60){
    const y=screenY(kmAt(o),travelPosition(plan,t),zoom,height);
    if(Math.abs(y-height/2)<height/2+(o.diameter||0)/2*pixelsPerKm(zoom))visibleFrames++;
   }
   assert.ok(visibleFrames>=3&&visibleFrames<=10,`${o.name} at ${zoom}× visible for ${visibleFrames} frames; expected a brief flash`);
  }
 }
});
test('flybys preserve endpoints and direction, including reversed and overlapping windows',()=>{
 for(const [from,to,zoom] of [[0,AU,1],[AU,0,1],[AU,600*AU,.025],[2.15*AU,2.4*AU,4],[0,AU,.000001],[AU,AU,1]]){
  const plan=createTravelPlan(from,to,zoom,667);
  assert.equal(travelPosition(plan,0),from);assert.equal(travelPosition(plan,plan.duration+1),to);
  let previous=from;
  for(let i=1;i<=1000;i++){
   const position=travelPosition(plan,plan.duration*i/1000);
   assert.ok(Number.isFinite(position));assert.ok((position-previous)*Math.sign(to-from)>=0);
   previous=position;
  }
  for(let i=1;i<plan.segments.length;i++){
   assert.equal(plan.segments[i].start,plan.segments[i-1].end);
   assert.equal(plan.segments[i].from,plan.segments[i-1].to);
   assert.equal(plan.segments[i].startVelocity,plan.segments[i-1].endVelocity);
   assert.ok(plan.segments[i].startVelocity*Math.sign(to-from)>0,'internal joins must not stop');
  }
 }
 const earthTrip=createTravelPlan(0,AU,1,667);
 assert.equal(earthTrip.duration,3000);
 assert.equal(earthTrip.segments.at(-1).end,3000);
 for(const au of [.3871,.7233]){
  const segment=earthTrip.segments.find(s=>s.slow&&s.from<=au*AU&&s.to>=au*AU);
  assert.ok(Math.abs(segment.end-segment.start-120)<1e-6);
 }
});
test('logarithmic travel meets the Earth and Planet X timing anchors in either direction',()=>{
 assert.ok(Math.abs(travelDuration(600*AU)-30000)<1e-8);
 assert.ok(Math.abs(travelDuration(-600*AU)-30000)<1e-8);
 assert.equal(travelDuration(AU),3000);
 assert.equal(travelDuration(-AU),3000);
 assert.equal(travelDuration(0),0);
});
test('travel timing grows smoothly while compressing larger distances',()=>{
 const distances=[0,.000001,.1,.2767,.99,1,1.01,5.2,30,600,805];
 const durations=distances.map(d=>travelDuration(d*AU));
 durations.forEach((t,i)=>{assert.ok(Number.isFinite(t));if(i)assert.ok(t>durations[i-1]);});
 assert.ok(travelDuration(.2767*AU)>1000,'Earth–Venus remains visible for about a second');
 assert.ok(travelDuration(30*AU)>15000&&travelDuration(30*AU)<17000);
 assert.ok(travelDuration(1.01*AU)-travelDuration(.99*AU)<100,'no discontinuity at Earth distance');
 assert.ok(travelDuration(600*AU)-travelDuration(599*AU)<travelDuration(2*AU)-travelDuration(AU));
});
test('a rapid finger swipe launches momentum in the swipe direction',()=>{
 const samples=[{y:500,time:0},{y:400,time:30},{y:200,time:80}];
 assert.equal(flingVelocity(samples,90),3.75);
 assert.equal(flingVelocity(samples.map(s=>({...s,y:700-s.y})),90),-3.75);
 assert.equal(flingVelocity(samples,200),0,'holding still before release cancels momentum');
 assert.equal(flingVelocity([],90),0,'pinching must not launch a fling');
});
test('momentum coasts for several screens, then decays regardless of frame rate',()=>{
 const one=momentumStep(4,1000);let v=4,d=0;
 for(let i=0;i<100;i++){const step=momentumStep(v,10);v=step.velocity;d+=step.distance;}
 assert.ok(one.distance>2000&&one.distance<3000);
 assert.ok(Math.abs(d-one.distance)<1e-8);assert.ok(Math.abs(v-one.velocity)<1e-10);
 assert.ok(momentumStep(4,5000).velocity<.015);
});
test('stars move exactly as far as planets on scroll at every zoom',()=>{
 for(const zoom of [.025,1,4]){const camera=AU,shift=120/(BASE*zoom),span=1600;
 const origin=starPosition(camera*BASE*zoom,0,span)+600;
 const starBefore=starPosition(origin,camera*BASE*zoom,span),starAfter=starPosition(origin,(camera+shift)*BASE*zoom,span);
 const planetDelta=screenY(AU,camera+shift,zoom,667)-screenY(AU,camera,zoom,667);
 assert.ok(Math.abs(starAfter-starBefore+120)<1e-6);assert.ok(Math.abs(starAfter-starBefore-planetDelta)<1e-6);
 }
});
