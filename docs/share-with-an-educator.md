# Educator guide

**Scale of the Solar System** is a free, interactive exploration of planetary sizes and distances. It begins with a small Earth and places the other worlds along a single line, using the same scale for their sizes and their distances from the Sun.

**[Try the app](https://dougwhite.github.io/scale-of-the-solar-system/)** · **[Source code and downloads](https://github.com/dougwhite/scale-of-the-solar-system)**

## Getting started

Open the app in a browser on a phone, tablet or computer. No account or installation is required for the online version.

- Swipe or scroll to move through space. Up moves toward the Sun; down moves outward.
- Use the previous/next buttons or side markers to travel to a particular world. Tap the background to stop an automatic journey.
- Pinch or use the zoom controls to change scale. **Fit object** brings a whole body into view; the home button returns to Earth at the starting scale.
- Select the **?** beside a world's name for its size, distance and a fact. The Gaspra and Arrokoth popups include spacecraft images.
- Open **i** for a reflection on scale, the current kilometres-per-pixel readout, scientific notes and credits.

Automatic journeys make long distances practical to explore. Manual scrolling provides a different impression of just how much space lies between objects.

## Learning intentions

Activities can be adapted to learners' age, prior knowledge and available time. Learners can work toward:

- Comparing the sizes of planets and the Sun using a consistent scale.
- Recognising that the distances between worlds are much larger than the worlds themselves.
- Using ratios, estimates and astronomical units to describe scale.
- Explaining why a diagram that shows every planet clearly may distort their relative sizes or spacing.
- Identifying what a scientific model represents, what it simplifies and what it cannot establish.
- Distinguishing observed solar-system objects from the hypothetical Planet X.

Possible evidence of learning includes an annotated comparison, a justified estimate, or a short explanation of one useful feature and one limitation of the model.

## Suggested classroom sequence

### 1. Predict before exploring

Begin at Earth without changing the zoom. Ask learners to predict how many screenfuls might separate Earth and Mars, and to explain their reasoning.

Scroll manually for a while, then begin an automatic journey and observe the remaining-screenfuls estimate. Compare the experience with the predictions. Screenful counts depend on the device and zoom, so keep those consistent when comparing results.

**Discussion:** What did the empty space communicate that a familiar solar-system poster might not?

### 2. Compare sizes at one scale

Travel to the Sun and choose **Fit object**. Then travel to Earth using its side marker, keeping the zoom unchanged. Avoid the home button here, because it resets the zoom.

Repeat with Jupiter and Earth. Invite learners to describe the comparison before checking the numerical diameters in the popups.

**Discussion:** Why is it difficult to show both the Sun's size and the inner planets' separation on a single printed page?

### 3. Explore the regions between planets

Visit Gaspra in the asteroid belt and Arrokoth in the Kuiper belt. Read the object details, inspect the images and compare the regions' stated radial spans.

**Discussion:** Does a belt imply a tightly packed wall of objects? What does the app's use of a tiny location marker tell us about the challenge of representing a small body at planetary scale?

### 4. Critique the model

Compare a manual swipe with an automatic journey, then read **A note on the scale** in the **i** popup.

Ask learners to sort features into three categories: physically scaled quantities, illustrative elements and uncertain hypotheses.

**Discussion:** Which compromises help understanding? Which could create a misconception if they were not explained?

### 5. Reflect

Read **Mostly, it's space** in the **i** popup, individually or as a group.

**Exit prompt:** What changed in your understanding of the solar system's scale? Support the answer with one observation from the app, and name one thing the app cannot show accurately.

## Optional mathematical extensions

- Use the diameter values to calculate how many Earth diameters fit across Jupiter or the Sun. Distinguish a comparison of diameters from a comparison of volumes.
- Use **1 AU = 149,597,870.7 km** and the scale readout to estimate the pixel distance from the Sun to Earth.
- Calculate the difference between two displayed mean orbital distances. Explain why that difference is a separation in this straight-line model, not necessarily the current distance between the actual planets.
- Design a scale model for a classroom, corridor or playground. Decide what can fit and which objects would become too small to see.

## Important model limitations

- This is a one-dimensional scale illustration, not an orbital simulation. Worlds are arranged by approximate mean distance from the Sun, not their positions today.
- Body sizes, radial distances and manual scrolling share one linear scale. Values and belt boundaries are rounded.
- Automatic travel time is compressed for exploration and is not a physical speed. A longer animation is not a measurement of light-travel time.
- Background stars, belt guide particles and small-body locator markers are illustrative. Their displayed density or size should not be treated as measured data.
- Gaspra and Arrokoth are specific examples, not statistical averages of their populations. Their photos appear in the detail popups rather than as enlarged objects in the scene.
- Planet X remains hypothetical. Its displayed size and position illustrate proposed possibilities, not a confirmed discovery.
- The model ends well inside the wider reaches of the solar system. It does not represent the full extent of the solar system, the galaxy or the universe.

Scientific references and image credits are available in the app and in [the third-party notices](../THIRD_PARTY_NOTICES.md). See [the model notes](model.md) for implementation details.

## Reuse and self-hosting

The code and original text are available under the [MIT licence](../LICENSE), including for adaptation. Third-party images retain their own licences and source credits; preserve the [attribution notices](../THIRD_PARTY_NOTICES.md) when reusing the material.

For local use, download and extract a [release](https://github.com/dougwhite/scale-of-the-solar-system/releases/latest), install Node.js 20 or newer, and run `bash start.sh` on Linux/macOS or `start.bat` on Windows. The launcher prints a network URL that devices on the same Wi-Fi can open. Alternatively, the `dist/` folder can be placed on a static web host. The [README](../README.md) contains setup instructions.
