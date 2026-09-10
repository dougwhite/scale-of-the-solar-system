# Third-party images and scientific sources

The root [MIT licence](LICENSE) covers the project's original code, documentation and prose. It does **not** relicense third-party images. Keep these notices and the in-app attributions when redistributing or adapting the project.

## Solar System Scope textures — CC BY 4.0

Files: `dist/assets/sun.jpg`, `mercury.jpg`, `venus.jpg`, `earth.jpg`, `mars.jpg`, `jupiter.jpg`, `saturn.jpg`, `uranus.jpg`, and `neptune.jpg`.

Credit: **Solar System Scope**. Source: <https://www.solarsystemscope.com/textures/>. Licence: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/).

These are the 2k equirectangular texture downloads, bundled with shorter filenames. Earth uses `2k_earth_daymap.jpg`; Venus uses `2k_venus_atmosphere.jpg`; the other files use `2k_<body>.jpg`. The app projects these maps onto spheres and adds lighting. CC BY 4.0 permits reuse and adaptation, including commercial use, with attribution, a licence link and an indication of changes.

## NASA mission imagery

These images retain their original source credits and are used for educational illustration under [NASA's media guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/). The project is not affiliated with or endorsed by NASA, JPL, Johns Hopkins APL, SwRI or Solar System Scope. NASA imagery is not represented as MIT-licensed.

| Local image | Source | Credit |
| --- | --- | --- |
| `dist/assets/pluto.jpg` | [Pluto Global Color Map](https://science.nasa.gov/resource/pluto-global-color-map/) | NASA/JHUAPL/SwRI |
| `dist/assets/gaspra.jpg` | [Gaspra, Highest Resolution Mosaic](https://www.jpl.nasa.gov/images/pia00118-gaspra-highest-resolution-mosaic/) | NASA/JPL |
| `dist/assets/arrokoth.png` | [Kuiper Belt Object Arrokoth](https://science.nasa.gov/resource/kuiper-belt-object-arrokoth-2014-mu69/) | NASA/Johns Hopkins University Applied Physics Laboratory/Southwest Research Institute |

Pluto's map includes black unmapped areas; the app projects and shades it. Gaspra and Arrokoth photos are displayed in their information popups. They are examples of small bodies, not statistical averages of their populations.

## Scientific references

- [JPL planetary physical parameters](https://ssd.jpl.nasa.gov/planets/phys_par.html)
- [NASA planet sizes and locations](https://science.nasa.gov/solar-system/planet-sizes-and-locations-in-our-solar-system/)
- [NASA Kuiper belt facts](https://science.nasa.gov/solar-system/kuiper-belt/facts/)
- [NASA hypothetical Planet X](https://science.nasa.gov/solar-system/planet-x/)
- [Batygin et al., The Planet Nine Hypothesis (2019)](https://arxiv.org/abs/1902.10103)
- [Russell & White, proposed Planet Nine radius and composition (2025)](https://arxiv.org/abs/2507.22297)
- [NASA technical memorandum containing Gaspra's approximate orbit](https://ntrs.nasa.gov/api/citations/20060018419/downloads/20060018419.pdf)
- [NASA Arrokoth facts](https://science.nasa.gov/solar-system/kuiper-belt/arrokoth-2014-mu69/facts/)

The scientific sources are credited references, not a claim of their endorsement. The model's approximations are described in the app and in [the model notes](docs/model.md).

Voyager 1 marker and mission facts: [NASA live distance tracker](https://science.nasa.gov/specials/apps/voyager-vital-signs/table/) (distance snapshot from 11 September 2026), [Voyager 1 mission history](https://science.nasa.gov/mission/voyager/voyager-1/), and [spacecraft dimensions](https://science.nasa.gov/mission/voyager/spacecraft/). The marker uses no additional third-party image.
