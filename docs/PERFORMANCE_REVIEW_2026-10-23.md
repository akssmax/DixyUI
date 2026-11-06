# Playground performance review — 2026-10-23

Scope: production playground, theme authoring and procedural-frame costs. Applied the web-perf skill. Used Codex's in-app browser and local production output; no separate Chrome instance or dependency was added.

## Measurements and limits

| Check                          | Result                                                                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Performance trace / Lighthouse | No compatible trace tool exposed by this session. Not collected.                                                                                              |
| LCP / INP / CLS / FCP / TTFB   | Not measured. The browser's read-only DOM evaluation did not expose Performance entries. No Web Vitals ratings are claimed.                                   |
| Initial JS                     | Static eager import graph of the emitted index and playground entries, recursively following static local imports. This is not an observed network waterfall. |
| Accessibility                  | Existing controls remained named and operable in the browser smoke test. No full contrast, AT, zoom or conformance audit.                                     |
| Hardware / mobile              | Remain user-deferred. No FPS, energy or low-end-device claims.                                                                                                |

Before/after asset lists and browser observations are in output/performance/theme-playground-2026-10-23/.

| Static JS measure                   |    Before |     After |
| ----------------------------------- | --------: | --------: |
| Eager graph raw bytes               | 1,882,256 | 1,875,832 |
| Sum of individually gzipped modules |   540,717 |   538,676 |
| Playground route raw bytes          |    46,242 |    40,562 |
| Playground route gzip bytes         |    12,804 |    11,275 |

The total gzip reduction is 2,041 bytes, approximately 0.38%. These are local emitted-asset measurements; production encoding, caching, network conditions and browser compilation costs were not measured. The graph still contains a 1,088,513-byte shared UI module (332,780 bytes gzip). Lazy imports alone do not solve its shared-bundle hoisting.

## Changes made

- Export generation is gated on the open dialog and memoized by format/preset. Previously the JSX code prop invoked React/CSS/JSON exporters even while the portal was closed. Closed exports now do no export generation, and unrelated dialog state no longer regenerates unchanged output.
- The all-components gallery is dynamically imported only when selected. Individual previews retain their existing visibility-driven loading.
- Preview props/palette and editable recipe documents are memoized for an unchanged preset. A warm Node microbenchmark of the original custom palette calculation took 31.9 ms for 2,000 calls, about 0.016 ms per call. This did not justify a separate global palette cache or changes to color math.
- Existing custom stylesheet text is replaced only when CSS differs. Installed-style checks use the already-found node instead of another full scan. Authored styles have an eight-node defensive cap, protecting the active ID and retaining finite installed packs. The existing compiled-document cache remains capped at eight.

No public component contract, core CSS, material/frame visuals or runtime graphics dependency changed.

## Remaining priorities

1. **Initial shared UI bundle.** The shared module is roughly 333 KB gzip, far larger than the 2 KB saved here. Examine critical primitive/module boundaries and bundler chunk strategy with traces before a larger refactor. Simply adding lazy wrappers did not materially reduce that shared module and was not retained.
2. **Forest SVG complexity.** In the tested Overview, Forest produced 3,829 document elements and 3,110 descendants inside preview SVGs. Keeping the same material but selecting No frame produced 618 elements and nine SVG descendants. Optional decorative layers account for most of this DOM. Further work could reduce repeated definitions/vein geometry while preserving instance-safe IDs and portal/SSR behavior. These counts do not establish a frame-rate bottleneck.
3. **Get actual device traces.** Capture paint, main-thread and interaction traces, cold/warm network waterfalls and representative target-device behavior before choosing more intrusive optimizations. Do not infer good/poor Web Vitals from asset size or DOM counts.

## Verification

pnpm check passed 150 tests, type/freshness checks, 1462 complete examples and production builds. Focused formatting passed. Public packages/CSS were unchanged, so package:check was not required for this docs-only slice.

The production in-app browser verified deferred gallery loading, current-theme export text, absence of closed export code nodes, theme changes and nine sequential ephemeral document imports. Those imports retained one current custom stylesheet; the test did not force an eight-entry eviction path. No audit theme was saved to the user's local theme shelf. Console warnings/errors were empty. Final screenshot: output/performance/theme-playground-2026-10-23/verified-playground.png. The audit tab was closed and user tabs were left alone. Implementation does not establish personal mastery.
