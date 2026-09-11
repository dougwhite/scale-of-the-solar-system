# Scale of the Solar System

A local, mobile-friendly journey through the solar system with one linear scale for both diameters and distances. No build step, framework, runtime dependencies, account, or external asset requests. Node.js 20 or newer is required.

## Run

- Linux/macOS: run `bash start.sh` (or `./start.sh`).
- Windows: double-click `start.bat`.
- Alternatively: `npm install`, then `npm start`.

The launcher runs npm install, then binds to `0.0.0.0` on an operating-system-assigned free port. Open the printed **Network** URL on your phone, connected to the same LAN/Wi-Fi. Keep the computer awake and server running. If prompted by Windows Firewall, allow Node on your private network. Guest Wi-Fi/client isolation can prevent devices from connecting. Ctrl+C stops the server. Restarting normally chooses a new port. An optional `PORT` environment variable fixes the port.

## Explore

Earth starts centered at 88 CSS pixels in diameter, roughly a ten-cent coin on an iPhone mini (physical size depends on device/browser scaling). Drag, swipe, or use the mouse wheel to move along the radial distance axis. Fast finger swipes coast using release velocity sampled over the last 100 milliseconds, then slow with an 850 ms exponential time constant. Touching the background stops the momentum immediately. Stars and belt guide particles move 1:1 with the scene, with no parallax. Up goes toward Sol; down goes outward. Arrows and side dots make animated journeys to destinations. Automatic journey timing is logarithmically compressed, independent of zoom: a 1 AU journey (Sol–Earth) takes 3 seconds, and a 600 AU journey (Sol–Planet X) takes 30 seconds. The formula is `3000 * log1p(k * abs(distanceKm) / AU) / log1p(k)` milliseconds, with `k = 0.8700469380758735`, calibrated to both anchors. It is continuous at zero and symmetric in either direction. Each journey reserves at most 15% of its existing duration for brief flybys through viewport-sized windows around worlds (about 120 milliseconds per full crossing when the budget allows). The remaining time is distributed across the empty gaps by distance. Monotone cubic Hermite interpolation joins the segments with shared nonzero velocities, so the camera no longer brakes to a stop at each window. Only the overall departure and arrival use zero endpoint velocity. Windows account for zoom, viewport height, body radius and Saturn’s rings; overlapping windows are merged. Departure and arrival receive proportional partial windows. The travel panel remains visible throughout the flight; passing-world names and info buttons appear only after travel stops. Tap the background to interrupt a journey and inspect a visible world. Adjusting zoom also stops the flight to give manual control. Only animation time is compressed; planet sizes, positions, zoom and manual scrolling retain their true linear scale. Skip to arrival is available while travelling. Tap the background, scroll, or drag to interrupt a journey. There is a gentle attraction only within 34 pixels of a center after input stops.

Pinch or use the logarithmic zoom slider, + and −. **Fit object** centers and scales a body to fit the viewport, including Saturn's rings. The home button returns to Earth at the starting scale. Keyboard: Up/Down or Page Up/Page Down travel between objects, Home/End visit the endpoints, +/− zoom, Escape stops travel. System reduced-motion preferences disable travel animations. The planet name and ? control open a scrollable native modal with size, distance and a fact. The dynamic kilometres-per-pixel readout and the one-scale explanation are inside the top-right i popup. There is no audio feature or bundled audio.

## The model

Positions use average orbital distances (semi-major axes), laid out on a straight line, not live orbital positions. `dist/data.js` stores all data. One AU is 149,597,870.7 km. At zoom 1, every pixel represents 12,756 / 88 km. Zoom changes distances and sizes by exactly the same factor. A virtual camera avoids browser scroll-height limits and huge DOM elements. Canvas renders only visible planets and projects bundled equirectangular maps into cached sphere textures. At extremely small sizes, a faint 6px locator ring helps find subpixel bodies; the body itself remains to scale.

