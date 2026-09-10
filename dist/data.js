export const AU = 149597870.7;
export const EARTH_DIAMETER = 12756;
export const BASE = 88 / EARTH_DIAMETER;
export const objects = [
 {id:'sun',name:'Sol',kind:'OUR STAR',au:0,diameter:1392700,color:'#ffbb57',facts:['The Sun contains about 99.8% of the mass of the entire solar system.','Sunlight takes about 8 minutes and 20 seconds to reach Earth.']},
 {id:'mercury',name:'Mercury',kind:'TERRESTRIAL PLANET',au:.3871,diameter:4881,color:'#aea59b',facts:['A solar day on Mercury lasts longer than two of its years.','Mercury has almost no atmosphere to hold on to the Sun’s heat.']},
 {id:'venus',name:'Venus',kind:'TERRESTRIAL PLANET',au:.7233,diameter:12104,color:'#d4b381',facts:['Venus spins so slowly that one rotation takes longer than one orbit of the Sun.','Venus is hotter than Mercury, despite being farther from the Sun.']},
 {id:'earth',name:'Earth',kind:'OUR HOME · TERRESTRIAL PLANET',au:1,diameter:12756,color:'#80c4e0',facts:['Every person who has ever lived has called this small world home.','Around 71% of Earth’s surface is covered by ocean.','Earth is the only world where we have confirmed the existence of life.']},
 {id:'mars',name:'Mars',kind:'TERRESTRIAL PLANET',au:1.5237,diameter:6792,color:'#c78261',facts:['Olympus Mons is a volcano about three times the height of Mount Everest.','A day on Mars is only about 40 minutes longer than a day on Earth.']},
 {id:'asteroids',name:'Gaspra',kind:'SMALL ASTEROID · ASTEROID BELT',au:2.21,range:[2.2,3.2],color:'#a09a8d',facts:['Gaspra was the first asteroid photographed up close by a spacecraft, during Galileo’s 1991 flyby.','Even in the asteroid belt, the gaps between rocky bodies are immense.']},
 {id:'jupiter',name:'Jupiter',kind:'GAS GIANT',au:5.2028,diameter:142984,color:'#dfc2a4',facts:['Jupiter’s Great Red Spot is a storm that has raged for centuries.','Jupiter rotates once in about 10 hours, the shortest day of any planet.']},
 {id:'saturn',name:'Saturn',kind:'GAS GIANT',au:9.5388,diameter:120536,color:'#d4c398',facts:['Saturn’s spectacular rings are made mostly of pieces of water ice.','Saturn’s average density is lower than the density of water.']},
 {id:'uranus',name:'Uranus',kind:'ICE GIANT',au:19.1914,diameter:51118,color:'#afd7dc',facts:['Uranus rolls around the Sun on its side, with a tilt of about 98 degrees.','One Uranian year lasts about 84 Earth years.']},
 {id:'neptune',name:'Neptune',kind:'ICE GIANT',au:30.0611,diameter:49528,color:'#658de4',facts:['Neptune was predicted using mathematics before it was found through a telescope.','Neptune takes about 165 Earth years to complete one orbit of the Sun.']},
 {id:'pluto',name:'Pluto',kind:'DWARF PLANET · KUIPER BELT',au:39.482,diameter:2377,color:'#c5b7a5',facts:['Pluto’s largest moon, Charon, is about half as wide as Pluto itself.','Pluto takes about 248 Earth years to circle the Sun.']},
 {id:'kuiper',name:'Arrokoth',kind:'SMALL ICY WORLD · KUIPER BELT',au:44.6,range:[30,50],color:'#8ba9c1',facts:['Arrokoth formed from two small worlds that gently joined together.','New Horizons visited Arrokoth in 2019, after its encounter with Pluto.']},
 {id:'voyager1',name:'Voyager 1',kind:'HUMANITY’S FARTHEST TRAVELLER',au:171.722,spacecraft:true,distanceDate:'11 September 2026',color:'#dfc58b',facts:['Launched on 5 September 1977, Voyager 1 has travelled farther from Earth than any other human-made object.','Voyager 1 carries a Golden Record containing sounds and images from Earth.','Voyager 1 crossed into interstellar space in 2012, beyond the Sun’s protective bubble of solar wind.']},
 {id:'planetx',name:'Planet X?',kind:'HYPOTHETICAL · NOT DISCOVERED',au:600,diameter:29339,diameterEstimate:[25512,33166],range:[400,800],hypothetical:true,color:'#93a6c7',facts:['A 2025 model suggests a diameter of 2.0–2.6 Earths. This sphere shows the midpoint, 2.3 Earths; it remains hypothetical.','Some distant orbits motivated the Planet Nine hypothesis. Its existence remains unconfirmed.']}
];
export const kmAt = o => o.au * AU;
export const pixelsPerKm = zoom => BASE * zoom;
export const screenY = (km,camera,zoom,height) => height/2 + (km-camera)*pixelsPerKm(zoom);
export const nearestIndex = camera => objects.reduce((best,o,i) => Math.abs(kmAt(o)-camera)<Math.abs(kmAt(objects[best])-camera)?i:best,0);
export const clampCamera = km => Math.max(-1392700,Math.min(805*AU,km));
