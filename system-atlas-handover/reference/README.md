# Reference mockups

| File | What it is |
|---|---|
| `A2-Explorer.html` | **The approved product mockup.** Camera, search, replay, payloads, integration arcs. Open it in Chrome; no server needed. |
| `A-Metropolis-north-star.html` | Iteration 1 of the city. Use it for mood only: atmosphere, density, glow. |
| `support.js` | A ~100-line template stub so the two pages run in a plain browser. It interprets `{{holes}}`, `<sc-for>`, `<sc-if>`, `<helmet>` and `on*` handlers. **Not production code.** |

## How to read the mockup code

All geometry is computed in one class, `Component`, in the `<script type="text/x-dc">` block at the bottom of the page:

| Method | What it holds |
|---|---|
| `data()` | Transactions (`mk(...)`), integrations (`E`). The same data is exported to `../fixtures/` |
| `geo(az, el, mode)` | Perspective camera, building archetypes, transit hub, ground grid, arc geometry. Cached per camera pose |
| `payload(tx, call, reveal)` | Request/response text per integration type |
| `sampleFor` / `samplePayload` | Simulated live tail. **Production replaces this with the SSE tail endpoint** |
| `tokLine` | Payload syntax-tinting rules |
| `renderVals()` | Zoom framing, replay phases, packets, bubble, explorer filtering, inspector content, replay bar |
| `disp(t)` / `msOf(d)` | The time lens and its inverse |

Values worth copying exactly: the time lens, replay phase windows (TR = 0.9% of track), camera defaults and limits, drag/zoom factors, arc lift formula, colors and type sizes.

Things to **not** copy:
- the SVG painter's-algorithm rendering (use WebGL)
- the CSS-transform zoom (use a camera dolly or an equivalent)
- the simulated live samples
- the hard-coded hero data in UI strings (labels such as `canary queue 37` must come from data)

The two reference pages always open at the same starting state. To see the arc-inspection state, click the retrieval-svc → vector-store diamond. `startView` is a property of the design canvas and has no effect here.