The asteroid belt spans approximately 2.2–3.2 AU; the main Kuiper belt 30–50 AU. These are broad schematic regions, shown with labelled radial edge lines. Belt details are in the small-body popups; there is no persistent progress indicator. The distances to cross remain to scale. No opaque blue strip covers the scene. Belt guide particles and background stars have illustrative sizes and density. Gaspra and Arrokoth are represented in the scene by one-pixel location markers with small locator rings. Their photos appear only in their information modals, alongside physical sizes and true pixel lengths at the current zoom. Neither is claimed to be statistically average-sized. The belt navigation stops are at the approximate mean orbital distances of Gaspra (2.21 AU) and Arrokoth (44.6 AU), using rounded NASA values. They are not live ephemeris positions. Sources: https://ntrs.nasa.gov/api/citations/20060018419/downloads/20060018419.pdf and https://science.nasa.gov/solar-system/kuiper-belt/arrokoth-2014-mu69/facts/. Planet X is an unconfirmed hypothesis. Its black sphere, blue outline and question mark are at an illustrative 600 AU, with a 400–800 AU proposed semi-major-axis range based on the 2019 Planet Nine hypothesis, not a measured location or full orbital range. The displayed diameter is approximately 29,339 km (2.3 Earth diameters), the midpoint of the 2.0–2.6 Earth-diameter model range in Russell & White (2025), https://arxiv.org/abs/2507.22297. This estimate is not an observation or a unique agreed size. The model ends just past this band; the solar system extends much farther.

Sources are linked inside the ? panel: NASA Science, JPL planetary physical parameters, and Batygin et al., *The Planet Nine Hypothesis* (2019), https://arxiv.org/abs/1902.10103.

## Credits

Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune maps: [Solar System Scope](https://www.solarsystemscope.com/textures/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Bundled from their 2k JPG texture downloads; globe projection and lighting added by this app. The Earth map is `2k_earth_daymap.jpg`, Venus is `2k_venus_atmosphere.jpg`, and the other names follow `2k_<body>.jpg`.

Pluto map: [NASA/JHUAPL/SwRI, Pluto Global Color Map](https://science.nasa.gov/resource/pluto-global-color-map/). Black parts are regions without mapped data. Small-body photos: [Gaspra, Highest Resolution Mosaic](https://www.jpl.nasa.gov/images/pia00118-gaspra-highest-resolution-mosaic/), NASA/JPL; approximately 19 × 12 × 11 km. [Arrokoth](https://science.nasa.gov/resource/kuiper-belt-object-arrokoth-2014-mu69/), NASA/Johns Hopkins APL/SwRI; approximately 35 × 20 × 10 km. Photographs are displayed in the detail modals only.

All media are bundled in `dist/assets`; there is no runtime CDN dependency.

## Checks

`npm run check` validates JavaScript syntax. `npm test` checks scale invariants, ordering, clipping bounds, 1:1 star travel, swipe momentum and HTTP serving, including static assets, removed audio and traversal rejection. Travel timing checks cover both reference durations, continuity, monotonicity and compression of longer trips. Tests bind only loopback on a random port. Windows launcher is supplied but needs Windows for an actual execution check. Real-device appearance should be checked on your phone.

Only the `dist` folder is exposed by the server; source scripts and other local files are not served.

## Voyager 1

Voyager 1 is a one-pixel location marker with a small locator ring at 171.722 AU from the Sun, between Arrokoth and the illustrative Planet X. This is a fixed snapshot from NASA’s Voyager tracker on 11 September 2026, not a live position or an average orbit. Only radial distance is represented; the probe does not lie on the same line as the planets. Its popup reports the 3.7 m high-gain antenna diameter, not an overall spacecraft diameter, and distinguishes the visible marker from physical scale. Navigation and travel use the same distance scale and timing as the other destinations.

Sources: [NASA distance tracker](https://science.nasa.gov/specials/apps/voyager-vital-signs/table/), [mission history](https://science.nasa.gov/mission/voyager/voyager-1/), [spacecraft dimensions](https://science.nasa.gov/mission/voyager/spacecraft/).

## Visual-only Moon

The Moon is drawn at its true relative size (mean diameter 3,474.8 km), 384,400 km beyond Earth’s centre in the Mars direction. This is an illustrative alignment, not a live orbital position. It is intentionally absent from the destination list, information popups, snapping and flyby timing. No locator ring enlarges its appearance when zoomed out. Navigation and the fixed side rail match the main version. Texture: Solar System Scope, CC BY 4.0; see the third-party notices.
