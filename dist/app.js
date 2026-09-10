import {AU,BASE,objects,kmAt,pixelsPerKm,screenY,nearestIndex,clampCamera} from './data.js';
import {flingVelocity,momentumStep,starPosition,createTravelPlan,travelPosition} from './motion.js';
const $=id=>document.getElementById(id), canvas=$('space'), ctx=canvas.getContext('2d',{alpha:false});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let w=innerWidth,h=innerHeight,dpr=1,camera=AU,zoom=1,velocity=0,flight=null,lastTime=0,lastInput=0,active=-1,dirty=true;
const textures=new Map(), globes=new Map(), pointers=new Map();
let seed=923;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const stars=Array.from({length:260},()=>({x:random(),y:random(),r:random()*1.05+.2,alpha:random()*.55+.12}));
const facts=objects.map(o=>o.facts[Math.floor(Math.random()*o.facts.length)]);
function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);if(flight){const now=performance.now();flight={...createTravelPlan(camera,flight.to,zoom,h,Math.max(0,flight.duration-(now-flight.start))),start:now,index:flight.index};}dirty=true;}
addEventListener('resize',resize);resize();
// Project equirectangular texture maps onto spheres once; no external 3D library needed.
function globe(img,o){
 const s=768, source=document.createElement('canvas');source.width=img.width;source.height=img.height;const sc=source.getContext('2d',{willReadFrequently:true});sc.drawImage(img,0,0);const tex=sc.getImageData(0,0,img.width,img.height).data;
 const out=document.createElement('canvas');out.width=out.height=s;const oc=out.getContext('2d'), pixels=oc.createImageData(s,s);
 for(let y=0;y<s;y++)for(let x=0;x<s;x++){
  const nx=(x+.5-s/2)/(s/2),ny=(y+.5-s/2)/(s/2),rr=nx*nx+ny*ny;if(rr>1)continue;
  const nz=Math.sqrt(1-rr), tilt=o.id==='pluto'?.4:.12;
  const yy=ny*Math.cos(tilt)-nz*Math.sin(tilt),zz=ny*Math.sin(tilt)+nz*Math.cos(tilt);
  const lon=Math.atan2(nx,zz)+(o.id==='earth'?1.9:0),lat=Math.asin(Math.max(-1,Math.min(1,yy)));
  const u=Math.floor(((lon/(2*Math.PI)+.5)%1+1)%1*img.width),v=Math.min(img.height-1,Math.floor((lat/Math.PI+.5)*img.height));
  const ti=(v*img.width+u)*4,i=(y*s+x)*4;
  const light=o.id==='sun'?.92:Math.max(.045,Math.min(1,-nx*.42-ny*.27+nz*.85));
  for(let c=0;c<3;c++)pixels.data[i+c]=tex[ti+c]*light;
  pixels.data[i+3]=Math.min(255,(1-rr)*s*128);
 }
 oc.putImageData(pixels,0,0);return out;
}
for(const o of objects.filter(o=>o.diameter&&!o.hypothetical)){const img=new Image();img.onload=()=>{textures.set(o.id,img);globes.set(o.id,globe(img,o));dirty=true};img.onerror=()=>{$('credits').textContent+=' A texture could not load; reload to retry.'};img.src=`./assets/${o.id}.jpg`;}
const specimens={
 asteroids:{name:'951 Gaspra',length:19,file:'gaspra.jpg',description:'A small main-belt asteroid, about 19 × 12 × 11 km. This Galileo image is a magnified example, not an average of all asteroids.',credit:'NASA/JPL',source:'https://www.jpl.nasa.gov/images/pia00118-gaspra-highest-resolution-mosaic/'},
 kuiper:{name:'Arrokoth',length:35,file:'arrokoth.png',description:'A small Kuiper belt object, about 35 × 20 × 10 km, formed from two joined lobes. This New Horizons image is a magnified example, not an average of all Kuiper belt objects.',credit:'NASA/Johns Hopkins APL/SwRI',source:'https://science.nasa.gov/resource/kuiper-belt-object-arrokoth-2014-mu69/'}
};
function drawSpecimen(o,y){
 if(y<0||y>h)return;
 ctx.save();ctx.fillStyle=o.color;ctx.fillRect(w/2-.5,y-.5,1,1);
 ctx.strokeStyle=o.color+'88';ctx.lineWidth=.7;ctx.beginPath();ctx.arc(w/2,y,6,0,Math.PI*2);ctx.stroke();ctx.restore();
}
function drawPlanet(o,y){
 const diameter=o.diameter*pixelsPerKm(zoom),r=diameter/2,x=w/2;
 if(y+r*2<0||y-r*2>h)return;
 ctx.save();
 if(o.hypothetical){
  ctx.fillStyle='#000';ctx.strokeStyle='#7abaff';ctx.lineWidth=1.5;ctx.shadowColor='#539bdf';ctx.shadowBlur=12;
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
  ctx.fillStyle='#9dcdff';ctx.font=`${Math.max(1,r*.85)}px Georgia`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('?',x,y);ctx.restore();return;
 }
 if(o.id==='sun'){const halo=ctx.createRadialGradient(x,y,r*.92,x,y,r*1.2);halo.addColorStop(0,'#ffae462d');halo.addColorStop(1,'#ff8c0000');ctx.fillStyle=halo;ctx.fillRect(x-r*1.2,y-r*1.2,r*2.4,r*2.4);}
 if(o.id==='earth'||o.id==='neptune'){ctx.shadowColor=o.color;ctx.shadowBlur=Math.min(r*.2,14);ctx.fillStyle=o.color;ctx.beginPath();ctx.arc(x,y,r*.985,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
 if(o.id==='saturn')drawRings(x,y,r,false);
 const map=globes.get(o.id);
 if(map)ctx.drawImage(map,x-r,y-r,diameter,diameter);else{ctx.fillStyle=o.color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
 if(o.id==='saturn')drawRings(x,y,r,true);
 if(diameter<4){ctx.strokeStyle=o.color+'66';ctx.lineWidth=.6;ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.stroke();}
 ctx.restore();
}
function drawRings(x,y,r,front){ctx.save();ctx.translate(x,y);ctx.rotate(-.36);ctx.scale(1,.32);ctx.lineWidth=r*.19;for(let i=0;i<5;i++){ctx.strokeStyle=['#af9d7470','#d4c29980','#a3947770','#8b806448','#c5b38e70'][i];ctx.beginPath();ctx.arc(0,0,r*(1.25+i*.2),front?0:Math.PI,front?Math.PI:Math.PI*2);ctx.stroke();}ctx.restore();}
function draw(){
 ctx.fillStyle='#03070e';ctx.fillRect(0,0,w,h);
 const bg=ctx.createRadialGradient(w*.5,h*.43,0,w*.5,h*.45,Math.max(w,h)*.7);bg.addColorStop(0,'#0a192733');bg.addColorStop(1,'#03070e00');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 for(const s of stars){const span=Math.max(1600,h*2),yy=starPosition(s.y*span,camera*BASE*zoom,span);if(yy>h)continue;ctx.fillStyle=`rgba(179,207,230,${s.alpha})`;ctx.beginPath();ctx.arc(s.x*w,yy,s.r,0,Math.PI*2);ctx.fill();}
 for(const o of objects.filter(o=>o.range)){
  const a=screenY(o.range[0]*AU,camera,zoom,h),b=screenY(o.range[1]*AU,camera,zoom,h);if(b<0||a>h)continue;
  ctx.save();ctx.beginPath();ctx.rect(0,Math.max(0,a),w,Math.min(h,b)-Math.max(0,a));ctx.clip();
  if(!o.hypothetical)for(let i=0;i<90;i++){const xx=(Math.sin(i*77.8)*.5+.5)*w,yy=starPosition(i*129.7,camera*BASE*zoom,h);ctx.fillStyle=o.id==='kuiper'?'#b8d4e52b':'#dac6ac30';ctx.fillRect(xx,yy,1.3,1.3);}
  ctx.restore();
  if(!o.hypothetical)for(const [edgeY,label] of [[a,`INNER EDGE · ${o.range[0]} AU`],[b,`OUTER EDGE · ${o.range[1]} AU`]]){
   if(edgeY<0||edgeY>h)continue;
   ctx.strokeStyle=o.color+'55';ctx.lineWidth=1;ctx.setLineDash([2,8]);ctx.beginPath();ctx.moveTo(24,edgeY);ctx.lineTo(w-55,edgeY);ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle=o.color;ctx.font='11px Arial';ctx.textAlign='center';ctx.fillText(label,w/2,edgeY-16);
  }
 }
 for(const o of objects){const y=screenY(kmAt(o),camera,zoom,h);if(o.diameter)drawPlanet(o,y);else drawSpecimen(o,y);}

}
const buttons=objects.map((o,i)=>{const b=document.createElement('button');b.className='stop'+(o.range?' belt':'');const label=o.range&&!o.hypothetical?`${o.id==='asteroids'?'Asteroid belt':'Kuiper belt'} · ${o.name}`:o.name;b.setAttribute('aria-label',`Travel to ${label}`);b.innerHTML=`<span>${label}</span>`;b.onclick=()=>go(i);$('rail').append(b);return b;});
function currentVisible(i){const o=objects[i],delta=Math.abs(screenY(kmAt(o),camera,zoom,h)-h/2);return delta<h/2+(o.diameter||0)*pixelsPerKm(zoom)/2;}
function ui(){
 let idx=nearestIndex(camera);const visibleIndex=objects.findIndex((o,i)=>currentVisible(i));if(visibleIndex>=0)idx=visibleIndex;
 const o=objects[idx],visible=currentVisible(idx)&&!flight,specimen=specimens[o.id];
 $('object-label').hidden=!visible;$('travel').hidden=visible;$('skip-travel').hidden=!flight;
 if(idx!==active){active=idx;$('name').textContent=o.name;$('label-name').textContent=o.name;$('object-info').setAttribute('aria-label',`About ${o.name}`);$('kind').textContent=o.kind;$('number').textContent=o.spacecraft?'↗':o.range?'∴':o.id==='sun'?'☉':String(objects.filter(p=>p.diameter).indexOf(o)).padStart(2,'0');$('size-label').textContent=o.spacecraft?'ANTENNA DIAMETER':o.hypothetical?'ILLUSTRATIVE DIAMETER':specimen?'APPROXIMATE LENGTH':'EQUATORIAL DIAMETER';$('size').textContent=o.spacecraft?'3.7 m':o.hypothetical?'≈29,339 km · 2.3 Earths':specimen?`${specimen.length} km`:`${o.diameter.toLocaleString()} km`;$('distance-label').textContent=o.spacecraft?'DISTANCE FROM SOL':o.hypothetical?'ILLUSTRATIVE LOCATION':'MEAN DISTANCE FROM SOL';$('sol').textContent=o.id==='sun'?'0 km':o.hypothetical?'600 AU (possible)':`${o.au.toLocaleString(undefined,{maximumFractionDigits:3})} AU`;$('fact').textContent=facts[idx];
 $('specimen-detail').hidden=!specimen;
 if(specimen){$('specimen-image').src='./assets/'+specimen.file;$('specimen-image').alt=specimen.name+' photographed by spacecraft';$('specimen-caption').textContent=specimen.description;$('object-note').innerHTML=`${o.id==='asteroids'?'Asteroid belt':'Kuiper belt'}: approximately ${o.range[0]}–${o.range[1]} AU from Sol, spanning ${o.range[1]-o.range[0]} AU. The marker is at ${o.name}’s approximate mean orbital distance, not a live position. Photo: <a href="${specimen.source}" target="_blank" rel="noreferrer">${specimen.credit}</a>. At this zoom, a ${specimen.length} km body is ${(specimen.length*pixelsPerKm(zoom)).toFixed(2)} pixels long. The scene uses a one-pixel location marker and a small locator ring; the photograph is shown only here.`;}
 else if(o.spacecraft)$('object-note').innerHTML=`The farthest human-made object, approximately ${(o.au*AU/1e9).toFixed(1)} billion km from Sol. Distance snapshot: ${o.distanceDate}, from <a href="https://science.nasa.gov/specials/apps/voyager-vital-signs/table/" target="_blank" rel="noreferrer">NASA’s Voyager tracker</a>; this marker does not update live. At that date, a radio signal took about 23 hours 48 minutes to reach Earth. After 49 years of travel, it had reached only about 29% of our illustrative Planet X distance. The point and locator ring show its radial distance, not its physical size or actual direction of travel. Its 3.7 m antenna would be far smaller than a pixel here. <a href="https://science.nasa.gov/mission/voyager/voyager-1/" target="_blank" rel="noreferrer">NASA mission history</a> · <a href="https://science.nasa.gov/mission/voyager/spacecraft/" target="_blank" rel="noreferrer">Spacecraft dimensions</a>.`;
 else if(o.hypothetical)$('object-note').innerHTML='A proposed size, not a measurement. This sphere uses the midpoint of the 2.0–2.6 Earth-diameter range in <a href="https://arxiv.org/abs/2507.22297" target="_blank" rel="noreferrer">Russell & White (2025)</a>. The illustrative 600 AU position is not a known location.';
 else $('object-note').textContent=o.id==='sun'?'Sol is the Sun. Its diameter is rounded.':`Approximately ${(o.au*AU/1e6).toLocaleString(undefined,{maximumFractionDigits:1})} million km from Sol on average. Actual orbital distance varies.`;
 }
 buttons.forEach((b,i)=>b.setAttribute('aria-current',String(i===idx&&visible)));
 const prev=previous(),next=following();$('prev').disabled=prev<0;$('next').disabled=next>=objects.length;$('prev-label').textContent=prev<0?'Sol':objects[prev].name;$('next-label').textContent=next>=objects.length?'Beyond':objects[next].name;
 $('distance').textContent=Math.max(0,camera/AU).toLocaleString(undefined,{minimumFractionDigits:3,maximumFractionDigits:3});
 $('region').textContent=camera<2.2*AU?'THE INNER SOLAR SYSTEM':camera<3.2*AU?'THE ASTEROID BELT':camera<30*AU?'THE OUTER SOLAR SYSTEM':camera<50*AU?'THE KUIPER BELT':camera<400*AU?'THE DISTANT SOLAR SYSTEM':'A HYPOTHETICAL FRONTIER';
 const target=flight?objects[flight.index]:o;$('travel-title').textContent=flight?`Travelling to ${target.name}`:'A little world. A lot of space.';
 const screens=Math.abs((flight?flight.to:kmAt(target))-camera)*pixelsPerKm(zoom)/h;$('remaining').textContent=`${screens.toLocaleString(undefined,{maximumFractionDigits:0})} screenfuls to ${target.name}${flight?' · tap space to stop':''}`;
 $('zoom-label').textContent=`${zoom.toFixed(zoom<.1?3:2).replace(/0+$/,'').replace(/\.$/,'')}×`;$('zoom').value=Math.log(zoom);$('scale-text').textContent=`1 PIXEL ≈ ${Math.round(1/pixelsPerKm(zoom)).toLocaleString()} KM`;
}
function previous(){return objects.findLastIndex(o=>kmAt(o)<camera-2/pixelsPerKm(zoom));}
function following(){const i=objects.findIndex(o=>kmAt(o)>camera+2/pixelsPerKm(zoom));return i<0?objects.length:i;}
function go(index,to=kmAt(objects[index]||objects[0])){if(index<0||index>=objects.length)return;velocity=0;lastInput=performance.now();if(reduced.matches||to===camera){camera=to;flight=null;}else flight={...createTravelPlan(camera,to,zoom,h),start:performance.now(),index};dirty=true;}
function stop(){flight=null;velocity=0;lastInput=performance.now();dirty=true;}
function setZoom(z){stop();zoom=Math.max(Math.exp(-4.6),Math.min(Math.exp(1.39),z));velocity=0;lastInput=performance.now();dirty=true;}
function shift(px){camera=clampCamera(camera+px/pixelsPerKm(zoom));lastInput=performance.now();dirty=true;}
canvas.addEventListener('wheel',e=>{e.preventDefault();stop();if(e.ctrlKey)setZoom(zoom*Math.exp(-e.deltaY*.008));else shift(e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?h:1));},{passive:false});
let pinch=0,pinchZoom=1,swipeSamples=[];
canvas.addEventListener('pointerdown',e=>{stop();canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});swipeSamples=[{y:e.clientY,time:performance.now()}];if(pointers.size===2){const [a,b]=[...pointers.values()];pinch=Math.hypot(a.x-b.x,a.y-b.y);pinchZoom=zoom;}});
canvas.addEventListener('pointermove',e=>{
 if(!pointers.has(e.pointerId))return;
 const old=pointers.get(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const now=performance.now();
 if(pointers.size===2){const [a,b]=[...pointers.values()];if(pinch>0)setZoom(pinchZoom*Math.hypot(a.x-b.x,a.y-b.y)/pinch);swipeSamples=[];}
 else{shift(old.y-e.clientY);swipeSamples.push({y:e.clientY,time:now});swipeSamples=swipeSamples.filter(s=>now-s.time<=140);}
});
function release(e){
 const now=performance.now();pointers.delete(e.pointerId);lastInput=now;
 velocity=pointers.size?0:flingVelocity(swipeSamples,now);swipeSamples=[];
}
canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',e=>{release(e);velocity=0;});
$('prev').onclick=()=>go(previous());$('next').onclick=()=>go(following());$('zoom').oninput=e=>setZoom(Math.exp(Number(e.target.value)));$('zoom-in').onclick=()=>setZoom(zoom*1.5);$('zoom-out').onclick=()=>setZoom(zoom/1.5);
$('fit').onclick=()=>{const o=objects[active];if(o.diameter){setZoom(Math.min(1,(Math.min(w-92,h*.4))/(o.diameter*BASE*(o.id==='saturn'?2.3:1))));}go(active);};
$('skip-travel').onclick=()=>{if(!flight)return;camera=flight.to;flight=null;velocity=0;lastInput=performance.now();dirty=true;};
$('home').onclick=()=>{setZoom(1);go(3);};
addEventListener('keydown',e=>{if($('info').open||$('object-dialog').open||['INPUT','BUTTON','A'].includes(document.activeElement.tagName))return;if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End','+','-','Escape'].includes(e.key))e.preventDefault();if(e.key==='ArrowDown'||e.key==='PageDown')go(following());if(e.key==='ArrowUp'||e.key==='PageUp')go(previous());if(e.key==='Home')go(0);if(e.key==='End')go(objects.length-1);if(e.key==='+')setZoom(zoom*1.5);if(e.key==='-')setZoom(zoom/1.5);if(e.key==='Escape')stop();});
$('object-info').onclick=()=>{stop();active=-1;ui();$('object-dialog').showModal()};
$('close-object').onclick=()=>$('object-dialog').close();
for(const id of ['info','object-dialog'])$(id).addEventListener('click',e=>{if(e.target!==$(id))return;const r=$(id).getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$(id).close();});
$('about').onclick=()=>{stop();$('info').showModal()};$('close-info').onclick=()=>$('info').close();
document.addEventListener('visibilitychange',()=>{if(document.hidden)velocity=0;lastTime=0;});
function frame(now){const dt=Math.min(32,now-(lastTime||now));lastTime=now;
 if(flight){camera=travelPosition(flight,now-flight.start);dirty=true;if(now-flight.start>=flight.duration){camera=flight.to;flight=null;}}
 else if(!pointers.size&&Math.abs(velocity)>.015){const step=momentumStep(velocity,dt),before=camera;shift(step.distance);velocity=camera===before?0:step.velocity;}
 else if(!pointers.size&&!$('object-dialog').open&&!$('info').open&&now-lastInput>230){const o=objects[nearestIndex(camera)],d=(kmAt(o)-camera)*pixelsPerKm(zoom);if(Math.abs(d)<34&&Math.abs(d)>.05){camera+=d*.07/pixelsPerKm(zoom);dirty=true;}}
 if(dirty){draw();ui();dirty=false;}requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
