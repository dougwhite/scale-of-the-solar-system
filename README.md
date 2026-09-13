# Scale of the Solar System

**A small experiment in feeling a very large distance.**

Start with Earth about the size of a coin on your phone. Let it drift out of view. The next world takes longer to arrive than you expect. There is no missing illustration in the gap. That is the illustration.

**[Explore the solar system](https://dougwhite.github.io/scale-of-the-solar-system/)** · **[Download a self-hosted copy](https://github.com/dougwhite/scale-of-the-solar-system/releases/latest)**

## The experience

- One linear scale for the sizes of worlds and the distances between them, at every zoom level.
- Touch-friendly scrolling with momentum, plus mouse and keyboard navigation.
- Animated journeys with logarithmic travel timing and brief planetary flybys.
- Pinch zoom and a “Fit object” control for the Sun and giant planets.
- Planet facts, spacecraft imagery, the asteroid and Kuiper belts, Pluto, and a clearly hypothetical Planet X.
- A quiet, minimalist interface. No audio, accounts or ads. Images are bundled locally; the official hosted version uses Cloudflare Web Analytics (see below).

Designed for phones, tablets and desktop browsers. The starting Earth is 88 CSS pixels across, roughly a ten-cent coin on an iPhone mini; physical size varies with the device and browser settings.

## For educators

Use it as a conversation starter about scale, empty space, scientific models and the limits of human intuition. Open the **i** panel for “Mostly, it’s space,” a short reflection on the journey. Each world's **?** opens its details and image credits.

The code and original text are **MIT-licensed**, including for adaptation and commercial use under that licence. Third-party images retain their own terms: Solar System Scope textures use **CC BY 4.0**, and NASA mission images retain their source credits and applicable media-use terms. Keep the [licence](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md) with redistributed copies.

See [the educator handoff](docs/share-with-an-educator.md) for a short introduction and classroom discussion prompts.

## Run it yourself

Install [Node.js](https://nodejs.org/) version 20 or newer, then download and extract a release or clone this repository:

```bash
git clone git@github.com:dougwhite/scale-of-the-solar-system.git
cd scale-of-the-solar-system
```

- **Linux/macOS:** run `bash start.sh`.
- **Windows:** double-click `start.bat`.
- **Any platform:** run `npm install`, then `npm start`.

The launcher installs dependencies (there are currently no external runtime packages) and starts the server on a randomly selected available port. Open the printed **Network** URL from a phone on the same Wi-Fi. Keep the computer awake and the terminal open; Ctrl+C stops it. Allow Node on your private network if your firewall asks. Guest-network isolation may prevent phone access.

A restart normally chooses a new port. Set the `PORT` environment variable if you need a fixed one. Opening `index.html` directly from disk is not supported because the app uses JavaScript modules; serve it over HTTP.

## Host it anywhere

The complete website is the **`dist/` directory**. It needs only static file hosting—no database, backend, build step or ongoing Node process on the public host. All imagery is included. Relative asset paths support both domain roots and project subdirectories.

This repository publishes `dist/` to GitHub Pages after checks pass on `main`. In a fork, enable **Settings → Pages → GitHub Actions**, then run the **Check and publish site** workflow. Update the live-site links in the README and package metadata for your account.

You can also upload the contents of `dist/` to Neocities, Cloudflare Pages or another static host. Keep the in-app asset attributions and distribute the licence notices with source copies. Hosting providers have their own terms; this app does not require one particular service.

## A note on scientific scale

The worlds are arranged along a line by approximate average orbital distance, not their positions in the sky today. Diameters and belt boundaries are rounded. The same linear scale governs body sizes, distances and manual movement.

Automatic **travel time** is compressed: Sol–Earth takes 3 seconds, while Sol–Planet X takes 30 seconds. The visual distances do not shrink. Background stars, belt guide particles and the small-body locator markers are illustrative. Gaspra and Arrokoth photos appear only in their detail popups.

Planet X is **not a discovery**: the 600 AU location and 2.3-Earth-diameter sphere illustrate published hypotheses. The solar system extends much farther than this model's final marker.

[Read the detailed model and implementation notes](docs/model.md) · [Scientific references and image credits](THIRD_PARTY_NOTICES.md)

## Development

Plain HTML, CSS and browser JavaScript; a small Node HTTP server is included for local use.

```bash
npm run check
npm test
```

Checks cover scale invariants, travel timing and continuity, flyby visibility, swipe momentum, static-host path compatibility and HTTP serving boundaries. The Windows launcher is supplied but has not been executed on Windows. The experience was iterated with feedback from use on an iPhone mini; browser/device differences may still occur.

- `dist/index.html` — interface, reflection and attributions
- `dist/style.css` — responsive presentation
- `dist/data.js` — physical sizes and orbital distances
- `dist/motion.js` — scrolling and journey timing
- `dist/app.js` — canvas rendering and interaction
- `server.mjs` — optional local network server

## Credits

A scientific imagination experiment developed with **GPT-6 Astra**.

Planet textures: **Solar System Scope**, CC BY 4.0. Mission imagery: **NASA/JPL/JHUAPL/SwRI**, with the individual credits preserved in the app and [third-party notices](THIRD_PARTY_NOTICES.md). Scientific references include NASA Science, JPL and the linked Planet Nine research. This is an independent project, not an endorsed NASA resource.

## Support

[Support my expensive LLM habit ☕](https://buymeacoffee.com/dougwhite)

## Note from Me

Everything you see in this repo, all code and text... everything apart from this section here (and the third party image assets) was authored entirely by GPT-6 Astra as a test of it's capabilities and the ChatGPT desktop experience. It's really quite impressive how far the technology has come. Please feel free to use this resource however you see fit, simply keeping in mind the copyright/attribution requirements of the third party assets. 

## Analytics and privacy

Only `https://dougwhite.github.io/scale-of-the-solar-system/` loads Cloudflare Web Analytics, for views, referrers and page-performance measurements. Cloudflare states that Web Analytics uses no cookies, localStorage, individual fingerprinting or cross-site tracking. The in-app information panel links to the [privacy disclosure](https://thingsdougmakes.au/privacy/).

`dist/analytics.js` limits loading to the official HTTPS hostname and project path. Local servers, downloaded copies, forks, other GitHub Pages projects and itch.io uploads do not load the beacon. The token is a public analytics identifier, not an account credential. Blocking analytics does not affect the app.
