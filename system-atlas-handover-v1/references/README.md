# Approved reference images

The two original PNGs in this folder are the only approved visual directions for this implementation. They were generated during the design exploration and are included unchanged.

| Reference | Approved role | Preserve |
| --- | --- | --- |
| `05A_precision_trace.png` | Specific-transaction introspection and live demonstration | Dark navy space, translucent service gates, precise blue/violet geometry, amber focused execution, clear labels, inspector and playback |
| `07_topographic_atlas.png` | Whole-system bird’s-eye view | Nested contour territories, restrained relief, component glyphs, distinct system regions, request/response routes and overview context |

Both are 1672 × 941 pixels. `manifest.json` records file hashes, provenance and roles. PNGs are design references, not editable source meshes. No 3D models, Figma components or animations were generated or supplied in this package.

## Interpret rather than trace pixels blindly

Use the silhouettes, composition, depth, palette and hierarchy as visual targets. Build reusable geometry. Do not crop the screenshot into UI controls or use it as a fake interactive backdrop.

Text, arrows, data placement and synthetic timing in the images are illustrative. The product/data specifications take precedence over these details. In particular:

- In 07, the model deployment/lineage connection must terminate at the actual model deployment or inference instance, not at Vector DB just because a violet line appears nearby in the image.
- Arrowheads in 07 must reflect observed direction. Simplify duplicated or ambiguous arrowheads; do not imply bidirectional traffic without evidence.
- In 05A, architectural position is not elapsed time. Exact timing lives in the synchronized span timeline. Keep concurrent spans active together instead of assuming one sequential foreground gate.
- Response delivery follows captured application relationships; it is not automatically a reverse network-packet animation.
- Unknown states, incomplete traces and disconnected sources must remain visible, even though the approved images illustrate completed example requests.

Earlier concepts 01, 01R, 02, 03, 04, 05B, 05C and 06 are deliberately excluded from the implementation direction. The owner’s final selection supersedes the earlier preference for 01.
