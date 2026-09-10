import {AU,objects,kmAt,pixelsPerKm} from './data.js';
// Velocities are screen pixels per millisecond, independent of the world scale.
export function flingVelocity(samples, now) {
  if (samples.length < 2 || now - samples.at(-1).time > 80) return 0;
  const end = samples.at(-1);
  const start = samples.find(s => end.time - s.time <= 100) || samples[0];
  const elapsed = end.time - start.time;
  return elapsed >= 8 ? Math.max(-7, Math.min(7, (start.y - end.y) / elapsed)) : 0;
}
export function momentumStep(velocity, elapsed) {
  const decay = Math.exp(-elapsed / 850);
  return { distance: velocity * 850 * (1 - decay), velocity: velocity * decay };
}
export function starPosition(origin, cameraPixels, span) {
  return ((origin - cameraPixels) % span + span) % span;
}

// Compress animation time only, not positions or physical size.
// log(1 + 600*k) / log(1 + k) = 10 gives the two timing anchors:
// 1 AU -> 3 seconds; 600 AU -> 30 seconds. log1p is smooth down to zero.
const TRAVEL_CURVE = 0.8700469380758735;
export const travelDuration = distanceKm =>
  3000 * Math.log1p(TRAVEL_CURVE * Math.abs(distanceKm) / AU) / Math.log1p(TRAVEL_CURVE);

// Reserve time for visible worlds, and spend the rest crossing the empty gaps.
// Windows use the actual viewport and scaled radius, including Saturn's rings.
export function createTravelPlan(from,to,zoom,height,duration=travelDuration(to-from)) {
  const direction=Math.sign(to-from),distance=Math.abs(to-from),scale=pixelsPerKm(zoom);
  if(!distance||duration<=0)return {from,to,duration:0,segments:[]};
  const windows=objects.map(o=>{
    const center=(kmAt(o)-from)*direction;
    // Match the vertical extent of the renderer's tilted, flattened rings.
    const ringHeight=o.id==='saturn'?Math.max(1,2.3*Math.hypot(Math.sin(.36),.32*Math.cos(.36))):1;
    const radius=(o.diameter||0)/2*ringHeight;
    const half=height/2/scale+radius;
    const start=Math.max(0,center-half),end=Math.min(distance,center+half);
    return {start,end,weight:(end-start)/(2*half)};
  }).filter(w=>w.end>w.start).sort((a,b)=>a.start-b.start);
  const merged=[];
  for(const window of windows){
    const previous=merged.at(-1);
    if(previous&&window.start<=previous.end){previous.end=Math.max(previous.end,window.end);previous.weight+=window.weight;}
    else merged.push({...window});
  }
  const visibleDistance=merged.reduce((sum,w)=>sum+w.end-w.start,0);
  const weight=merged.reduce((sum,w)=>sum+w.weight,0),emptyDistance=Math.max(0,distance-visibleDistance);
  const slowTime=emptyDistance===0?duration:Math.min(weight*120,duration*.15);
  const segments=[];let position=0,elapsed=0;
  const add=(start,end,time,slow)=>{
    if(end<=start)return;
    segments.push({from:from+direction*start,to:from+direction*end,start:elapsed,end:elapsed+time,slow});elapsed+=time;
  };
  for(const window of merged){
    if(window.start>position)add(position,window.start,(duration-slowTime)*(window.start-position)/emptyDistance,false);
    add(window.start,window.end,slowTime*window.weight/weight,true);position=window.end;
  }
  if(position<distance)add(position,distance,(duration-slowTime)*(distance-position)/emptyDistance,false);
  // Correct accumulated floating-point error at the final endpoint.
  segments.at(-1).end=duration;
  // Share a nonzero velocity at internal joins: no braking to a stop at each
  // window. Limit the harmonic-mean tangent to keep interpolation monotone.
  const speeds=segments.map(s=>(s.to-s.from)/(s.end-s.start));
  const tangents=[0];
  for(let i=1;i<segments.length;i++){
    const a=Math.abs(speeds[i-1]),b=Math.abs(speeds[i]);
    tangents.push(direction*Math.min(2*a*b/(a+b),1.5*Math.min(a,b)));
  }
  tangents.push(0);
  segments.forEach((s,i)=>{s.startVelocity=tangents[i];s.endVelocity=tangents[i+1];});
  return {from,to,duration,segments};
}

export function travelPosition(plan,elapsed) {
  if(elapsed<=0)return plan.from;
  if(elapsed>=plan.duration)return plan.to;
  const segment=plan.segments.find(s=>elapsed<s.end);
  const t=(elapsed-segment.start)/(segment.end-segment.start);
  const interval=segment.end-segment.start,delta=segment.to-segment.from;
  // Cubic Hermite interpolation preserves the shared velocity at each join.
  return segment.from+delta*t*t*(3-2*t)
    +interval*(segment.startVelocity*t*(t-1)*(t-1)+segment.endVelocity*t*t*(t-1));
}
