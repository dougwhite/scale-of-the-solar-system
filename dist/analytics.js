// Only the official hosted app reports views. Downloads, forks and previews stay offline.
if (location.protocol === 'https:' && location.hostname === 'dougwhite.github.io' &&
    location.pathname.startsWith('/scale-of-the-solar-system/')) {
  const beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.setAttribute('data-cf-beacon', JSON.stringify({token: '69b09af61f3b4d0fa8cc39d58c5a4397'}));
  document.head.appendChild(beacon);
}
