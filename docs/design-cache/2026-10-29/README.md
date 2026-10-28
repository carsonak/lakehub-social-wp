# Figma evidence cache — 29 October 2026

Source: [LakeHub production, final pages](https://www.figma.com/design/w9CKeLbqHoTXQczTCfsyyi/LakeHub-production?node-id=134-2). Retrieved directly through the Figma MCP on this date, not inferred from the September exports. The file has two canvases: `134:2` final pages and `1347:7` Design system. File-session ID: `c3f6ed43-26fe-43c3-9828-ceb0b2d2b260`.

## Read this cache first

- `frame-index.json`: every top-level frame, source ID, dimensions and layer count on both canvases.
- `final-pages.xml` and `design-system.xml`: full returned layer geometry, text labels, node IDs and hidden flags. Metadata does not contain full styling or constraints.
- `*-context.txt`: returned design reference code and instructions, with local asset prefixes. Translate these into the existing native WordPress block theme; do not ship the generated React or screenshots as page markup.
- `style-inventory.json`: searchable per-context colours, fonts, type sizes, line heights and node/class mappings. Values are extracted from the reference code, not independently reconciled tokens.
- `asset-usage.json`: reference variable → local asset path. `assets-manifest.json`: downloaded file sizes and SHA256 checksums. Identical hashes identify duplicates across contexts.
- `*-render.png`: full-resolution renders. `*-context.png`: smaller initial context screenshots, except Impact's full-frame screenshot. Renders may include overflowing/off-frame content; the named page frames are 1280px wide. Use the layer geometry to distinguish the intended page from off-frame drafts.
- `site-hero-baseline.json`: read-only browser measurements at 1280px before any alignment correction. This is site evidence, not a design specification.

The cache has 99 successful downloads (82 unique file hashes), including source images/SVGs and full-resolution renders, totalling 47,403,685 bytes. All recorded downloads have checksums and nonempty files. Expiring asset URLs are removed from durable reference files. Raw responses remain in ignored `.runtime/figma-cache/2026-10-29/`; do not commit their temporary URLs. This dated snapshot is evidence as retrieved, not proof that future Figma edits are unchanged.

## Coverage and limits

| Reference | Node | Evidence available | Gaps |
| --- | --- | --- | --- |
| Home | 615:348 | Full context, layer inventory, native-resolution render, assets | No dedicated mobile frame found |
| Programs | 299:174 | Full context, layer inventory, native-resolution render, assets | Footer extends beyond frame bounds |
| About | 380:71 | Full context, layer inventory, native-resolution render, assets | Contains off-frame team placeholders; distinguish from approved visible cards |
| Impact | 409:150 | Full inventory and native-resolution render | Full context returned sparse metadata because of size |
| Impact main | 409:185 | Full context, screenshot and assets for hero/community projects and overflowing transformation/footer layers | Story and large halftone frame outside this subtree have geometry/render evidence, not complete styling context |
| Blog template | 1272:5 | Full context, layer inventory, native-resolution render, assets | Some returned implementation notes need interpretation for WordPress |
| Separate transformation proposal | 1274:702 | Full context, inventory, native-resolution render, assets | Separate proposal; do not silently replace current design without choosing the intended version |
| Design system | 1347:7 | Complete layer inventory | Canvas itself cannot return context without a selected layer |
| Base colour palettes | 1347:4189 | Full context, screenshot and supplied asset | Reconcile generic palette with actual page styles before using |
| Neutral colours | 1347:4699 | Sparse metadata | No full styling context; oversized response |
| Text styles / Border radius | 1347:4104 / 1347:5871 | Full page metadata, labels and values | Context requests reached Starter-plan limit |

No dedicated Team, Coming Soon or mobile page frames appear in the two returned canvas inventories. About contains team design material. Preserve existing responsive behavior unless actual mobile evidence is supplied.

`variables.json` returned an empty object for Home; it is not evidence that the entire file has no variables. The identity diagnostic confirmed Starter plans with View seats after the call limit was reached. Account personal details were not saved here. Do not spend more calls retrying blocked context requests until access resets.

## Confirmed hero differences

At the 1280px design width, Home uses Hanken Grotesk 76/70px, weight 800; Programs 56/70px, weight 800; About 56/56px, weight 700; Impact 56/52px, weight 700. On 29 October the user explicitly chose to match each Figma frame's original sizes, superseding the earlier uniform-size request.

The current site forces 76/83.6px and weight 800 on all four. About's heading starts at x=170 and uses a 940px box, versus Figma x=108 and a 1064px box. Home uses a 780px heading box versus a 724px design text box; the design text centre is x=648. Impact's 672px text width is already correct, but its larger site type makes five lines and enlarges the cover beyond its 480px design height. Match rendered glyph placement and line breaks, not only heading container boxes.

Home's generated design positions text through nested centre transforms: the heading wrapper is x=397.5, y=184, width=501; its text box is centred horizontally, width=724, and centred vertically at wrapper y=61. Programs uses text x=363, a centre y=223 within the hero, and its button at y=343. About's text is vertically centred; Impact's text centre is x=635 and sits inside a container starting at y=64. All coordinates here are relative to the corresponding parent in the cached context; consult the hierarchy before translating them to page coordinates.

## Reuse and refresh

Read this index and the exact relevant subtree before requesting MCP again. Prefer small missing child nodes over rereading whole pages, and record sparse/failed responses honestly. Download any newly returned assets promptly, keep raw transport responses ignored, add local paths/checksums and provenance to a new dated cache, and retain this snapshot for comparison. September PNG/SVG exports in `docs/design-exports/` remain historical evidence with their original provenance.

Interactivity and animations are deliberately outside the static design-parity audit. Preserve existing hover, focus, pointer, carousel, keyboard and reduced-motion behavior.
